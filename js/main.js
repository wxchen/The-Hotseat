var MAP_ASPECT_RATIO = 1.0;
var MARKER_SIZE = 0.5;
var JSON_URL = 'api/fullvalues.php';
var DEFAULT_SOURCE_ID = 228;

$(document).ready(function() {
	init();
});

function init()
{
	// Set height
	$('#loading').css('height', window.innerHeight);
	$('#mapCanvas').css('height', window.innerHeight);

	var mapView = new MapView();
	mapView.init('mapCanvas');
}