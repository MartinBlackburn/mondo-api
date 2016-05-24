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
     * Format currency
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
     * Format date
     */
    function formatDateFromString(inputDate)
    {
        // date object to return
        var dateObject = {};
        
        // day and month names
        var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        var date = new Date(inputDate);
        
        // add leading 0 to hours
        var hours = date.getHours();
        if(hours < 10) {
            hours = "0" + hours;
        }
        
        // add leading 0 to minutes
        var minutes = date.getMinutes();
        if(minutes < 10) {
            minutes = "0" + minutes;
        }
        
        // create custom date object
        dateObject.time = hours + ":" + minutes;        
        dateObject.dayName = dayNames[date.getDay()];
        dateObject.day = date.getDate();
        dateObject.monthName = monthNames[date.getMonth()];
        dateObject.month = date.getMonth() + 1;
        dateObject.year = date.getFullYear();
        dateObject.stringShort = dateObject.day + "/" + dateObject.month + "/" + dateObject.year;
        dateObject.stringLong = dateObject.day + " " + dateObject.monthName + " " + dateObject.year;
        dateObject.stringWithTime = dateObject.day + " " + dateObject.monthName + " " + dateObject.year + " at " dateObject.time;
        
        return dateObject;
    }





    /**
     * Functions available to the public
     */
    return {
        debugMessage: debugMessage,
        getURLParameter: getURLParameter,
        formatCurrency: formatCurrency,
        formatDateFromString: formatDateFromString
    };
})();
