<?php
require_once '../config.php';

$sourceId = 231;

$statement = $pdo->prepare("SELECT * FROM location WHERE sourceId = ?");
$statement->execute(array($sourceId));
$locations = $statement->fetchAll();

$bit1 = "http://www.bom.gov.au/jsp/ncc/cdio/weatherData/av?p_nccObsCode=139&p_display_type=dataFile&p_startYear=&p_c=&p_stn_num=";
$bit2 = "http://www.bom.gov.au/tmp/cdio/IDCJAC0001_";
$bit3 = ".zip";


foreach($locations as $location)
{
	$actualUrl = $location['locationSourceUrl'];

	$warmUrl = str_replace($bit2,$bit1,$actualUrl);
	$warmUrl = str_replace($bit3,'',$warmUrl);
	$string = file_get_contents($warmUrl);

	$string = file_get_contents($actualUrl);

	file_put_contents('data/'.$sourceId.'/full/'.base64_encode($actualUrl),$string);
	echo "Downloading $actualUrl\n";
}





//// PHASE 1 CODE ////

/*
$baseUrl = "http://www.bom.gov.au/tmp/cdio/IDCJAC0001_%d.zip";

$statement = $pdo->prepare("INSERT INTO location(sourceId,name,latitude,longitude,locationSourceUrl) VALUES(?,?,?,?,?)");

foreach(glob('data/'.$sourceId.'/*.txt') as $filename)
{

	$string = file_get_contents($filename);
	$csv = explode("\n",$string);
	$count = count($csv);
	
	echo "Processing $filename with $count records\n";
	
	foreach($csv as $index => $row)
	{
		$row = str_replace('  ','',$row);
		
		$bits = explode(',',$row);
		
		if (count($bits) < 8)
			continue;
		
		$id = $bits[1];
		$name = $bits[3];
		$latitude = $bits[6];
		$longitude = $bits[7];
		$url = sprintf($baseUrl,$id);
		
		$statement->execute(array($sourceId,$name,$latitude,$longitude,$url));

		echo "$name $latitude,$longitude inserted\n";
	}
}
*/