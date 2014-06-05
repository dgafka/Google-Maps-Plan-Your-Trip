var googleMap;

var GoogleMaps = function(socket, roomId){

    this.socket = socket;
    this.roomId = roomId;

    this.initalize = function(data){
        var mapOptions = {
            center: new google.maps.LatLng(data.mapCenter.lat, data.mapCenter.lng),
            zoom: data.zoom,
            navigationControl: true,
            panControl: false,
            zoomControl: true,
            streetViewControl: false,
            scaleControl: true,
            rotateControl: true,
            overviewMapControl: true
        };
        googleMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        return googleMap;
    };


    /**
     * Called when zoom is changed
     * @param event
     */
    this.onZoomChangedGet = function(event) {
        this.onCenterChangedGet(undefined);
        var zoom = googleMap.getZoom();
        var roomId = this.roomId;

        socket.emit('google/map/zoom/get', {
            zoom: zoom,
            roomId: roomId
        });
    }.bind(this);

    /**
     * Sets zoom
     * @param data
     */
    this.onZoomChangedSet = function(data) {
        googleMap.setZoom(data);
    };

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
        };
        socket.emit('google/map/center/get', mapCenter);
    }.bind(this);

    /**
     * Seta center of the map
     * @param data
     */
    this.onCenterChangedSet     = function(data) {
        var location = new google.maps.LatLng(data.lat, data.lng);
        googleMap.panTo(location);
    };

    /**
     * Fires when right click on the map
     * @param event
     */
    this.onRightClickGet = function(event){
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        var roomId    = this.roomId;

        new google.maps.Marker({
                position: {lat: lat, lng: lng},
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP
            });

        socket.emit('google/map/marker/get', {lat: lat, lng: lng, roomId: roomId});
    }.bind(this);

    /**
     * Set marker on the map
     * @param data
     */
    this.onRightClickSet = function(data) {
        new google.maps.Marker({
            position: {lat: data.lat, lng: data.lng},
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
    };
};