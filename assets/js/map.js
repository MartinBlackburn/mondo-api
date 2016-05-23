var App = App || {};

App.Map = (function()
{
    //variables
    var map;
    var mapOptions;
    var zoomLevel = 10;
    var markers = [];
    var bounds = new google.maps.LatLngBounds();
    var infoWindow = new google.maps.InfoWindow({content: "holding..."});

    //display containers
    var mapContainer = $(".js-map")[0];





    /**
     * Setup map
     */
    function init()
    {
        mapOptions = {
            Zoom: zoomLevel,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        map = new google.maps.Map(mapContainer, mapOptions);
        
        map.setCenter({lat: 53.80076, lng: -1.54908});
    }





    /**
     * Add a marker
     *
     * payload = {
     * 		lat: float
     * 		lng: float
     * 		title: string
     * 		info: html string
     * 		timeout: int,
     * 		showOnMap: boolean 		
     * }
     */
    function addMarker(payload)
    {
        // create location object
        var location = new google.maps.LatLng({lat: payload.lat, lng: payload.lng}); 
        
        // hide marker unless asked for
        var mapRef = null;
        
        if(payload.showOnMap) {
            mapRef = map;
            
            // extand map bouns to include marker
            bounds.extend(location);
            
            // fit map to bounds
            map.fitBounds(bounds);
        }
        
        // set timout to drop markers at differnt points
        window.setTimeout(function() {
            // create maker
            var marker = new google.maps.Marker({
                position: location,
                map: mapRef,
                animation: google.maps.Animation.DROP,
                title: payload.title
            });
            
            // event listener for info window
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(payload.info);
                infoWindow.open(map, marker);
            });
            
            // add marker to array
            markers.push(marker);
        }, payload.timeout);
    }    
    
    /**
     * Delete all markers
     */
    function deleteMarkers()
    {
        // set each marker to have no map
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
  
        // remove markers from the array
        markers = [];
        
        //empty map bounds
        bounds = new google.maps.LatLngBounds();
    }





    /**
     * Functions available to the public
     */
    return {
        init: init,
        addMarker: addMarker,
        deleteMarkers: deleteMarkers
    };
})();
