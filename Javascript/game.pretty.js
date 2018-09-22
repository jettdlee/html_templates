/*
	Dice Roll Game Javascript
	File: game.pretty.js -> game.js
	
	JavaScript file for the Dice Roll game, this will control the core gameplay of the dice roll game. 
	the game will have 3 states: 
		Setup - Ask user to state the amount of dice used in the game
		Play - user will roll the dice and continue to next rounds or end game
		End - finish game and show user game information
	Containers form the html file will be edited dynamically to match the current state of the game
	
	Required Files: game.html, stylesheet.css
	Created by Jet-Tsyn Lee 30/10/2017, Last updated 07/11/2017
*/

// #####  WEBPAGE SETUP  ######
// On opening webpage, elements of the page will be hidden, and the setup state will start
// On opening webpage, elements of the page will be hidden, and the setup state will start
window.onload = loadWebpage;
function loadWebpage() {
	layout = new webLayout()	// Create public layout object that will be used throughout the process
	
	// Hide elements and begin at SETUP stage
	layout.stateSelect("Setup")
	
	visibleClass("desk",'block')
	visibleClass("tableDice",'none')
	visibleClass("result",'block')
	visibleClass("endGame",'none')
	visibleClass("hide",'none')
	
	// Footer element
	document.getElementById("footerTime").innerHTML = "Last Modified: " + document.lastModified
	// Create result table head
	layout.resTable.innerHTML = layout.resTableHead		

}


// Web Layout Object - stores all elements regarding webpage design to variables and methods to be called
function webLayout() {
	
	// Webpage Elements
	this.diceError = document.getElementById("diceError"),
	
	this.roundNo = document.getElementById("roundNo"),
	this.resDesc = document.getElementById("roundDesc"),	
	
	this.imageDice = document.getElementById("diceImg"),
	this.resTable = document.getElementById("resultTable"),
	
	this.rollBtn = document.getElementById("rollBtn"),
	
	// Result table Header, will be added to the results table for every 10th round
	this.resTableHead= '<thead><tr><th>Round No.</th><th>Dice Roll</th><th>Round Score</th><th>Total Score</th></tr></thead>'
	
	// Function to switch the buttons in the BUTTON BAR depending on the state of the game
	this.stateSelect = function(type) {		// SETUP
		if(type == "Setup") {
			visibleClass("setup",'block')
			visibleClass("gamePlay",'none')
			visibleClass("newRound",'none')
			visibleClass("confEnd",'none')
		} else if (type == "Roll") {		// PLAY - ROLL DICE
			visibleClass("setup",'none')
			visibleClass("gamePlay",'block')
			visibleClass("newRound",'none')
			visibleClass("confEnd",'none')
		} else if (type == "New Round") {	// PLAY - NEW ROUND
			visibleClass("setup",'none')
			visibleClass("gamePlay",'block')
			visibleClass("newRound",'block')
			document.getElementById("rollBtn").style.display = 'none'	// Hide roll button contained in gameplay class
			visibleClass("confEnd",'none')
		} else if (type == "Conf End") {	// END - CONFIRM END
			visibleClass("confEnd",'block')
			visibleClass("setup",'none')
			visibleClass("gamePlay",'none')
			visibleClass("newRound",'none')
		}
	}
	
}


// Hide Class Element
function visibleClass(className, state) {
	var arrClass = document.getElementsByClassName(className);
	// Several elements use the same class name depending on the state, loop all elements to show/hide class 
	for(var i = 0; i < arrClass.length; i++){
        arrClass[i].style.display = state; 
    }
}


// ##### SETUP #####
// Set up the game and asks the user to confirm the amount of dice to be used in the game. 
function diceSetup() {
	
	// Input is checked by function to ensure correct value is used
	if (diceCheck(Number(document.getElementById("diceNo").value)) == false) return;
	
	// Public Game Object - Game object will store all values for the current game and results for the round
	game = {
		roundNo: 0,		// Current Round number	
		score: {total: 0, round:0},	// Total and round score
		
		// Result conditions - each value determines the round score using a switch function
		result: 0,	// Condition for the current round
		resSame: 1,	// All Dice the same
		resMin1: 2,	// N-1 dice the same
		resStrt: 3,	// Straight
		resDiff: 4,	// Different Dice faces
		resNone: 5, // None
		
	}
	
	// Public Dice Object - dice object which will store all variables regarding dice rolls and methods
	dice = {
		diceNo: Number(document.getElementById("diceNo").value),	//Number of dice used
		faces:6,		// Amount of faces per dice
		diceArr: [],	// Array which will contain the dice rolls
		
		// Sum all dice rolls
		sumDice: function () {
			sum = 0;
			for(i=0; i < this.diceArr.length; i++){
				sum += parseInt(this.diceArr[i])
			}
			return Number(sum)
		},
		
		// Return dice rolls as string
		rollStr: function() {
			var diceStr = "";
			for(i=0; i < this.diceArr.length; i++){
				diceStr += this.diceArr[i];
				if (i != this.diceArr.length - 1){diceStr += ", "}
			}
			return diceStr;
		},

	}
			
	// Add Result table head for every new game
	layout.resTable.innerHTML = layout.resTableHead
	
	// Show PLAY state for the user to roll dice
	layout.stateSelect("Roll")
	visibleClass("tableDice",'block')
	visibleClass("endGame",'none')
	roundStart()	//New Round
	
	// Show initial Dice
	layout.imageDice.innerHTML = ""	//reset dice
	for (iDice = 0; iDice < dice.diceNo; iDice++) {
		diceImage(1);
	}
		
		
	//Check dice number input is correct
	function diceCheck(dNo)	{
		if (dNo < 3 ) {	// Input lower than 3
			layout.diceError.innerHTML = "Input under limit";
			return false;
		} 
		else if (dNo > 6 ) {	// Input greater than 6
			layout.diceError.innerHTML = "Input over limit";
			return false;
		}
		else if (!(dNo % 1 == 0)) {	// Input is a decimal
			layout.diceError.innerHTML = "Invalid input";
			return false;
		}
		else {	// Correct
			layout.diceError.innerHTML = "";
			return true;
		}
	}
	
}



// #####  GAMEPLAY  #####
// ~~~~~  Round Start  ~~~~~
// Update new round for the user to roll
function roundStart() {
	
	// Add round number and display
	++game.roundNo
	layout.roundNo.innerHTML = "Round " + game.roundNo
	
	//Show PLAY elements and update game description
	layout.stateSelect("Roll")
	visibleClass("tableDice",'block')
	visibleClass("endGame",'none')
	layout.resDesc.innerHTML = "Please select 'Roll' to begin"	
	
	// Enable roll button
	layout.rollBtn.disabled = false
}


// ~~~~~  Game Roll  ~~~~~
// User rolls dice and a random value is given, dice will be calculated and scores displayed
function dicePlay() {
	
	// Disable Roll button so the user cannot click roll more than once
	layout.rollBtn.disabled = true
	
	// Roll the number of dice for the game and store in array using function
	rollDice(dice.diceNo, dice.diceArr);
	
	// Sort dice array to numeric order to allow results to be calculated
	dice.diceArr.sort();
		
	// Calculate results using function
	game.score.round = diceScore(dice.diceArr);	// Set current round score
	game.score.total +=game.score.round			// Add score to total score balance
	
	// Print Results
	printResults()
}


// ######  DICE  #######
// ~~~~~  Roll Dice  ~~~~~
function rollDice(diceCount, array){
	
	layout.resDesc.innerHTML = "Rolling..."	// Set game description
	
	// Function to return a random dice number
	function randomDice() {
		var diceRoll = 1 + Math.random() * dice.faces
		return parseInt(diceRoll)
	}

	// Set actual dice roll for round to DICE Array
	for (iDice = 0; iDice < diceCount; iDice++) {
		array[iDice] = randomDice();
	}	

	// Roll Animation - a timer is set to be multiplied by an amout for every loop instance
	// this will simulate the slowing down of the dice for each loop by increasing the delay time
	// Note. code will still continue before delay has finished 
	var timer = 100;
	const LOOP = 10
	const MULTI = 1.3
	time = timer * Math.pow(MULTI, LOOP-1)	//Total animation delay, set as public to use for result show after roll
	layout.imageDice.innerHTML = ""			//Remove initial dice image
	
	// roll will be delayed which is shown to user
	for (i = 1; i < LOOP; i++) {
		
		setTimeout(	function () {
			layout.imageDice.innerHTML = ""
			// loop through random animation and rotation values to simulate roll
			for (iDice = 0; iDice < diceCount; iDice++) {
				diceImage(randomDice(), (parseInt(Math.random() * 90)));	
			}
			
		}	,timer);
		
		timer *= MULTI	//multiply timer to slow down rolls
	}
	
	//Show actual dice images of results after animation
	arrayCopy = array.slice()	//copy array print to get roll order and ignore sort
	setTimeout(	function() {	
		layout.imageDice.innerHTML = ""
		for (iDice = 0; iDice < diceCount; iDice++) {
			diceImage(arrayCopy[iDice]);
		}
	},time);

}

// ~~~~~  DICE IMAGE  ~~~~~
// Show dice images in the div element depending on the dice number, rotation added for the roll animation
// Dice created by Jet-Tsyn Lee using Microsoft Publisher
function diceImage(number, rotate) {
	if(rotate==null || rotate==undefined){rotate = 0}
	layout.imageDice.innerHTML += "<img class='dice' src=\"Dice" + number + ".png\" title=\""+number+"\" alt=\""+number+"\" style=\"transform:rotate("+String(rotate)+"deg)\">"
}


// ~~~~~  Print Results  ~~~~~
function printResults(roundScore, diceArr) {
	
	// Timer used to print results to user, once the roll animation finishes
	setTimeout(function(){

		// Reset table every #1st round (11,21,31)
		if ((game.roundNo - 1) % 10 == 0) {layout.resTable.innerHTML = layout.resTableHead}
		
		// Add round results to Table
		layout.resTable.innerHTML += "<tr\><td class='resRound'\>" +  game.roundNo	+ "</td \><td \>" +  dice.rollStr()
							+ "</td \><td \>" +  game.score.round	+ "</td \><td class='resTotal'\>" +  game.score.total
							+ "</td \></tr \>"
		
		// Display round description, depending on results, different descriptions will be displayed
		layout.resDesc.innerHTML = "You rolled " + dice.rollStr() +" - "
		switch(game.result){
			case game.resSame:
				layout.resDesc.innerHTML += dice.diceNo + " of a kind, score:" + game.score.round
				break;
			case game.resMin1:
				layout.resDesc.innerHTML += (dice.diceNo-1) + " of a kind, score:" + game.score.round
				break;
			case game.resStrt:
				layout.resDesc.innerHTML += "Straight, score:" + game.score.round
				break;
			case game.resDiff:
				layout.resDesc.innerHTML += "Diferent Values, score:" + game.score.round
				break;
			case game.resNone:
				layout.resDesc.innerHTML += "Unlucky, Try again."
				break;
			default:
				layout.resDesc.innerHTML = "something went wrong"
		}
		
		// Set layout for New Round or end
		layout.rollBtn.style.display = 'none'	//hide roll button
		layout.stateSelect("New Round")			//show next round
		visibleClass("tableDice",'block')
		visibleClass("endGame",'none')
		
	},	time)
}

// ~~~~~  Dice Score ~~~~~
// Calculate the round score based on the different results form the dice.
function diceScore(array){
	
	// Results are done by comparing the differences between 2 positions in the array (position & position+1), after the array has been sorted
	// depending on the difference, the result adds 1 to three different cases to be compared, e.g. 1-1 = A, 1-3 = C, 2-3 = B
	var caseA = 0;		// Compared values are the same
	var caseB = 0;		// Compared values is 1 different
	var caseC = 0;		// Compared values is 2 or more different
	var firstCase;		// Get the case for the first and last comparison
	var lastCase;
	
	// Loop all values in the roll Array to add to the case
	for (i=0; i < (array.length - 1) ; i++){
		if (array[i] == array[i+1]) {				//if the values are the same
			caseA++;
			if (i==0) {firstLink = "A"}				//Set the first and last results
			if (i==(array.length - 2)) {lastLink = "A"}
		} else if ( array[i] + 1 == array[i+1]){	//if the value is 1 higher
			caseB++;
			if (i==0) {firstLink = "B"}
			if (i==(array.length - 2)) {lastLink = "B"}
		} else {									//if the value is 2+ higher
			caseC++;
			if (i==0) {firstLink = "C"}
			if (i==(array.length - 2)) {lastLink = "C"}
		}
	}
	
	// Set result summary and return score depending on dice roll
	var diceNo = dice.diceNo
	var diceSum = dice.sumDice()
	
	// All Numbers the same (All A), e.g 4 4 4 4 4 = "aaaa"
	if (diceNo - 1 == caseA) {	
		game.result = game.resSame;
		return 60 + diceSum;
	}	
	// N-1 numbers the same, both first and last values must not be 'A' (N-1A, 1/N != A),  1 5 5 5 5 5 = "caaaa" = true, 1 1 5 5 = "aba" = false
	else if (diceNo - 2 == caseA && (firstLink != "A" || lastLink != "A")) { 
		game.result = game.resMin1;
		return 40 + diceSum;
	}
	// Numbers in a sequence (All B), 1 2 3 4 5 = "bbbb"
	else if (diceNo - 1 == caseB) { 
		game.result = game.resStrt;
		return 20 + diceSum;
	}
	// All numbers different, no sequence (no A, at least 1 C) 1 2 3 4 6 = "bbbc"
	else if (caseA == 0 && caseC >= 1) {
		game.result = game.resDiff;
		return diceSum;
	}
	// None of the above, 1 2 3 4 4 6 = "bbbac", 1 2 3 3 4 5 = "bbabb"
	else {	
		game.result = game.resNone;
		return 0;
	}

}



// ########  END  #########
// User to confirm if they want to end game
// Set confirmation state
function confEnd(){
	layout.stateSelect("Conf End")
}

// If user selects No, Return to game state
function gameEndNo(){
	layout.stateSelect("New Round")
}

// Is user selects Yes, end game and show total game information
function gameEndYes(){
	
	// Return to Setup state
	layout.stateSelect("Setup")
	visibleClass("tableDice",'none')
	visibleClass("endGame",'block')
	
	// Show game results
	document.getElementById("endRound").innerHTML = "Total Rounds played: " + game.roundNo;
	document.getElementById("endTotal").innerHTML = "Total Score: " + game.score.total;
	var avarage = parseFloat(game.score.total / game.roundNo);
	document.getElementById("endAverage").innerHTML = "Average score per round: " + avarage.toFixed(2);
	
}
	
	
