var App = App || {};

App.Templates = (function()
{
    /**
     * Return a transaction status template
     *
     * @param string status
     */
    function transactionStatus(status)
    {
        var statusTemplate = '';
        
        if(status) {
            statusTemplate = "<div class='transaction__status'>" + status + "</div>";
        }
        
        return statusTemplate;
    }
    
    
    
    
    
    /**
     * Return a sidebar heading template
     *
     * @param string heading
     */
    function sidebarHeading(heading)
    {
        return "<h2 class='h4 sidebar__heading'>" + heading + "</h2>";
    }
    
    
    
    
    
    /**
     * Return a merchant logo template
     *
     * @param object transaction
     */
    function merchantLogo(transaction)
    {        
        var merchantLogoTemplate = "<div class='transaction__logo'></div>";
        
        if(transaction.merchant && transaction.merchant.logo) {
            merchantLogoTemplate = "<div class='transaction__logo'><img src='" + transaction.merchant.logo + "' /></div>";
        }
        
        return merchantLogoTemplate;
    }

    
    

    
    /**
     * Return a transaction template
     *
     * @param object transaction
     */
    function transation(transaction, transationName, status)
    {
        // transation amount classes
        var transactionAmountClasses = "transaction__amount";
        if(transaction.amount > 0) {
            transactionAmountClasses += " transaction__amount--positive";
        }
        
        if(transaction.decline_reason) {
            transactionAmountClasses += " transaction__amount--declined";
        }
        
        var transactionTemplate = [
            "<div class='transaction category-" + transaction.category + "'>",
                merchantLogo(transaction),
                "<div class='transaction__info'>",
                    "<div class='transaction__name'>" + transactionName + "</div>",
                    transactionStatus(status),
                "</div>",
                "<div class='" + transactionAmountClasses + "'>" + App.Helpers.formatCurrency(transaction.amount, transaction.currency, true) + "</div>",
            "</div>"
        ].join("\n");
        
        return transactionTemplate;
    }
    
    
    
    
    
    /**
     * Functions available to the public
     */
    return {
        transactionStatus: transactionStatus,
        sidebarHeading: sidebarHeading,
        merchantLogo: merchantLogo,
        transation: transation
    };
})();
