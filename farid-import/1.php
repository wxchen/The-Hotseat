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
