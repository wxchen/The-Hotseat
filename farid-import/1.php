<?php
require_once '../config.php';
require_once '../simplehtmldom/simple_html_dom.php';

$statement = $pdo->prepare('SELECT * FROM location WHERE sourceId = ? OR sourceId = ?');
$statement->execute(array(226,227));

$rows = $statement->fetchAll();

foreach($rows as $row)
{
	$id = $row['id'];
	$sourceId = $row['sourceId'];
	$name = $row['name'];
	$url = $row['locationSourceUrl'];
	
	echo "Processing $name - $id - $url\n";	
	
	$string = file_get_contents($url);
	file_put_contents('data/'.$sourceId.'/'.$id,$string);
	/*

	
	$string = file_get_contents($url);

	$csv = explode("\n",$string);
	
	$statement = $pdo->prepare('INSERT INTO locationValue(locationId,value,valueDate) VALUES(?,?,?)');
	
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
			$statement->execute(array($id,$temp,$date));
	}
*/
}