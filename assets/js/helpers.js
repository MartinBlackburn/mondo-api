var App = App || {};

App.Helpers = (function()
{
    // vaiables
    var showDebugMessages = true;
    
    
    
    
    
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
     * Get a paramater from the URL
     * http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/
     */
    function getURLParameter(name)
    {
        var param = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) || null;
        
        App.Helpers.debugMessage("URL param '" + name + "': " + param);
        
        return param;
    }
    
    
    
    
    
    /**
     * Show format currency
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
     * Functions available to the public
     */
    return {
        debugMessage: debugMessage,
        getURLParameter: getURLParameter,
        formatCurrency: formatCurrency
    };
})();
