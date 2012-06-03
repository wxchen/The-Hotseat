function MapView()
{
	var self = this;
	
	var containerID;
	
	var loading;
	var map;
	var markerToolTip;
	var sliderView;

	var data;
	var dataRangeStart;
	var dataRangeEnd;

	var markers2D;

	MapView.prototype.init = function(containerID, sliderView)
	{
		init(containerID, sliderView);
	}

	function init(containerID, sliderView)
	{
		self.containerID = containerID;
		self.sliderView = sliderView;

		initGUI();
		loadDataFromServer(map, DEFAULT_SOURCE_ID);
	}

	function initGUI()
	{
		self.loading = $('#loading');
		self.map = initMap();
		self.markerToolTip = initMarkerToolTip();
		self.sliderView.onSliderUpdate(function(event, value) {
			console.log(value);
			loadData(self.data, value);
		});
	}

	function initMap()
	{
		var mapLatLng = new google.maps.LatLng(-26, 133);

		var mapOptions = {
			zoom: 5,
			center: mapLatLng,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		
		return new google.maps.Map(document.getElementById(self.containerID), mapOptions);
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

	function loadDataFromServer(map, sourceID)
	{
		self.loading.show();
		
		$.getJSON(
			JSON_URL,  
			{sourceid: sourceID},  
			function(json) {

				self.data = json;

				// Determine data range
				if (json.length == 0)
				{
					dataRangeStart = 0;
					dataRangeEnd = 0;
				}
				else
				{
					dataRangeStart = parseInt(json[0].valueDate.split('-')[0], 10);   // Get start year
					dataRangeEnd = parseInt(json[json.length - 1].valueDate.split('-')[0], 10);   // Get end year
					console.log('Range: ' + dataRangeStart + ', ' + dataRangeEnd);
				}
				
				// Reset the slider
				self.sliderView.setRange(dataRangeStart, dataRangeEnd);

				if (json.length > 0)
				{
					// Load the first set of data
					loadData(self.data, dataRangeStart);
				}
			}  
		);
	}

	function loadData(data, dataRange)
	{
		console.log(dataRange);

		self.loading.show();
		destroyAllMarkers();
		drawMarkers(self.map, data, dataRange);
		self.loading.hide();
	}

	function destroyAllMarkers()
	{
		$(markers2D).each(function(){
			var marker = this;
			marker.setMap(null);
		});

		markers2D = null;
	}

	function drawMarkers(map, locationData, dataRange)
	{
		markers2D = [];
		var rangeFound = false;
		var markersAdded = 0;
		$(locationData).each(function(index) {
			
			var data = this;
			if (data.latitude > 0)
			{
				data.latitude *= -1;
			}

			var year = data.valueDate.split('-')[0];

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

			if (year == dataRange)
			{
				//console.log(data.valueDate);

				var southWestLatLng = new google.maps.LatLng(
					parseFloat(data.latitude) - ((MARKER_SIZE * MAP_ASPECT_RATIO) / 2),
					parseFloat(data.longitude) - (MARKER_SIZE / 2));
				var northEastLatLng = new google.maps.LatLng(
					parseFloat(data.latitude) + ((MARKER_SIZE * MAP_ASPECT_RATIO) / 2),
					parseFloat(data.longitude) + (MARKER_SIZE / 2));
				var bounds = new google.maps.LatLngBounds(southWestLatLng, northEastLatLng);
				
				var value = MathUtils.Map(parseFloat(data.value), -50, 50, 0, 100);

				var marker = addMarker(map, bounds, value);
				addMarkerListeners(marker);
				markers2D.push(marker);
				markersAdded++;
			}
		});

		console.log(markersAdded + ' markers added');
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

	function addMarkerListeners(marker)
	{
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
	}
}