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
     * Return a heading template
     *
     * @param string heading
     */
    function heading(heading)
    {
        return "<h2 class='h4 sidebar__heading'>" + heading + "</h2>";
    }

    
    

    
    /**
     * Functions available to the public
     */
    return {
        transactionStatus: transactionStatus,
        heading: heading
    };
})();
