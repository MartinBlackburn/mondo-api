var App = App || {};

App.MondoAPI = (function()
{
    // App settings
    var showDebugMessages = true;
    
    // client variables
    var clientId = App.Cookies.readCookie("clientId");
    var clientSecret = App.Cookies.readCookie("clientSecret");
    var redirectUri = 'http://martinblackburn.github.io/mondo-api/';
    
    // auth variables
    var stateToken = App.Cookies.readCookie("stateToken");
    var mondoStateToken = App.Helpers.getURLParameter('state');
    var authCode = App.Helpers.getURLParameter('code');
    var accessToken = App.Cookies.readCookie("accessToken");
    
    // account variables
    var userId = null;
    var accountId = App.Cookies.readCookie("accountId");

    // display containers
    var transactionsContainer = $(".js-transactions");
    var balanceContainer = $(".js-balance").hide();
    var currentBalanceContainer = $(".js-currentBalance");
    var spentContainer = $(".js-spent");
    var loginDisplay = $(".js-loginDisplay");
    var loginButton = $(".js-loginButton");
    var clientIdDisplay = $(".js-clientId");
    var clientSecretDisplay = $(".js-clientSecret");




    /**
     * Setup API
     */
    function init()
    {        
        // add login stuff
        addLoginDisplay();
        
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
        App.Helpers.debugMessage("Refreshing all data");
        
        loginDisplay.remove();
        
        balanceContainer.show();
        
        getAccount();
        getBalance();
        getTransactions();
    }



    
    /**
     * Add a button to login
     */
    function addLoginDisplay()
    {
        App.Helpers.debugMessage("Adding login display");
        
        if(clientId) {
            clientIdDisplay.val(clientId);
        }
        
        if(clientSecret) {
            clientSecretDisplay.val(clientSecret);
        }
        
        loginButton.on("click", function(event) {
            event.preventDefault();
            
            // set client id and secret
            clientId = clientIdDisplay.val();
            clientSecret = clientSecretDisplay.val();
            App.Cookies.setCookie("clientId", clientId, 525600);
            App.Cookies.setCookie("clientSecret", clientSecret, 525600);
            
            var url = "https://auth.getmondo.co.uk/?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=code&state=" + stateToken;
            
            if(clientId && clientSecret) {
                window.location.href = url;
            }
        });
    }
    
    
    
    
    
    /**
     * Get state token for protection against cross site requests (required by mondo)
     */
    function setStateToken()
    {
        App.Helpers.debugMessage("Setting state token");
        
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
        App.Helpers.debugMessage("Getting access token");
        
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
        App.Helpers.debugMessage("Setting access token");
        App.Helpers.debugMessage(data);
        
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
        App.Helpers.debugMessage("Getting account");
        
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
        App.Helpers.debugMessage("Setting account");
        App.Helpers.debugMessage(data);
        
        accountId = data.accounts[0].id;
        
        App.Cookies.setCookie("accountId", accountId, 60);
    }
    
    
    
    
    
    /**
     * Get balance
     */
    function getBalance()
    {
        App.Helpers.debugMessage("Getting balance");
        
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
        App.Helpers.debugMessage("Setting balance");
        App.Helpers.debugMessage(data);
        
        currentBalanceContainer.text(App.Helpers.formatCurrency(data.balance, data.currency));
        spentContainer.text(App.Helpers.formatCurrency(data.spend_today, data.currency));
    }
    
    
    
    
    
    /**
     * Get transactions
     */
    function getTransactions()
    {
        App.Helpers.debugMessage("Getting transactions");
        
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
        App.Helpers.debugMessage("Setting transactions");
        App.Helpers.debugMessage(data);
        
        // clear old transactions first
        transactionsContainer.empty();
        
        // remove existing map markers
        App.Map.deleteMarkers();
        
        // reverse transactions so newest first
        data.transactions = data.transactions.reverse();
        
        var lastHeading = '';
        
        // add new transactions
        $.each(data.transactions, function(key, transaction) {
            // format transaction details
            var transactionDate = App.Helpers.formatDateFromString(transaction.created);
            var transactionAmount = App.Helpers.formatCurrency(transaction.amount, transaction.currency, true);
            var transactionStatus = getTransactionStatus(transaction);
            var transactionName = 'Mondo';
            if(transaction.merchant) {
                transactionName = transaction.merchant.name;
            }
            
            // heading template
            var headingTemplate = App.Templates.sidebarHeading(transactionDate.dayName + " " + transactionDate.stringLong);
            
            // append heading if its changed
            if(headingTemplate != lastHeading) {
                transactionsContainer.append(headingTemplate);
                
                lastHeading = headingTemplate;
            }
            
            // transaction template
            var transactionTemplate = App.Templates.transation(transaction, transactionName, transactionStatus, transactionAmount);
            
            // append transaction
            transactionsContainer.append(transactionTemplate);
            
            // build info window for the map
            var infoWindowTemplate = App.Templates.infoWindow(transactionName, transactionDate.stringWithTime, transactionAmount);
            
            // add transaction to the map
            var lat = 0;
            var lng = 0;
            
            if(transaction.merchant && transaction.merchant.address.latitude) {
                lat = transaction.merchant.address.latitude;
                lng = transaction.merchant.address.longitude;
            }
            
            var showOnMap = true;
            
            if(lat === 0 || lng === 0) {
                showOnMap = false;
            }
            
            var payload = {
                lat: lat,
                lng: lng,
                title: transactionName,
                info: infoWindowTemplate,
                timeout: key * 100,
                showOnMap: showOnMap
            }
            App.Map.addMarker(payload);
        });
    }
    
    
    
    
    
    /**
     * Get a transaction status
     */
    function getTransactionStatus(transaction)
    {
        var status = "";
        
        // card Top-up
        if(transaction.is_load) {
            status = "Top-up";
        }
        
        // declined status
        if(transaction.decline_reason) {
            var reason = transaction.decline_reason;
            reason = reason.toLowerCase();
            reason = reason.replace("_", " ");
            
            status = "Declined: " + reason;
        }
        
        return status;
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
            error: requestError
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
        
        App.Helpers.debugMessage("----------");
        App.Helpers.debugMessage("Making request");
        App.Helpers.debugMessage("URL: " + request.url);
        App.Helpers.debugMessage("Method: " + request.method);
        App.Helpers.debugMessage("Data: ");
        App.Helpers.debugMessage(request.data);
        App.Helpers.debugMessage("----------");

        $.ajax(request);
    }
    
    
    
    
    
    /**
     * Error when unable to load items
     */
    function requestError(xhr, errorType, exception)
    {
        // log error
        console.error("Error");
        console.log(xhr);
        console.log(errorType);
        console.log(exception);
    }
    
    
    
    
    
    /**
     * Functions available to the public
     */
    return {
        init: init,
    };
})();
