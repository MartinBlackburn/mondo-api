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
     * Functions available to the public
     */
    return {
        transactionStatus: transactionStatus,
        sidebarHeading: sidebarHeading,
        merchantLogo: merchantLogo
    };
})();
