<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9" lang=""> <![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="apple-touch-icon" href="apple-touch-icon.png">
	<link rel='stylesheet' href='/stylesheets/style.css'>
</head>

<body>
<form name = "search_emps" action = "/search_emps.php" type = "POST">
	<input type = "text" placeholder = "Last Name"></input>
	<button type = "submit" action = "/search_emps.php">Submit</button><br>
	<!--TODO is there a way to use html5 to reset?%--> 
	<button type = "submit" action = "/search.php">Reset</button>
</form>
</body>

</html>