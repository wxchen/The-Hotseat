<?php
require_once('../config.php');

$sourceId = $_REQUEST['sourceid'];

$stmt = $pdo->prepare('select 
	locationValue.*,
	location.latitude,
	location.longitude
	from locationValue 
	inner join location ON locationValue.locationId = location.id where sourceId = ?
	order by locationValue.valueDate');
$stmt->execute(array($sourceId));

$locations = array();

while ($row = $stmt->fetch())
{
	$locations[] = $row;
}

// Output locations as JSON
echo json_encode($locations);

?>