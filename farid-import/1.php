<?php
require_once '../config.php';
require_once '../simplehtmldom/simple_html_dom.php';

date_default_timezone_set('Australia/Sydney');

$statement = $pdo->prepare('SELECT * FROM location WHERE sourceId = ? OR sourceId = ?');
$statement->execute(array(226,227));

$rows = $statement->fetchAll();

foreach($rows as $row)
{
	$id = $row['id'];
	$sourceId = $row['sourceId'];
	$name = $row['name'];
	$url = $row['locationSourceUrl'];
	$filename = 'data/'.$sourceId.'/'.base64_encode($url);
	
	$string = file_get_contents($filename);
	$csv = explode("\n",$string);
	$data = array();
	
	foreach($csv as $index => $entry)
	{
		if (!$index)
			continue;
		
		$entry = trim($entry);
		$bits = explode(' ',$entry);
		
		$dateString = $bits[0];

		$year = substr($dateString,0,4);

		$date = mktime(0,0,0,1,1,$year);
		$temp = end($bits);
		
		if (!empty($dateString) && ($temp > -100) && ($temp < 100))
		{
			$data[$year][] = $temp;
		}
	}
	
	echo "Processing " . count($csv) . " items for $name - $id\n";	
	
	$statement = $pdo->prepare("INSERT INTO location_value(locationId,value,valueDate) VALUES(?,?,?)");
	
	foreach ($data as $year => $temp)
	{
		$temperature = array_sum($data[$year]) / count($data[$year]);	
		$statement->execute(array($id,$temperature,$year.'-01-01 00:00:00'));
	}
}