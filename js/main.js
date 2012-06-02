var MAP_ASPECT_RATIO = 1.0;
var MARKER_SIZE = 1.0;
var JSON_URL = 'api/index.php';
var DEFAULT_SOURCE_ID = 226;

$(document).ready(function() {
	init();
});

function init()
{
	var map = initMap();
	loadData(map, DEFAULT_SOURCE_ID);
}

function initMap()
{
	var mapLatLng = new google.maps.LatLng(-40, 134);

	var mapOptions = {
		zoom: 4,
		center: mapLatLng,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	};
		
	return new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
}

function loadData(map, sourceID)
{
	$.getJSON(
		JSON_URL,  
		{sourceid: sourceID},  
		function(json) {
			console.log(json);
			drawMarkers(map, json);
		}  
	);
}

function drawMarkers(map, locationData)
{
	$(locationData).each(function(index) {
		var southWestLatLng = new google.maps.LatLng(
			parseFloat(this.latitude) - ((MARKER_SIZE * MAP_ASPECT_RATIO) / 2),
			parseFloat(this.longitude) - (MARKER_SIZE / 2));
		var northEastLatLng = new google.maps.LatLng(
			parseFloat(this.latitude) + ((MARKER_SIZE * MAP_ASPECT_RATIO) / 2),
			parseFloat(this.longitude) + (MARKER_SIZE / 2));
		var bounds = new google.maps.LatLngBounds(southWestLatLng, northEastLatLng);
		addMarker(map, bounds);
	});
}

function addMarker(map, bounds)
{
    var rectangle = new google.maps.Rectangle();
	var rectOptions = {
        map: map,
        bounds: bounds,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 0.2,
        fillColor: '#FF0000',
        fillOpacity: 0.5
      };

	rectangle.setOptions(rectOptions);
}