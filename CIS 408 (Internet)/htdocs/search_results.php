<?php
$mysqli = new mysqli("127.0.0.1", "application", "1234", "catalog", 3306);

$arr;

if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

if ($_POST["kind"] == 1){
	$res = $mysqli->query("SELECT * FROM cd WHERE title = '$_POST[query]'");
	getJSON($res);
}

else if ($_POST["kind"] == 2){
	$res = $mysqli->query("SELECT * FROM cd WHERE fname = '$_POST[query]' OR lname = '$_POST[query]'");
	getJSON($res);
}

else if ($_POST["kind"] == 3){
	$res = $mysqli->query("SELECT * FROM cd WHERE price = '$_POST[query]'");
	getJSON($res);
}

else if ($_POST["kind"] == 4){
	$res = $mysqli->query("SELECT * FROM cd WHERE year = '$_POST[query]'");
	getJSON($res);
}

function getJSON($res){
	if ($res == null) echo "Fatal error caught!";
	else {
		$res->data_seek(0);
		
		while ($row = $res->fetch_assoc()) {
			$arr = array(
			'title' => $row['title'],
			'fname' => $row['fname'],
			'lname' => $row['lname'],
			'price' => $row['price'],
			'year' => $row['year']
		);
		echo json_encode($arr);
		}
	}
}

?>