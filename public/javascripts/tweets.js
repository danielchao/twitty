$(document).ready(function() {
    var socket = io.connect('http://localhost:3000');
    socket.on('tweet', function(data) {
        //console.log(data);
        if (data.user.screen_name == 'jungun213') {
            console.log(data);
        }
        if (data.geo){
            coord = new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1], false);
            var marker = new google.maps.Marker({
                position: coord,
                map: window.map,
                title: data.text,
                icon: data.user.profile_image_url
            });
            setTimeout(function() {
                marker.setMap(null);
            }, 30000);
        }
    });
});
