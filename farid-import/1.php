<?php
require_once '../config.php';
require_once '../simplehtmldom/simple_html_dom.php';

$importId = 227;
$importName = "Australian Climate Observations Reference Network - Surface Air Temperature";
$importBaseUrl = "http://www.bom.gov.au";
$importPath = "/climate/change/acorn-sat";

$text = file_get_contents($importBaseUrl.$importPath);
$html = str_get_html($text);

$tableRows = $html->find('#acorn-sat-table tr');

foreach($tableRows as $rowIndex => $row)
{
	if (!$rowIndex)
		continue;
	
	$stationName = $row->find('td',1)->plaintext;
	$latitude = $row->find('td',2)->plaintext;
	$longitude = $row->find('td',3)->plaintext; 
	$elevation = $row->find('td',4)->plaintext;
	
	$minDataUrl = $importBaseUrl . $row->find('td a',0)->href;
	$maxDataUrl = $importBaseUrl . $row->find('td a',1)->href;
	
	$statement = $pdo->prepare('INSERT INTO location(sourceId,name,latitude,longitude,locationSourceUrl) VALUES(?,?,?,?,?)');
	$statement->execute(array($importId,$stationName,$latitude,$longitude,$maxDataUrl));
	
	echo "Reading max data for $stationName ($latitude, $longitude)\n";
}










/*
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
	$filename = 'data/'.$sourceId.'/'.$id;
	
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
*/