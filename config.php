<?php
define('DB_HOST','23.23.245.140');
define('DB_USER','dbuser');
define('DB_PASSWORD','b055');
define('DB_DATABASE','govhack_prod');

try
{
	$pdo = new PDO('mysql:dbname='.DB_DATABASE.';host='.DB_HOST,DB_USER,DB_PASSWORD);
}
catch (PDOException $e)
{
	echo 'Connection failed: ' . $e->getMessage();
	die;
}