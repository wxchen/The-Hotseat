<?php
require_once '../config.php';

$sourceId = 231;


//// PHASE 4 CODE ////

$statement = $pdo->prepare("SELECT * FROM location WHERE sourceId = ?");
$statement->execute(array($sourceId));
$locations = $statement->fetchAll();
$total = 0;

foreach($locations as $location)
{
	$sourceUrl = $location['locationSourceUrl'];
	$csvFilename = str_replace(array("http://www.bom.gov.au/tmp/cdio/IDCJAC0001_",".zip"),array("data/$sourceId/csv/IDCJAC0001_","_Data12.csv"),$sourceUrl);

	if (file_exists($csvFilename))
	{
		$total++;	
	} 
	else
	{
		$pdo->query("DELETE FROM location WHERE id = ".$location['id']);
	}
	
	echo "$csvFilename\n";
}

echo "Found ".count($locations)." locations\n";
echo "$total had corresponding CSV data\n";


//// PHASE 3 CODE ////

/*
$zipFiles = glob('data/'.$sourceId.'/full/*.zip');

if ($zipFiles)
{
	foreach($zipFiles as $zipFile)
	{
		$folderName = str_replace(array('data/'.$sourceId.'/full/','.zip'),'',$zipFile);
		echo (shell_exec('unzip "'.$zipFile.'" -d '.$folderName));
		unlink($zipFile);
	}
}

*/

//// PHASE 2 CODE ////

/*
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

//	$string = file_get_contents($warmUrl);
//	$string = file_get_contents($actualUrl);

//	file_put_contents('data/'.$sourceId.'/full/'.base64_encode($actualUrl),$string);

	echo "<a href='$warmUrl'>$warmUrl</a>\n";
	echo "<a href='$actualUrl'>$actualUrl</a>\n";
}

*/



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