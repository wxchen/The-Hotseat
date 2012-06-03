<?php
require_once('../config.php');

$sourceId = $_REQUEST['sourceid'];

$stmt = $pdo->prepare('

SELECT 
	location_value.*,
	location.name,
	location.latitude,
	location.longitude
FROM
	location_value INNER JOIN location ON location_value.locationId = location.id
WHERE
	sourceId = ? AND
	'.($sourceId == 231 ? 'mod(location.id,10) = 0 AND' : '').'
	valueDate > "1900-00-00"
ORDER BY
	location_value.valueDate
');
$stmt->execute(array($sourceId));

$locations = array();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
{
	$locations[] = $row;
}

// Output locations as JSON
echo json_encode($locations);

?>