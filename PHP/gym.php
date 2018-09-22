<!--
	GYM Website - PHP Database
	
	Required tables:
	GymDB.sql
		ClassId
		ClassSchedule
		MemberBooking
	
	Created by Jet-Tsyn Lee 12/12/17
	Last update v0.2 14/12/2017
-->


<?php

	// #######  SESSION  #######
	
	// Start Session
	session_start();
	$servReq = $_SERVER['REQUEST_METHOD'];

	
	// ~~~~~  UPDATE Session Values  ~~~~~
	// Class Time schedule, to be set first as this may be replaced by class
	if (empty($_POST["schSel"]) == false){
		$_SESSION["date"] = formatInput($_POST["schSel"]);
	}
	
	// Class Type
	if (empty($_POST["classSel"]) == false){
		
		// If the class value changed from the previous session input, reset the class time
		if ($_SESSION["class"] != $_POST["classSel"])
			$_SESSION["date"] = 'None';
		
		$_SESSION["class"] = formatInput($_POST["classSel"]);
	}

	// Member name and phone number
  	// Set to check for POST changes to always update value if input was change
	if ($servReq == 'POST'){
		$_SESSION["name"] = formatInput($_POST["nameInp"]);
		$_SESSION["num"] = formatInput($_POST["numInp"]);
		
		// Copy inputs to return back to field
		$_SESSION["copyName"] = $_POST["nameInp"];
		$_SESSION["copyNum"] = $_POST["numInp"];
	}
	
	// Set session values to variables
	$classInp = $_SESSION['class'];
	$schInp = $_SESSION["date"];
	$nameInp = $_SESSION["name"];
	$numInp = $_SESSION["num"];


	// #######  FUNCTIONS  #######
	// Remove any characters and encodes inputs to avoid any malicious inputs by the user
	function formatInput($var){
		$var = stripslashes($var);
		$var = htmlspecialchars($var);
		return $var;
	}

	// Checks the Name input based on criterias and returns a boolean response
	// Uses Regular Expression to check inputs
	function checkName($str){
		
		// If variable empty
		if (strlen($str) == 0){
			return false;
		
		// Must contain only letters(non-case), hyphen, apostrophe, and space
		// REGEX: identify anything not in criteria
		}else if (preg_match("/[^a-zA-Z|\'|\-|\s]/",$str)){
			return false;
		
		// Cannot contain 2+ hyphens or apostropes
		// REGEX: finds 2 or more - or '
		} else if (preg_match("/-{2,}|'{2,}/",$str)){
			return false;
		
		// Must start with a letter
		// REGEX: check start is NOT a letter
		} else if (preg_match("/^[^a-zA-Z]/",$str)){
			return false;
		
		} else {
			return true;
		}
	}
	
	// Check the Phone number input is valid and returns boolean
	// Uses Regular Expression to check inputs
	function checkNum($num){
		
		// Remove spaces to only count digits
		$num = str_replace(' ','',$num);	
		
		// If variable empty
		if (strlen($num) == 0){
			return false;
		
		// Must contain only digits and spaces 
		// REGEX:find any NOT a number or space)
		} else if (preg_match("/[^0-9|\s]/",$num)){
			return false;
			
		// Must contain '0' + 9-10 digits (exc. space, check full string length)
		} else if (strlen($num) < 10 || strlen($num) > 11){
			return false;
		
		// Must start with number zero 
		// REGEX: check first char is not zero
		} else if (preg_match("/^[^0]/",$num)){
			return false;
			
		} else {
			return true;
		} 
	}

	
	// Check if the Variable is empty or set as 'None' to restrict form selection, returns boolean
	function isEmpty($var){
		if (empty($var) == false && $var != "None"){
			return false;
		} else {
			return true;
		}
	}
?>

<!DOCTYPE html>
<html lang="en-GB">


	<!-- HEADER SECTION -->
	<head>
		<meta charset = 'utf-8'>
		<title>JL Gym</title>

		<!-- Meta Data -->
		<meta name='Title' content='Gym Classes' />
		<meta name='Type' content='Gym Classes' />
		<meta name='Rights' content='Copyright Jet-Tsyn Lee' />
		<meta name ="Author" content ="Jet-Tsyn Lee">
		<meta name ="Description" content ="">
		<meta name ="Keywords" content ="Classes, Gym">
		
		<!-- CSS STYLE -->
		<style>
		
			/* ~~~~~  WEBPAGE FORMATS AND HEADING  ~~~~~ */
			html {
				font-family:'Arial';
				background-color:#e2e2e2;
				text-align:center;
				min-width:800px;
			}
			
			h2 {
				text-align:center;
				font-size:120%;
				color:#00755d;
			}
			
			header{	
				padding: 20px 40px;
				font-size:200%;
				font-weight:bold;
				text-align:center;
				color:white;
			}
						
			footer {
				color:white;
				margin-top:50px;
				padding: 10px 20px 20px; 
				font-size:80%; 
			}

			header, footer{
				background-color:#424242;
			}
			

			/* ~~~~~  WEBPAGE LAYOUT  ~~~~~ */
			.class_input{
				display:inline-flex;
				width:95%
			}
		
			.booking, .confSec{
				display:block;
				width:60%;
				padding:10px;
			}
			
			.classTable{
				display:block;
				width:40%;
				padding:10px;
			}
			
			
			/* ~~~~~  DESCRIPTION  ~~~~~ */
			
			.description{
				display:inline-flex;
				width:95%;
			}
			
			.desc {
				margin:1% 10%;
				text-align:center;
			}
			
			.imgDiv{
				width:200px;
				height:200px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin:10px;
			}
			
			img{
				max-width:200px;
				max-height:200px;
			}
			
			
			/* ~~~~~  CLASS TABLE  ~~~~~ */
			table, td, th{
				border-collapse: collapse;
				border-style:solid; 
				border-color:#424242;
				text-align:center;
				font-size:100%;
			}
			table{
				display: inline-table;
				table-layout: fixed;
				word-wrap:break-word;
			}
			td {	
				background-color:white;
				padding:3px 5px;
			}
			th {
				padding:5px 10px;
			}

			.avlFalse{
				color:#b7b7b7;
			}
		
		
			/* ~~~~~  APPLICATION FORM AND BUTTONS  ~~~~~*/
			input[type=text], input[type=tel], select {
				width: 100%;
				padding: 8px 15px;
				margin: 8px 0;
				display: inline-block;
				border: 2px solid #424242;
				border-radius: 4px;
				box-sizing: border-box;
			}
		
			label{
				text-align:left;
				display:block;
			}
			
			#buttonBar{
				grid-area: buttons;
				display:flex;
				flex-direction: row;
			}

			input[type=submit], input[type=button]{
				flex-grow:1;
				background-color: #00755d;
				color: white;
				padding: 10px;
				border: none;
				border-radius: 10px;
				cursor: pointer;
				font-size:20px;
				text-align:center;
				margin:20px 10px;
			}

			input[type=submit]:hover, input[type=button]:hover{
				background-color: #00c49c;
			}
			
			.error{
				font-weight:bold;
				color: red;
			}
			
			p{
				display:block;
				text-align:left;
			}
			
			.appForm{
				margin: 5px 0;
			}
			
			
			/* ~~~~~  ADDITIONAL SECTIONS  ~~~~~ */
			ul {
				list-style-type: none;
				padding: 0% 5%;
			}
			
			.liType {
				font-weight:bold;
				text-align:left;
			}
			
			.liVal{
				padding:5px;
				margin: 3px;
				background: #ffffff;
			}

		</style>
		
	</head>


	<body>
	<header>JTL Gym</header>
	
	<!-- DESCRIPTION -->
	<section class='description'>
		<div>
		<h2>Classes for all members</h2>
		<p class="desc">Whether you want to lose weight, build muscle or feel the burn as part of a group for a change, 
			JTL Gym offer a number of instructor-led classes to help you shape up.
			Our timetable is packed full of classes and each one is tailored to work for all fitness abilities.</p>
		<p class="desc">No need for account registration, just fill out the form below and join today. </p>
		</div>
		
		
		<!-- IMAGE -->
		<div class="imgDiv">
		<?php
			// Print HTML image based on the selected class
			echo"<img src='";
			switch($classInp){
			case 1:
				echo"http://8431674a2cc723696c49-ef3afb6185d4ff0c84b92b40db8b8bd0.r96.cf5.rackcdn.com/2014/02/Boot-Camp-text-logo.png";
				break;
			case 2:
				echo"http://www.primalxfitness.com/wp-content/uploads/2016/02/boxercise.png";
				break;
			case 3:
				echo"http://www.sourcehealthandfitness.com/wp-content/uploads/2015/04/pilates-shoulder-bridge.png";
				break;
			case 4:
				echo"https://upload.wikimedia.org/wikipedia/commons/b/b5/Yoga_Meditation_Pos-410px.png";
				break;
			case 5:
				echo"https://rec.mcmaster.ca/sites/default/files/imgs/zumba.png";
				break;
			default:
				echo"https://d30y9cdsu7xlg0.cloudfront.net/png/75699-200.png";
				break;
			}
			echo"' alt='gym'>";
		?>
		</div>
		
	</section>
 
 
 <div class='class_input'>
 
 <?php

	// Database Settings
	$db_hostname = "mysql";
	$db_database = "m7jtl";
	$db_username = "m7jtl";
	$db_password = "w35117278jl";
	$db_charset = "utf8mb4";
	$dsn = "mysql:host=$db_hostname;dbname=$db_database;charset=$db_charset";

	$opt = array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false
	);
	 
	try {
		
		// Access Database
		$pdo = new PDO($dsn,$db_username,$db_password,$opt);

		// Set Table Names
		// Class - containing class details (name)
		// Sch - containing the times avalible for the selected class
		// Book - Members booking for the times
 		$tblClass = "ClassId";
		$tblSch = "ClassSchedule";
		$tblBook = "MemberBooking";
		
		// Set Column Names
		$colCNo = "classNo";
		$colSId = "schId";

			
		// #######  CONFIRMATION FORM  #######
		// Once user completes form, submit is sent and asks for a confirmation before sending to the database.
		// Checks input has been submitted by button, and all inputs are avalible and correct
 		if ($servReq == 'POST' && $_POST['subBtn'] == 'Submit' && 
			isEmpty($classInp) == false && isEmpty($schInp) == false && checkName($nameInp) == true && checkNum($numInp) == true)	{

			// Get Database Information
			$stmt = $pdo->query("SELECT * FROM $tblSch AS S, $tblClass AS C WHERE S.classNo = C.classNo AND S.schId = $schInp;");
			$row = $stmt->fetch();
			$cap = $row['capacity'];
			$clName = $row['className'];
			$clTime = $row['time'];
			

			echo "<section class='confSec'>";
			
			// Check for avalible spaces
			if ($cap - 1 >= 0)	{
				
				// #####  SUBMIT BOOKING FORM  #####
				// Confirm booking and capacity when the user selects the confirm button in the confirmation form
				if ($_POST['confBtn'] == 'Submit Booking')	{	
					
					// Begin Transaction
					$pdo -> beginTransaction ();
					
					try{
					
						// Reduce capacity of class by 1 slot
						$stmt = $pdo->prepare("UPDATE $tblSch SET capacity = :capacity where schId=:schid;");
						$success = $stmt->execute(array('capacity'=>$cap-1,'schid'=>$schInp));

						// Get booking reference integer and set next number (+1)
						// Create blank array and push all references into the array to be checked by max
						$refArr = array();
						$fetch = $pdo->query("SELECT bookRef FROM $tblBook;");
						foreach($fetch as $row)
							array_push($refArr,$row["bookRef"]);
						$bookRef = max($refArr) + 1;
						
						
						// Format inputs before inserting booking into database
						// Remove any additional spaces in name
						$nameInp = trim($nameInp);
						// Remove all spaces in number to maintain uniformity in database
						$dbNumInp = str_replace(' ','',$numInp);
						
						
						// Input booking details to database
						$stmt = $pdo->prepare("INSERT INTO $tblBook VALUES (:ref,:name,:number,:schId);");
						$stmt->bindValue(':ref',$bookRef,PDO::PARAM_STR);
						$stmt->bindValue(':name',$nameInp,PDO::PARAM_STR);
						$stmt->bindValue(':number',$dbNumInp,PDO::PARAM_STR);
						// Convert to string due to Integrity constraint violation
						$stmt->bindValue(':schId',(string)$schInp,PDO::PARAM_STR);	
						$stmt->execute();
						
						// Commit Transaction
						$pdo->commit();
						
						// Clear Session details
						session_unset();
						session_destroy();
				
						// Print success results to user
						echo<<<SUBMITFORM
							<h2>Thank You for your booking</h2>
							<p>Your booking details are as follows</p>
							<ul>
								<li><div class='liType'>Booking Reference:</div><div class='liVal'>$bookRef</div></li>
								<li><div class='liType'>Class:</div><div class='liVal'>$clName</div></li>
								<li><div class='liType'>Class Time:</div><div class='liVal'>$clTime</div></li>
								<li><div class='liType'>Full Name:</div><div class='liVal'>$nameInp</div></li>
								<li><div class='liType'>Phone Number:</div><div class='liVal'>$numInp</div></li>
							</ul>
							
SUBMITFORM;
					// On transaction error, rollback changes and show error
					} catch ( Exception $e ){
						echo"<h2>An error has occured.</h2>";
						echo"<p>Please return and try again</p>";
						// Rollback the transaction
						$pdo->rollBack();
					}

					echo "<form>";

					
				// #####  CONFIRMATION FORM  #####
				// Show a confirmation form to the user before submitting listing the inputs and hiddin values
				} else {
						
					echo<<<CONFIRM
						<h2>Confirm Booking</h2>
						<p>Confirm class booking?</p>
						<ul>
							<li><div class='liType'>Class:</div><div class='liVal'>$clName</div></li>
							<li><div class='liType'>Class Time:</div><div class='liVal'>$clTime</div></li>
							<li><div class='liType'>Full Name:</div><div class='liVal'>$nameInp</div></li>
							<li><div class='liType'>Phone Number:</div><div class='liVal'>$numInp</div></li>
						</ul>
						<form name="confFrm" method="post">
							<input type ="hidden" name="classSel" value ="$classInp">
							<input type ="hidden" name="schSel" value ="$schInp">
							<input type ="hidden" name="nameInp" value ="$nameInp">
							<input type ="hidden" name="numInp" value ="$numInp">
							<input type ="hidden" name="subBtn" value ="Submit"> 
							<div id='buttonBar'>
								<input type ="submit" name="confBtn" value="Submit Booking"> 
							</div>
CONFIRM;
				}

			// If no more spaces avalible, return error form
			} else {
				echo <<<ERRORFORM
					<h2>Error Occured</h2>
					<p>Apologies, there are no more spaces avalible for the selected class.</p>
					<p>Please return and select another booking</p>
					<form>
					
ERRORFORM;
			}


			// FORM END, add button to allow user to return back to the main page
			// Get wesite address
			$url = "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
			// Print return button at bottom of the form
			echo<<<FORMEND
				<div id='buttonBar'>
					<input type="button" value="Return" onclick="window.location.href='$url'" />
				</div>
				</form>
			</section>
FORMEND;


		// ########  APPLICATION FORM  #######
		} else { 

			// FORM START - include hidden inputs to carry over from submission
			echo<<<FORMSTART
			<section class="booking">
				<h2>Application</h2>
				<form name="classFrm" method="post">
					<input type ="hidden" name ="classSel" value ="$classInp">
					<input type ="hidden" name ="schSel" value ="$schInp">
					<input type ="hidden" name ="nameInp" value ="$nameInp">
					<input type ="hidden" name ="numInp" value ="$numInp">
				
FORMSTART;


			// ~~~~~  CLASS SELECTION  ~~~~~
			echo<<<CLASSSELECTION
			<div class='appForm' id='classForm'>
			<label>Please select a Class: </label>
			<select name='classSel' onChange='document.classFrm.submit()'>
				<option value='None'>-------</option>
CLASSSELECTION;

			// Get Avalible classes from database where capacity is greater than zero
			$stmt = $pdo->query("SELECT DISTINCT C.classNo, C.className FROM $tblSch AS S, $tblClass AS C WHERE C.classNo = S.classNo AND capacity > 0 ORDER BY C.className ASC;");
			
			// From SQL table, create all 
			foreach($stmt as $row) {
				
				// Checks the session selection until the option matches and selects the option when refresh
				if ($row["classNo"] == $classInp){
					// Creates a selected varialbe to be added to the option HTML line
					$selected = "selected";
					// Check that a option has been selected for the Avaliblility check below
					$clCheck = true;
				}else{
					$selected = "";
				}
				
				// Set options dropdown
				echo "<option value='{$row["classNo"]}' $selected>{$row["className"]}</option>";
			}

			echo"</select>";
			
			// Avaliblility check - check if the selected class is still avalible after selection
			// checks if a selection has been made but the shedule is no longer avalible
			if ($clCheck != true && isEmpty($classInp) == false){
				echo "<label class='error'>Selected class is no longer avalible, please select another class</label>";
				$classInp = 'None';
			}

			echo"</div>";
			
			
			// ~~~~~  SCHEDULE SELECTION  ~~~~~
			if (isEmpty($classInp) == false){
				
				echo<<<SCHEDULEFORM
				<div class='appForm' id='schForm'>
				<label>Please select a Scheduled Time: </label>
				<select name='schSel' onChange='document.classFrm.submit()'>
					<option value='None'>-------</option>
SCHEDULEFORM;
				// Get Class Times
				$stmt = $pdo->query("SELECT * FROM ClassSchedule WHERE classNo=$classInp AND capacity > 0;");
				foreach($stmt as $row) {
					
					// Checks the session selection until the option matches and selects the option when refresh
					if ($row["schId"] == $schInp)	{
						// Creates a selected varialbe to be added to the option HTML line
						$selected = "selected";
						// Check that a option has been selected for the Avaliblility check below
						$schCheck = true; 
					} else {
						$selected = "";
					}
					
					// Set options dropdown
					echo "<option value='{$row["schId"]}' $selected>{$row["time"]}</option>";
				}

				echo"</select>";
				
				// Avaliblility check - check if the selected class is still avalible after selection
				// checks if a selection has been made but the shedule is no longer avalible
				if ($schCheck != true && isEmpty($schInp) == false){
					echo "<label class='error'>Selected class is no longer avalible, please select another time</label>";
					$schInp = 'None';
				}
				
				echo"</div>";
			}
			
			
			// ~~~~~  MEMBER DETAILS INPUTS  ~~~~~
			// Checks if both the Class and time has bee selected
			if (isEmpty($classInp) == false && isEmpty($schInp) == false){
				
				// FULL NAME INPUT
				echo"<div class='appForm' id='nameForm'>";
				
				// Decodes the use input back to HTML to return the previously inputted string
				$decName = htmlspecialchars_decode($nameInp, ENT_HTML401);			
				echo "<label> Enter your full name:<input type ='text' name='nameInp' onChange='document.classFrm.submit()' value='$decName'></label>";
				if (checkName($nameInp) == false && (strlen($nameInp) != 0 || $_POST['subBtn'] == 'Submit'))
					echo "<label class='error'>Invalid Name Input, please input only letters, hypens, apostropes, or spaces</label>";
				echo"</div>";
				
				
				// PHONE NUMBER
				echo"<div class='appForm' id='numForm'>";
				
				// Decodes the use input back to HTML to return the previously inputted string
				$decNum = htmlspecialchars_decode($numInp, ENT_HTML401);
				echo "<label> Enter your Phone Number:<input type ='tel' name ='numInp' onChange='document.classFrm.submit()' value='$decNum'></label >";
				if (checkNum($numInp) == false && (strlen($numInp) != 0 || $_POST['subBtn'] == 'Submit'))
					echo "<label class='error'>Invalid Phone Number Input, please input only digits or spaces</label>";
				
				echo"</div>";
				
				
				// Set Submission button
				echo<<<BUTTON
				<div id='buttonBar'>
					<input type='submit' name='subBtn' value='Submit'>
				</div>
BUTTON;
			
			}

			// End Form
			echo<<<FORMEND
			</form>
			</section>
FORMEND;

		} 
		
		
		
		// ~~~~~  AVALIABLE CLASSES TABLE  ~~~~~
		// Table Head
		echo<<<TABLESTART
			<section class='classTable'>
			<h2>Avaliable Classes</h2>
			<table>
				<thead>
					<tr><th>Class</th><th>Time</th><th>Capacity</th></tr>
				</thead>
				<tbody>
TABLESTART;

		// Table Data
		// Query database to get all avalible shedule information, sorting by class number and date
		$stmt = $pdo->query("SELECT C.className, S.time, S.capacity FROM $tblSch AS S, $tblClass AS C WHERE S.classNo = C.classNo ORDER BY S.classNo, CAST(schId AS SIGNED INTEGER) ASC;");
		foreach($stmt as $row) {
			// Checks if the capacity of the class has been reduced to zero, set HTML class depending on availability for formatting
			if ($row['capacity'] <= 0)
				$availability = "avlFalse";
			else
				$availability = "avlTrue";
			
			// Create Table Data
			echo<<<TABLEDATA
			<tr class='$availability'>
				<td>{$row['className']}</td>
				<td>{$row['time']}</td>
				<td>{$row['capacity']}</td>
			</tr>
TABLEDATA;
		}
		
		// Table End
		echo<<<TABLEEND
				</tbody>
			</table>
		</section>
TABLEEND;
		
		// Close PDO database
		$pdo = NULL;

	// If cannot access PDO exception
	} catch (PDOException $e) {
		echo<<<ERROR
		<h2>Internal Database currently unavaliable</h2>
		<p>Please try again later.</p>
ERROR;
		exit("PDO Error: ".$e->getMessage()."<br>");
	}
	 
 ?>
 
		</div>
 
 		<!-- #####  FOOTER  ##### -->
		<footer>
			<span style="float:left; vertical-align:middle">Copyright &copy; Jet-Tsyn Lee</span>

			<span style="float:right">
				Last modified:
				<script>
					document.writeln(document.lastModified);
				</script>
			</span>
		</footer>
	</body>

</html>