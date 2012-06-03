<?php
require_once '../config.php';

$sourceId = 231;
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
		
/* 		var_dump($bits); */
		$statement->execute(array($sourceId,$name,$latitude,$longitude,$url));

		echo "$name $latitude,$longitude inserted\n";
	}
}