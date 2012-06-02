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
	console.log(newValue);
	return newValue;
}

MathUtils.ToHex = function(n)
{
	n = parseInt(n,10);
	if (isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16)
		+ "0123456789ABCDEF".charAt(n%16);
}
