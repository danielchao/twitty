$(document).ready(function() {
    $('#feed-btn').click(function() {
        if ($('#feed-panel')[0].offsetLeft < 0) {
            $('#feed-panel').animate( {
                left : "+=17%"
            }, 100, function() { });
        }else {
            $('#feed-panel').animate( {
                left : "-=17%"
            }, 100, function() { });
        }
    });
});
