<?php
require_once('../config.php');

$sourceId = $_REQUEST['sourceid'];

$stmt = $pdo->prepare('select location_value.* from location_value inner join location ON location_value.locationId = location.id where sourceId = ?');
$stmt->execute(array($sourceId));

$locations = array();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
{
	$locations[] = $row;
}

// Output locations as JSON
echo json_encode($locations);

?>