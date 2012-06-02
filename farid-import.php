<?php
require_once 'config.php';
require_once 'simplehtmldom/simple_html_dom.php';

$importUrl = "http://www.bom.gov.au/climate/change/acorn-sat";

$text = file_get_contents($importUrl);
$html = str_get_html($text);

$rows = $html->find('#acorn-sat-table tr');

foreach($rows as $rowIndex => $row)
{
	if (!$rowIndex)
		continue;
	
	$minDataUrl = $importUrl . @$row->find('td a',0)->href;
	$maxDataUrl = $importUrl . @$row->find('td a',1)->href;
	
	echo "$minDataUrl\n$maxDataUrl\n\n";
}