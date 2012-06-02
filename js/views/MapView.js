function MapView()
{
	var that = this;
	var containerID;
	var loading;
	var map;
	var markerToolTip;
	var slider;

	MapView.prototype.init = function(containerID)
	{
		init(containerID);
	}

	function init(containerID)
	{
		this.containerID = containerID;

		initGUI();
		loadData(map, DEFAULT_SOURCE_ID);
	}

	function initGUI()
	{
		loading = $('#loading');
		map = initMap();
		markerToolTip = initMarkerToolTip();
		slider = initSlider();
	}

	function initMap()
	{
		var mapLatLng = new google.maps.LatLng(-26, 133);

		var mapOptions = {
			zoom: 5,
			center: mapLatLng,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		
		return new google.maps.Map(document.getElementById(this.containerID), mapOptions);
	}

	function initMarkerToolTip()
	{
		$('body').append('<div class="markerToolTip"></div>');

		var markerToolTip = $('.markerToolTip');
		markerToolTip.on('mouseover', function(event) {
			event.stopPropagation();
			console.log('stop');
		});

		return markerToolTip;
	}

	function initSlider()
	{
		$('#' + this.containerID).append('<div class="slider"></div>');
		$('.slider').slider();
	}

	function loadData(map, sourceID)
	{
		$.getJSON(
			JSON_URL,  
			{sourceid: sourceID},  
			function(json) {
				if (json.length == 0)
				{
					return false;
				}

				var dataRangeStart = json[0].valueDate.split('-')[0];   // Get start year
				var dataRangeEnd = json[json.length - 1].valueDate.split('-')[0];   // Get end year

				drawMarkers(map, json, dataRangeStart);
				loading.hide();
			}  
		);
	}

	function drawMarkers(map, locationData, dataRange)
	{
		var rangeFound = false;
		$(locationData).each(function(index) {
			
			var year = this.valueDate.split('-')[0];

			// Check if we have hit the start of the data range
			if (year == dataRange)
			{
				rangeFound = true;
			}

			// Check if we have hit the end of the data range
			if (rangeFound && year != dataRange)
			{
				return false;
			}

			console.log(this.valueDate);

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

				var markerWorldNEPoint = map.getProjection().fromLatLngToPoint(markerBounds.getNorthEast());
				var markerWorldSWPoint = map.getProjection().fromLatLngToPoint(markerBounds.getSouthWest());
				var markerHeight = Math.abs(markerWorldNEPoint.y - markerWorldSWPoint.y) * scale;
				console.log(markerHeight);

				// Move the tool tip above the marker
				point.x -= parseInt(markerToolTip.css('width'), 10) / 2;
				//point.y -= (parseInt(markerToolTip.css('height'), 10) + markerHeight / 2);
				point.y -= parseInt(markerToolTip.css('height'), 10);

				// Display the marker tooltip
				markerToolTip.css({left: point.x, top: point.y});
				markerToolTip.text(data.name);
			});

			//
			google.maps.event.addListener(marker, 'mouseout', function(event) {
				event.stop();
				// Hide the marker tooltip
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