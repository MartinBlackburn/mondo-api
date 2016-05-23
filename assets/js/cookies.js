var App = App || {};

App.Cookies = (function()
{
    /**
     * Set a value in a cookie
     */
    function setCookie(name, value, mins)
    {
        if (mins) {
            var date = new Date();
            date.setTime(date.getTime() + (mins * 60 * 1000));
            var expires = "; expires=" + date.toUTCString();
    	} else {
            var expires = "";
        }
        
    	document.cookie = name + "=" + value + expires + "; path=/";
    }





    /**
     * Read a value from a cookie
     */
    function readCookie(name)
    {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        
        for(var i=0; i < ca.length; i++) {
            var c = ca[i];
        
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        
        return null;
    }
    
    
    
    
    
    /**
     * Delete a cookie
     */
    function deleteCookie(name) {
    	setCookie(name, "", -1);
    }
    
    
    
    
    
    /**
     * Functions available to the public
     */
    return {
        setCookie: setCookie,
        readCookie: readCookie,
        deleteCookie: deleteCookie,
    };
})();
