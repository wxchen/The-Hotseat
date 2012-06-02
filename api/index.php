<?php
require_once('../config.php');

/*
// Database
define('DATABASE_SERVER', 'www.thehotseat.info');
define('DATABASE_USER', 'dbuser');
define('DATABASE_PASSWORD', 'b055');
define('DATABASE_NAME', 'govhack_prod');

class DataModel
{
	// Connect to database
	public static function connectToDatabase()
	{
		// Database connection
		$server = DATABASE_SERVER;
		$username = DATABASE_USER;
		$password = DATABASE_PASSWORD;
		$database = DATABASE_NAME;
		
		// Connect to database	
		$db_handle = mysql_connect($server, $username, $password);
		$db_found = mysql_select_db($database, $db_handle);
	}
		
	// Get a single result from a query
	public static function getByQuery($query)
	{
		// Get result
		$result = mysql_query($query);
		
		if($result)
		{
			$thisResult = mysql_fetch_assoc($result);
			
			// Create location object
			if ($thisResult)
			{
				$resultAsObject = static::objectFromResult($thisResult);
			}
			else
			{
				$resultAsObject = NULL;
			}
			
			return $resultAsObject;
		}
		else
		{
			return NULL;
		}
	}
	
	// Get an array of results from a query
	public static function listByQuery($query)
	{
		$result = mysql_query($query);
		
		$resultArray = null;
		
		// Get result
		while ($thisResult = mysql_fetch_assoc($result))
		{
			$resultArray[] = static::objectFromResult($thisResult);
		}
		
		return $resultArray;
	}
	
	// Convert a query result row to an object
	public static function objectFromResult($thisResult)
	{
		return NULL;
	}
}


// Get a location	
function getLocations()
{
	// Connect to database
	DataModel::connectToDatabase();
	
	// Create query
	$query = "	SELECT 
					location.*,
				FROM location";
	
	// Get result
	//$location = DataModel::getByQuery($query);
	$location = mysql_query($query);
	
	// Close database connection
	mysql_close();
	
	print_r($location);
	
	return $location;
	
}
*/

/*// Get dates
if (isset($_REQUEST['fromDate']))
{
	$fromDate = new DateTime($_REQUEST['fromDate']);
	$toDate = new DateTime($_REQUEST['fromDate']);
	
	$oneDay = new DateInterval('P1D');
	$toDate->add($oneDay);
}
else
{
	// No date specified, create a range of one week from today
	$fromDate = new DateTime();
	$toDate = new DateTime();
	
	$sevenDays = new DateInterval('P7D');
	$toDate->add($sevenDays);
}

$fromDateString = $fromDate->format('Y-m-d');
$toDateString = $toDate->format('Y-m-d');
*/

// Get list of locations
//$locations = getLocations();

// Create query
$query = "	SELECT 
					*
				FROM location";

//$statement = $pdo->prepare($query);
//$locations = $statement->execute();

/*
$statement = $pdo->query($query);
$statement->execute();

$locations = $statement->fetchAll();
*/

$stmt = $pdo->prepare('select * from location');
$stmt->execute();

$locations = array();

while ($row = $stmt->fetch())
{
	$locations[] = $row;
	//print_r($row);
}

/*foreach($locations in $location)
{
	print_r($location);
}
*/

// Output locations as JSON
echo json_encode($locations);

?>