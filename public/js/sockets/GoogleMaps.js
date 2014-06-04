var googleMap;

var GoogleMaps = function(socket, roomId){

    this.socket = socket;
    this.roomId = roomId;

    this.initalize = function(data){
        var mapOptions = {
            center: new google.maps.LatLng(data.mapCenter.lat, data.mapCenter.lng),
            zoom: data.zoom,
            navigationControl: true,
            panControl: true,
            zoomControl: true,
            streetViewControl: true,
            scaleControl: true,
            rotateControl: true,
            overviewMapControl: true
        };
        googleMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        return googleMap;
    }


    /**
     * Called when zoom is changed
     * @param event
     */
    this.onZoomChangedGet = function(event) {
        var zoom = googleMap.getZoom();
        var mapCenter = googleMap.getCenter();
        var roomId = this.roomId;
        socket.emit('google/map/zoom/get', {
            zoom: zoom,
            roomId: roomId,
            lat: mapCenter.lat(),
            lng: mapCenter.lng()
        });
    }.bind(this)

    /**
     * Sets zoom
     * @param data
     */
    this.onZoomChangedSet = function(data) {
        googleMap.setZoom(data.zoom);
        var location = new google.maps.LatLng(data.lat, data.lng);
        googleMap.panTo(location);
    }

    /**
     * Called when drag is end
     * @param event
     */
    this.onCenterChangedGet   = function(event){
        var mapCenter = googleMap.getCenter();
        var roomId    = this.roomId;
        mapCenter = {
            lat: mapCenter.lat(),
            lng: mapCenter.lng(),
            roomId: roomId
        }
        socket.emit('google/map/center/get', mapCenter);
    }.bind(this)

    /**
     * Seta center of the map
     * @param data
     */
    this.onCenterChangedSet     = function(data) {
        var location = new google.maps.LatLng(data.lat, data.lng);
        googleMap.panTo(location);
    }
}