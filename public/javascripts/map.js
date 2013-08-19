google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(37.77, -122.42),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
    start_socket(map);
}

function start_socket(map) {
    var socket = io.connect('http://localhost:3000');
    var numTweets = 0;
    socket.on('tweet', function(data) {
        if (data.geo){
            coord = new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1], false);
            var marker = new google.maps.Marker({
                position: coord,
                map: map,
                title: data.text,
                icon: data.user.profile_image_url
            });
            numTweets += 1;
            setTimeout(function() {
                marker.setMap(null);
                numTweets -= 1;
            }, 100000/numTweets);
        }
    });

    google.maps.event.addListener(map, 'idle', function() {
        //console.log(map.getBounds());
        socket.emit('relocate', map.getBounds());
        //console.log(window.map.getBounds());
    });
}

