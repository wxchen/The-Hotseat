function SliderView()
{
	var self = this;
	
	var containerID;
	var slider;
	var map;

	var min;
	var max;

	SliderView.prototype.init = function(containerID)
	{
		init(containerID);
	}

	SliderView.prototype.setRange = function(min, max)
	{
		setRange(min, max);
	}

	SliderView.prototype.setValue = function(value)
	{
		setValue(value);
	}

	SliderView.prototype.setNextValue = function()
	{
		if (self.slider.slider('value') == self.max)
		{
			setValue(self.min);	
			return;
		}

		setValue(self.slider.slider('value') + 1);
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

	function setRange(min, max)
	{
		self.min = min;
		self.max = max;

		self.slider.slider({
			min: min,
			max: max
		});
	}

	function setValue(value)
	{
		self.slider.slider({
			value: value
		});

		self.slider.trigger(Events.SLIDER_UPDATED, [value]);
	}

	function onSliderUpdate(callbackFunction)
	{
		self.slider.on(Events.SLIDER_UPDATED, callbackFunction);
	}
}