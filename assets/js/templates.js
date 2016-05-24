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
     * @param string heading
     */
    function merchantLogo(logoPath)
    {
        var merchantLogoTemplate = "<div class='transaction__logo'></div>";
        
        if(logoPath) {
            merchantLogo = "<div class='transaction__logo'><img src='" + logoPath + "' /></div>";
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
