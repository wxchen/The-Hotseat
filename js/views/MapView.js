function MapView()
{
	// THIS IS WRONG - SELF
	var self = this;
	
	var containerID;
	
	var loading;
	var map;
	var markerToolTip;
	var sliderView;

	var data;
	var dataRangeStart;
	var dataRangeEnd;
	var dataMin;
	var dataMax;

	var markers2D;

	var autoPlay;
	var autoPlayDelay;

	MapView.prototype.init = function(containerID, sliderView)
	{
		init(containerID, sliderView);
	}

	function init(containerID, sliderView)
	{
		self.containerID = containerID;
		self.sliderView = sliderView;

		self.autoPlay = false;
		self.autoPlayDelay = 500;

		initGUI();
		loadDataFromServer(map, DEFAULT_SOURCE_ID);
	}

	function initGUI()
	{
		self.loading = $('#loading');
		self.map = initMap();
		self.markerToolTip = initMarkerToolTip();
		self.sliderView.onSliderUpdate(function(event, value) {
			log(value);
			$('#sliderValue').text(value);
			loadData(self.data, value);
		});

		$('#playPauseButton').click(function(){
			if (self.autoPlay)
			{
				self.autoPlay = false;
				$(this).val('Play');
			}
			else
			{
				self.autoPlay = true;
				$(this).val('Pause');
				setNextDataValue();
			}
		});
	}

	function initMap()
	{
		var mapLatLng = new google.maps.LatLng(-26, 133);

		var mapOptions = {
			zoom: 4,
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
		});

		return markerToolTip;
	}

	function showLoading()
	{
		self.loading.show();
		$('#' + self.containerID).css('opacity', 0.5);
		$('#playPauseButton').hide();
	}

	function hideLoading()
	{
		self.loading.hide();
		$('#' + self.containerID).css('opacity', 1.0);
		$('#playPauseButton').show();
	}

	function loadDataFromServer(map, sourceID)
	{
		showLoading();
		
		$.getJSON(
			JSON_URL,  
			{sourceid: sourceID},  
			function(json) {

				self.data = json;

				// Determine data range
				if (json.length == 0)
				{
					self.dataRangeStart = 0;
					self.dataRangeEnd = 0;
				}
				else
				{
					self.dataRangeStart = parseInt(json[0].valueDate.split('-')[0], 10);   // Get start year
					self.dataRangeEnd = parseInt(json[json.length - 1].valueDate.split('-')[0], 10);   // Get end year
					log('Date Range: ' + self.dataRangeStart + ', ' + self.dataRangeEnd);
				}

				// Determine min and max value
				self.dataMin = 99999999;
				self.dataMax = self.dataMin * -1;
				$(json).each(function(index) {
					var data = this;
					if (data.value < self.dataMin)
					{
						self.dataMin = parseFloat(data.value);
					}

					if (data.value > self.dataMax)
					{
						self.dataMax = parseFloat(data.value);
					}
				});
				log('Value Range: ' + self.dataMin + ', ' + self.dataMax);
				
				// Reset the slider
				self.sliderView.setRange(self.dataRangeStart, self.dataRangeEnd);

				if (json.length > 0)
				{
					// Load the first set of data
					loadData(self.data, self.dataRangeStart);
				}
			}  
		);
	}

	function loadData(data, dataRange)
	{
		log(dataRange);
		$('#sliderValue').text(dataRange);

		showLoading();
		destroyAllMarkers();
		drawMarkers(self.map, data, dataRange);		
		hideLoading();

		if (self.autoPlay)
		{
			setNextDataValue();
		}
	}

	function setNextDataValue()
	{
		console.log('autoplay');
		setTimeout(function(){
			self.sliderView.setNextValue();
		}, self.autoPlayDelay)
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
		beginUpdates();
		
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
				//log(data.valueDate);

				var southWestLatLng = new google.maps.LatLng(
					parseFloat(data.latitude) - ((MARKER_SIZE * MAP_ASPECT_RATIO) / 2),
					parseFloat(data.longitude) - (MARKER_SIZE / 2));
				var northEastLatLng = new google.maps.LatLng(
					parseFloat(data.latitude) + ((MARKER_SIZE * MAP_ASPECT_RATIO) / 2),
					parseFloat(data.longitude) + (MARKER_SIZE / 2));
				var bounds = new google.maps.LatLngBounds(southWestLatLng, northEastLatLng);

				var value = MathUtils.Map(parseFloat(data.value), self.dataMin, self.dataMax, 0, 100);
				
				// Create 3D box
				var point = MapUtils.GetPointFromBounds(self.map, bounds);
				createBox(data.locationId, point.x, point.y, value / 30);
				
				// Create 2D box
				//var marker2D = addMarker2D(map, bounds, value);
				//addMarkerListeners(marker2D, data);
				//markers2D.push(marker2D);
				markersAdded++;
			}
		});
		
		endUpdates();
		log(markersAdded + ' markers added');
	}

	/**
	 * value is 0-100
	 */
	function addMarker2D(map, bounds, value)
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

	function addMarkerListeners(marker, data)
	{
		// Add tool tip for each marker
		google.maps.event.addListener(marker, 'mouseover', function(event) {
			event.stop();

			var scale = Math.pow(2, self.map.getZoom());
			var markerBounds = this.getBounds();
			var point = MapUtils.GetPointFromBounds(self.map, markerBounds);

			var markerWorldNEPoint = self.map.getProjection().fromLatLngToPoint(markerBounds.getNorthEast());
			var markerWorldSWPoint = self.map.getProjection().fromLatLngToPoint(markerBounds.getSouthWest());
			var markerHeight = Math.abs(markerWorldSWPoint.y - markerWorldNEPoint.y) * scale;

			// Move the tool tip above the marker
			point.x -= parseInt(self.markerToolTip.css('width'), 10) / 2;
			point.y -= (parseInt(self.markerToolTip.css('height'), 10) + markerHeight / 2 + 8);
			log((parseInt(self.markerToolTip.css('height'), 10) + markerHeight / 2));

			// Display the marker tooltip
			self.markerToolTip.css({left: point.x, top: point.y});
			self.markerToolTip.html(data.name + '<br/>(' + data.value + ')');
		});

		//
		google.maps.event.addListener(marker, 'mouseout', function(event) {
			event.stop();
			// Hide the marker tooltip
			self.markerToolTip.css({left: -1000, top: -1000});
			self.markerToolTip.html('');
		});
	}
}