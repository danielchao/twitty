google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {

    var mapOptions = {
        center: new google.maps.LatLng(37.77, -122.42),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
    var searchBox = new google.maps.places.SearchBox($('input')[0]);

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
        map.setZoom(12);
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
    start_socket(map);
}

function start_socket(map) {
    var socket = io.connect('http://localhost:3000');
    var numTweets = 0;
    var feedCount = 0;
    socket.on('tweet', function(data) {
        if (!data.coordinates) {
            var coord = data.place.bounding_box.coordinates;
            coord = new google.maps.LatLng(coord[0][0][0], coord[0][0][0], false);
        }else {
            var coord = new google.maps.LatLng(data.coordinates.coordinates[1], data.coordinates.coordinates[0], false);
        }
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
        }, 10000);

        var row = $("<tr><td><img src='" 
            + data.user.profile_image_url 
            + "'/></td><td>" 
            + data.text + "</td></tr>");
        row.click(function() {
            map.panTo(marker.getPosition());
        });
        $('table').prepend(row);
        feedCount += 1;
        if (feedCount > 10) {
            $('tr:last-child').remove();
            feedCount -= 1;
        }
    });

    google.maps.event.addListener(map, 'idle', function() {
        socket.emit('relocate', map.getBounds());
    });
}

