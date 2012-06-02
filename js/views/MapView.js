function MapView()
{
	var that = this;
	var map;
	var markerToolTip;

	MapView.prototype.init = function()
	{
		init();
	}

	function init()
	{
		map = initMap();
		markerToolTip = initMarkerToolTip();
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

	function initMarkerToolTip()
	{
		$('body').append('<div class="markerToolTip"></div>');

		var markerToolTip = $('.markerToolTip');
		markerToolTip.on('mouseover', function(event) {
			event.stopImmediatePropagation();
			console.log('stop');
		});

		return markerToolTip;
	}

	function loadData(map, sourceID)
	{
		$.getJSON(
			JSON_URL,  
			{sourceid: sourceID},  
			function(json) {
				drawMarkers(map, json);
			}  
		);
	}

	function drawMarkers(map, locationData)
	{
		
		$(locationData).each(function(index) {
			
			var data = this;

			var southWestLatLng = new google.maps.LatLng(
				parseFloat(this.latitude) - ((MARKER_SIZE * MAP_ASPECT_RATIO) / 2),
				parseFloat(this.longitude) - (MARKER_SIZE / 2));
			var northEastLatLng = new google.maps.LatLng(
				parseFloat(this.latitude) + ((MARKER_SIZE * MAP_ASPECT_RATIO) / 2),
				parseFloat(this.longitude) + (MARKER_SIZE / 2));
			var bounds = new google.maps.LatLngBounds(southWestLatLng, northEastLatLng);
			
			var value = MathUtils.GetRandomInt(0, 100);

			var marker = addMarker(map, bounds, value);

			// Add tool tip for each marker
			google.maps.event.addListener(marker, 'mouseover', function(event) {
				event.stop();

				var scale = Math.pow(2, map.getZoom());
				var markerBounds = this.getBounds();
				var point = MapUtils.GetPointFromBounds(map, markerBounds);
				var markerHeight = Math.abs(markerBounds.getSouthWest().lat() - markerBounds.getNorthEast().lat()) * scale;
				console.log(markerHeight);

				// Move the tool tip above the marker
				point.x -= parseInt(markerToolTip.css('width'), 10) / 2;
				//point.y -= (parseInt(markerToolTip.css('height'), 10) + markerHeight / 2);
				point.y -= parseInt(markerToolTip.css('height'), 10);

				markerToolTip.css({left: point.x, top: point.y});
				markerToolTip.text(data.name);
			});

			//
			google.maps.event.addListener(marker, 'mouseout', function(event) {
				event.stop();
				markerToolTip.css({left: -1000, top: -1000});
				markerToolTip.text('');
			});
		});
	}

	/**
	 * value is 0-100
	 */
	function addMarker(map, bounds, value)
	{
		var hue = MathUtils.Map(value, 0, 100, 60, 0);
		var colour = ColourUtils.HSVToRGB(hue, 100, 100);
		colour = ColourUtils.RGBToHex(colour.r, colour.g, colour.b);

	    var marker = new google.maps.Rectangle();
		var rectOptions = {
	        map: map,
	        bounds: bounds,
	        strokeColor: colour,
	        strokeOpacity: 1.0,
	        strokeWeight: 0.2,
	        fillColor: colour,
	        fillOpacity: 0.8
	      };

		marker.setOptions(rectOptions);

		return marker;
	}
}