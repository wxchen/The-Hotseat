function MathUtils()
{
}

MathUtils.GetRandomInt = function(min, max)
{
	return Math.floor((Math.random() * (max - min)) + min);
}

MathUtils.Map = function(value, origMin, origMax, newMin, newMax)
{
	var origRange = Math.abs(origMax - origMin);
	var newRange = Math.abs(newMax - newMin);
	var scale = newRange / origRange;

	var newValue = (value * scale) + (newMin < newMax ? newMin : newMax);

	//
	if (newMax < newMin && origMin < origMax)
	{
		newValue = newMin - newValue;
	}

	return newValue;
}

MathUtils.ToHex = function(number)
{
	number = parseInt(number, 10);
	
	if (isNaN(number))
	{
		return '00';
	}

	number = Math.max(0, Math.min(number, 255));

	return '0123456789ABCDEF'.charAt((number - number % 16) / 16)
		+ '0123456789ABCDEF'.charAt(number % 16);
}
