function MapUtils()
{
}

MapUtils.GetPointFromBounds = function(map, bounds)
{
	var scale = Math.pow(2, map.getZoom());
	
	var mapNW = new google.maps.LatLng(
		map.getBounds().getNorthEast().lat(),
		map.getBounds().getSouthWest().lng()
	);

	var worldNWPoint = map.getProjection().fromLatLngToPoint(mapNW);
	var worldPoint = map.getProjection().fromLatLngToPoint(bounds.getCenter());
	var point = new google.maps.Point(
		Math.floor((worldPoint.x - worldNWPoint.x) * scale),
		Math.floor((worldPoint.y - worldNWPoint.y) * scale)
	);

	return point;
}