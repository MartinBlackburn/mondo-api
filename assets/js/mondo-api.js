var App = App || {};

App.MondoAPI = (function()
{
    // App settings
    var showDebugMessages = true;
    
    // client variables
    var clientId = 'oauthclient_000097OK5VuXaYsd2w86Ov';
    var clientSecret = 'm3G7BUl5bll9CJMduCVBf4HWzmVfyBXOoNGaSDOzCKrK8cPthAA0Ri9aZlQwoK+7kk+Wh2odb6qSixDOic9U';
    var redirectUri = 'https://dl.dropboxusercontent.com/u/18441802/Mondo-API/index.html';
    
    // auth variables
    var stateToken = App.Cookies.readCookie("stateToken");
    var mondoStateToken = getURLParameter('state');
    var authCode = getURLParameter('code');
    var accessToken = App.Cookies.readCookie("accessToken");
    
    // account variables
    var userId = null;
    var accountId = App.Cookies.readCookie("accountId");

    // display containers
    var transactionsContainer = $(".js-transactions");
    var balanceContainer = $(".js-balance");
    var currentBalanceContainer = $(".js-currentBalance");
    var spentContainer = $(".js-spent");
    var loginButton = $(".js-loginButton");




    /**
     * Setup API
     */
    function init()
    {        
        // add login button
        addLoginButton();
        
        // set a stateToken if needed
        if(!stateToken) {
            setStateToken();
        }
        
        // got an access token, so update things
        if(accessToken) {
            refreshEverything();
            
            return;
        }
        
        // redirected back - make sure state token matches mondoStateToken
        if(stateToken == mondoStateToken) {
            //get access token from mondo
            getAccessToken();
        }
    }
    
    
    
    
    
    /**
     * Refresh all data
     */
    function refreshEverything()
    {
        debugMessage("Refreshing all data");
        
        loginButton.remove();
        
        getAccount();
        getBalance();
        getTransactions();
    }



    
    /**
     * Add a button to login
     */
    function addLoginButton()
    {
        debugMessage("Adding login button");
        
        var url = "https://auth.getmondo.co.uk/?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=code&state=" + stateToken;
        
        loginButton.attr("href", url);
    }
    
    
    
    
    
    /**
     * Get state token for protection against cross site requests (required by mondo)
     */
    function setStateToken()
    {
        debugMessage("Setting state token");
        
        // generate random token
        stateToken = 'id-' + Math.random().toString(36).substr(2, 16);
        
        // set token in cookie
        App.Cookies.setCookie("stateToken", stateToken, 60);
    }
    
    
    
    
    
    /**
     * Get access token
     */
    function getAccessToken()
    {
        debugMessage("Getting access token");
        
        var url = "https://api.getmondo.co.uk/oauth2/token";
        var data = {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code: authCode
        };
        
        makeRequest(url, data, setAccessToken);
    }
    
    /**
     * Set access token
     * Then refresh all data
     */
    function setAccessToken(data)
    {
        debugMessage("Setting access token");
        debugMessage(data);
        
        accessToken = data.access_token;
        userId = data.user_id;
        
        App.Cookies.setCookie("accessToken", accessToken, 60);
        
        refreshEverything();
    }
    
    
    
    
    
    /**
     * Get account
     */
    function getAccount()
    {
        debugMessage("Getting account");
        
        var url = "https://api.getmondo.co.uk/accounts";
        
        // only make the request if no account id already
        if(!accountId) {
            makeRequest(url, null, setAccount);
        }
    }
    
    /**
     * Set account
     */
    function setAccount(data)
    {
        debugMessage("Setting account");
        debugMessage(data);
        
        accountId = data.accounts[0].id;
        
        App.Cookies.setCookie("accountId", accountId, 60);
    }
    
    
    
    
    
    /**
     * Get balance
     */
    function getBalance()
    {
        debugMessage("Getting balance");
        
        var url = "https://api.getmondo.co.uk/balance";
        var data = {
            account_id: accountId
        };
        
        makeRequest(url, data, setBalance);
    }
    
    /**
     * Set balance
     */
    function setBalance(data)
    {
        debugMessage("Setting balance");
        debugMessage(data);
        
        currentBalanceContainer.text(formatCurrency(data.balance, data.currency));
        spentContainer.text(formatCurrency(data.spend_today, data.currency));
    }
    
    
    
    
    
    /**
     * Get transactions
     */
    function getTransactions()
    {
        debugMessage("Getting transactions");
        
        var url = "https://api.getmondo.co.uk/transactions";
        var data = {
            'expand[]': 'merchant',
            account_id: accountId,
            limit: 100,
            
        };
        
        makeRequest(url, data, setTransactions);
    }
    
    /**
     * Set transactions
     */
    function setTransactions(data)
    {
        debugMessage("Setting transactions");
        debugMessage(data);
        
        // clear old transactions first
        transactionsContainer.empty();
        
        // remove existing map markers
        App.Map.deleteMarkers();
        
        // reverse transactions so newest first
        data.transactions = data.transactions.reverse();
        
        var lastHeading = '';
        
        // add new transactions
        $.each(data.transactions, function(key, transaction) {
            // transaction amount classes
            var transactionAmountClasses = "transaction__amount";
            if(transaction.amount > 0) {
                transactionAmountClasses += " transaction__amount--positive";
            }
            
            // get merchant icon
            var merchantLogo = "<div class='transaction__logo'></div>";
            if(transaction.merchant && transaction.merchant.logo) {
                merchantLogo = "<div class='transaction__logo'><img src='" + transaction.merchant.logo + "' /></div>";
            }
            
            // get transaction name
            var transactionName = 'Mondo top-up';
            if(transaction.merchant) {
                transactionName = transaction.merchant.name;
            }
            
            // format transaction date
            var transactionDate = new Date(transaction.created);
            
            var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var hours = transactionDate.getHours();
            if(hours < 10) {
                hours = "0" + hours;
            }
            
            var minutes = transactionDate.getMinutes();
            if(minutes < 10) {
                minutes = "0" + minutes;
            }
            
            var transactionFormattedDay = dayName[transactionDate.getDay()];
            var transactionFormattedDate = transactionDate.getDate() + " " + monthNames[transactionDate.getMonth()] + " " + transactionDate.getFullYear();
            var transactionFormattedTime = hours + ":" + minutes;
            
            // heading template
            var headingTemplate = "<h2 class='h4 sidebar__heading'>" + transactionFormattedDay + " " + transactionFormattedDate + "</h2>";
            
            // transaction template
            var transactionTemplate = [
                "<div class='transaction category-" + transaction.category + "'>",
                    merchantLogo,
                    "<div class='transaction__name'>" + transactionName + "</div>",
                    "<div class='" + transactionAmountClasses + "'>" + formatCurrency(transaction.amount, transaction.currency, true) + "</div>",
                "</div>"
            ].join("\n");
            
            // append heading if its changed
            if(headingTemplate != lastHeading) {
                transactionsContainer.append(headingTemplate);
                
                lastHeading = headingTemplate;
            }
            
            // append transaction
            transactionsContainer.append(transactionTemplate);
            
            // build info window for the map
            var infoWindowTemplate = [
                "<div class='infoWindow'>",
                    "<div class='infoWindow__name'>" + transactionName + "</div>",
                    "<div class='infoWindow__date'>" + transactionFormattedDate + " at " + transactionFormattedTime + "</div>",
                    "<div class='infoWindow__amount'>" + formatCurrency(transaction.amount, transaction.currency, true) + "</div>",
                "</div>"
            ].join("\n");
            
            // add transaction to the map
            if(transaction.merchant && transaction.merchant.address.latitude) {
                var payload = {
                    lat: transaction.merchant.address.latitude,
                    lng: transaction.merchant.address.longitude,
                    title: transactionName,
                    info: infoWindowTemplate,
                    timeout: key * 200
                }
                App.Map.addMarker(payload);
            }
        });
    }
    
    
    
    
    
    /**
     * Make request
     */
    function makeRequest(url, data, callback)
    {
        var request = {
            dataType: "json",
            url: url,
            method: 'GET',
            cache: false,
            async: false,
            success: callback,
            error: loadingError
        };
        
        if(url == 'https://api.getmondo.co.uk/oauth2/token') {
            request.method = 'POST';
        }
        
        if(data) {
            request.data = data;
        }
        
        if(accessToken) {
            request.headers = {'Authorization': 'Bearer ' + accessToken};
        }
        
        debugMessage("----------");
        debugMessage("Making request");
        debugMessage("URL: " + request.url);
        debugMessage("Method: " + request.method);
        debugMessage("Data: ");
        debugMessage(request.data);
        debugMessage("----------");

        $.ajax(request);
    }
    
    
    
    
    
    /**
     * Error when unable to load items
     */
    function loadingError(xhr, errorType, exception)
    {
        // log error
        console.error("Error");
        console.log(xhr);
        console.log(errorType);
        console.log(exception);
    }
    
    
    
    
    
    /**
     * Get a paramater from the URL
     * http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/
     */
    function getURLParameter(name)
    {
        var param = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
        
        debugMessage("URL param '" + name + "': " + param);
        
        return param;
    }
    
    
    
    
    
    /**
     * Show debug messages
     */
    function formatCurrency(amount, currencyCode, makePositive)
    {
        var currencySymbol = [];
        currencySymbol['GBP'] = "£";
        currencySymbol['USD'] = "$";
        currencySymbol['EUR'] = "€";
        
        if(amount < 0 && makePositive) {
            amount = amount * -1;
        }
        
        var amount = amount / 100;        
        
        return currencySymbol[currencyCode] + amount.toFixed(2);
    }
    
    
    
    
    
    /**
     * Show debug messages
     */
    function debugMessage(message)
    {
        if(showDebugMessages) {
            console.log(message);
        }
    }
    
    
    /**
     * Functions available to the public
     */
    return {
        init: init,
    };
})();
