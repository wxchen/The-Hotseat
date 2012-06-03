function SliderView()
{
	var self = this;
	
	var containerID;
	var slider;

	var map;

	SliderView.prototype.init = function(containerID)
	{
		init(containerID);
	}

	SliderView.prototype.setRange = function(start, end)
	{
		setRange(start, end);
	}

	SliderView.prototype.onSliderUpdate = function(callbackFunction)
	{
		onSliderUpdate(callbackFunction);
	}

	function init(containerID)
	{
		self.containerID = containerID;
		self.slider = $('#' + self.containerID);

		initGUI();
	}

	function initGUI()
	{
		self.slider.slider(
		{
			min: 0,
			max: 100,
			slide: function(event, ui) {
				self.slider.trigger(Events.SLIDER_UPDATED, [ui.value]);
			}
		});
	}

	function setRange(start, end)
	{
		self.slider.slider({
			min: start,
			max: end
		});
	}

	function onSliderUpdate(callbackFunction)
	{
		self.slider.on(Events.SLIDER_UPDATED, callbackFunction);
	}
}