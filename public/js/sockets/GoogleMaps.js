var googleMap;
var apiCall = false;

var GoogleMaps = function(socket, roomId){

    this.socket     = socket;
    this.roomId     = roomId;
    this.markers    = [];

    /**
     * Type : Socket listener.
     * Fires: When initial data arrives.
     * Do   : Creates map with following data.
     */
    this.initalize = function(data){
        var mapOptions = {
            center: new google.maps.LatLng(data.mapCenter.lat, data.mapCenter.lng),
            zoom: data.zoom,
            navigationControl: true,
            panControl: false,
            zoomControl: true,
            streetViewControl: true,
            scaleControl: true,
            rotateControl: true,
            overviewMapControl: true
        };
        googleMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        this.setMapType(data.type);


        return googleMap;
    };


    /**
     * Type : Google Map Event listener.
     * Fires: When zoom of the map has been changed.
     * Do   : Send information about zoom, that has been changed.
     */
    this.onZoomChangedGet = function(event) {
        if(!apiCall) {
            this.onCenterChangedGet(undefined);
            var zoom = googleMap.getZoom();

            socket.emit('google/map/zoom/change', {
                zoom: zoom,
                roomId: this.roomId
            });
        }

        apiCall = false;
    }.bind(this);

    /**
     * Type : Socket listener.
     * Fires: When socket message with zoom level arrives
     * Do   : Sets zoom level to following
     */
    this.onZoomChangedSet = function(data) {
        apiCall = true;
        googleMap.setZoom(data);
    };

    /**
     * Type : Google Map Event listener.
     * Fires: When center of the map has been changed
     * Do   : Send information about center of the map.
     */
    this.onCenterChangedGet   = function(event){
        var mapCenter = googleMap.getCenter();
        mapCenter = {
            lat: mapCenter.lat(),
            lng: mapCenter.lng(),
            roomId: this.roomId
        };
        socket.emit('google/map/center/change', mapCenter);
    }.bind(this);

    /**
     * Type : Socket listener.
     * Fires: When socket message with center of the map arrives.
     * Do   : Sets center of the map to the following one.
     */
    this.onCenterChangedSet     = function(data) {
        var location = new google.maps.LatLng(data.lat, data.lng);
        googleMap.panTo(location);
    };

    /**
     * Type : Google Map Event listener.
     * Fires: When right button has been clicked on the map
     * Do   : Send information about position of clicked place, to create an marker.
     */
    this.onRightClickGet = function(event){
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        socket.emit('google/map/marker/change', {lat: lat, lng: lng, roomId: this.roomId});
    }.bind(this);


    /**
     * Type : Socket listener.
     * Fires: When socket message with position arrives
     * Do   : Creates new marker on the map
     */
    this.createMarker = function(data) {

        //create marker
        var marker = new google.maps.Marker({
            position: {lat: data.lat, lng: data.lng},
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            markerId       : data.id
        });

        //add listeners
        google.maps.event.addListener(marker, 'dragend', function(event){
            socket.emit('google/map/marker/position/change', {
                lat     : marker.getPosition().lat(),
                lng     : marker.getPosition().lng(),
                id      : marker.markerId,
                roomId  : this.roomId
            })
        }.bind(this));

        this.markers[marker.markerId] = marker;
    }.bind(this);

    /**
     * Type : Sockets listener.
     * Fires: When socket with marker changed position arrives
     * Do   : Sets position of changed marker
     */
    this.setMarkerPosition = function(data) {
        var marker = this.markers[data.id];
        var location = new google.maps.LatLng(data.lat, data.lng);
        marker.setPosition(location);
    }.bind(this);



    /**
     * Type : Google Map Event listener.
     * Fires: Type of map has been changed
     * Do   : Emits informations about type of map, that has been changed.
     */
    this.onMapTypeChange = function(){
        var mapType = map.getMapTypeId();
        if(!apiCall) {
            socket.emit('google/map/type/change', {
                mapType: mapType,
                roomId : this.roomId
            });
        }

        apiCall = false;
    }

    /**
     * Type : Sockets listener
     * Fires: When map change message arrives
     * Do   : Changes map type to following.
     */
    this.setMapType     = function(mapType) {
        apiCall = true;
        googleMap.setMapTypeId(mapType);
    }

    /**
     * Type : Google Map Event listener.
     * Fires: When panorama has been changed.
     * Do   : Emits information about type of panorama
     */
    this.onPanoramaChange = function() {
        console.log(this);
    }

};