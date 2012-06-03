var MAP_ASPECT_RATIO = 1.0;
var MARKER_SIZE = 0.5;
var JSON_URL = 'api/fullvalues.php';
var DEFAULT_SOURCE_ID = 226;

$(document).ready(function() {
	init();
});

function init()
{
	// Set height
	$('#loading').css('height', window.innerHeight);
	$('#map').css('height', window.innerHeight);

	var sliderView = new SliderView();
	sliderView.init('slider');

	var mapView = new MapView();
	mapView.init('map', sliderView);
}