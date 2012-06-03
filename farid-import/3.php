<?php
require_once '../config.php';

$sourceId = 231;

$statement = $pdo->prepare("SELECT * FROM location WHERE sourceId = ?");
$statement->execute(array($sourceId));
$locations = $statement->fetchAll();

$statement = $pdo->prepare("INSERT INTO location_value(locationId,value,valueDate) VALUES(?,?,?)");

foreach($locations as $location)
{
	$sourceUrl = $location['locationSourceUrl'];
	$csvFilename = str_replace(array("http://www.bom.gov.au/tmp/cdio/IDCJAC0001_",".zip"),array("data/$sourceId/csv/IDCJAC0001_","_Data12.csv"),$sourceUrl);

	if (file_exists($csvFilename))
	{
		$csv = file_get_contents($csvFilename);
		
		$rows = explode("\n",$csv);
		
		foreach($rows as $rowIndex => $row)
		{
			if (!$rowIndex)
				continue;
		
			$bits = explode(',',$row);
			
			if (count($bits) < 10)
				continue;
			
			$year = trim($bits[2]);
			$rainfall = trim(end($bits));
			
			if ($rainfall == 'null')
				continue;
			
			echo "$year - $rainfall\n";
			$statement->execute(array($location['id'],$rainfall,$year.'-01-01 00:00:00'));
		}
	}
}
