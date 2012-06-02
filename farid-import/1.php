<?php
require_once '../config.php';
require_once '../simplehtmldom/simple_html_dom.php';

$statement = $pdo->prepare('SELECT * FROM location WHERE sourceId = ? OR sourceId = ?');
$statement->execute(array(226,227));

$rows = $statement->fetchAll();
$file = fopen('data/1.sql','a+');

foreach($rows as $row)
{
	set_time_limit(0);
	
	$sql = "INSERT INTO locationValue(locationId,value,valueDate) VALUES";
	
	$id = $row['id'];
	$sourceId = $row['sourceId'];
	$name = $row['name'];
	$url = $row['locationSourceUrl'];
	$filename = 'data/'.$sourceId.'/'.$id;
	
	$string = file_get_contents($filename);
	$csv = explode("\n",$string);
	
	foreach($csv as $index => $entry)
	{
		if (!$index)
			continue;
		
		$entry = trim($entry);
		$bits = explode(' ',$entry);
		
		$dateString = $bits[0];

		$month = substr($dateString,4,2);
		$day = substr($dateString,6,2);
		$year = substr($dateString,0,4);

		$date = mktime(0,0,0,$month,$day,$year);
		$temp = end($bits);
		
		if (!empty($dateString) && ($temp > -100) && ($temp < 100))
		{
			$sql .= "($id,$temp,FROM_UNIXTIME($date)),";
		}
	}
	
	$sql = substr($sql,0,-1) . ";\n";
	
	echo "Processing " . count($csv) . " items for $name - $id\n";	
/*
	
	$statement = $pdo->query($sql);
	var_dump($pdo->errorInfo());
*/

	fwrite($file,$sql);
}