<?php
require_once('../config.php');

$sourceId = $_REQUEST['sourceid'];

$stmt = $pdo->prepare('select * from location where sourceId = ?');
$stmt->execute(array($sourceId));

$locations = array();

while ($row = $stmt->fetch())
{
	$locations[] = $row;
}

// Output locations as JSON
echo json_encode($locations);

?>