/*


game of chance using 3 - 6 dice
dice - 6 sided between 1-6
when rolled, each number occurs a equal chance
3 stages:
	setup 	- user is asked to enter the number of dice used, 
			- error if not a natural number between 3-6, contiues until done, eoor in java script
			
	play 	- game proceeds in rounds, program maintains balance of points won and number of rounds played 
			- each round, program increments the number of rounds played, then rolls the dice to compute the number of points
			- number of points added to the balance of points and constitutes the end of round balance
			
			-display no of rounds
			-dice values
			-points won
			-balance of points at the end of round
			
			-option to continue or end round
	end		-on end show, number of rounds played, blance of points, average number of points per round
	

*/


//#####  WEBPAGE SETUP  ######

//https://stackoverflow.com/questions/4842590/run-function-when-page-is-loaded
//hide gameplay
//https://www.w3schools.com/jsref/prop_style_display.asp


window.onload = hideGameplay;

function hideGameplay(){
	visibleClass("setup",'block')
	visibleClass("gamePlay",'none')
	visibleClass("result",'none')
	visibleClass("newRound",'none')
	
	
}

function showGameplay(){
	visibleClass("setup",'none')
	visibleClass("gamePlay",'block')
	visibleClass("result",'block')

}

function visibleClass(className, state){
	var arrClass = document.getElementsByClassName(className);
	for(var i = 0; i < arrClass.length; i++){
        arrClass[i].style.display = state; 
    }
	
}


//##### SETUP #####

function diceSetup(){
	
	//Global variables
	
	diceNo = document.getElementById("diceNo").value;
	imageDice = document.getElementById("diceImg");
	roundNo = 0;
	totalScore = 0;
	
	
	
	
	
	
	
	resTableHead = "<thead><tr><th>Round No.</th><th>Dice Roll</th><th>Round Score</th><th>Total Score</th></tr></thead>"
	resTable = document.getElementById("resultTable")
	resTable.innerHTML = resTableHead
	
	//Check no of dice is correct
	if (diceCheck(Number(diceNo)) == false) return;
		
	//disable start form and show gameplay
	showGameplay()
	
	//Show initial Dice
	imageDice.innerHTML = ""	//reset dice
	for (iDice = 0; iDice < diceNo; iDice++) {
		diceImage(1);
	}
	
	roundStart()
		
	function diceCheck(dNo)	{

	if (dNo < 3 ){
		document.getElementById("diceError").innerHTML = "Input under limit";
		return false;
	} 
	else if (dNo > 6 ){
		document.getElementById("diceError").innerHTML = "Input over limit";
		return false;
	}
	else if (!(dNo % 1 == 0)){
		document.getElementById("diceError").innerHTML = "Invalid input";
		return false;
	}
	else {
		document.getElementById("diceError").innerHTML = "";
		return true;
	}
	
	}
	
}


//#########  ROUND START  #########
function roundStart(){
	++roundNo
	document.getElementById("roundNo").innerHTML = "Round " + roundNo
	document.getElementById("rollBtn").disabled = false
	visibleClass("gamePlay",'block')
	visibleClass("newRound",'none')
}

//#########  DICE ROLL  #########
function dicePlay(){

	resDesc = document.getElementById("roundDesc")
	document.getElementById("rollBtn").disabled = true

	var roundScore;	
	var diceArr = [];
	
	result = 0;	//get round summary
	//Result conditions
	resSame = 1
	resMin1 = 2
	resStrt = 3
	resDiff = 4
	resNone = 5
	
	//loop number of dice
		//get dice rolls
	//add to array
	rollDice(diceNo, diceArr);
	
	
	//Professional JavaScript for Web developers - Nicholas C. Zakas. page 106
	//Sort Array
	diceArr.sort();
		
	//Calculate results	//add to round
	roundScore = diceScore(diceArr);
	totalScore +=roundScore
		
	
	//Print Results (timer set in function)
	printResults(roundScore,diceArr)
	
}


function printResults(roundScore,diceArr){
	//timer used to print results to user once the roll animation finishes
	//time set in animation function
	
	setTimeout(function(){
		var diceStr = "";
		
		for(i=0; i < diceArr.length; i++){
			diceStr += diceArr[i];
			if (i != diceArr.length - 1){diceStr += ", "}
		}
		
		//reset table when round over 10
		if (roundNo % 10 == 0) {resTable.innerHTML = resTableHead}
		
		resTable.innerHTML += "<tr \><td \>" +  roundNo	+ "</td \><td \>" +  diceStr
							+ "</td \><td \>" +  roundScore	+ "</td \><td \>" +  totalScore
							+ "</td \></tr \>"
		
		//description
		switch(result){
			case resSame:
				resDesc.innerHTML = "All same " + roundScore
				break;
			case resMin1:
				resDesc.innerHTML = "off by one " + roundScore
				break;
			case resStrt:
				resDesc.innerHTML = "stright " + roundScore
				break;
			case resDiff:
				resDesc.innerHTML = "different " + roundScore
				break;
			case resNone:
				resDesc.innerHTML = "unlucky "
				break;
			default:
				resDesc.innerHTML = "something went wrong"
		}
		
		document.getElementById("rollBtn").style.display = 'none'	//hide roll button
		visibleClass("newRound",'block')			//show next round
		
		
	},	time)
}




function diceScore(array){
	
	//sum dice faces
	var sumDice = 0;
	for(i=0; i < array.length; i++){
		sumDice += parseInt(array[i])
	}
	
	//results are done by comparing the differences between 2 numbers in the array
	//depending on the difference, the result returns a character
	//the number of charachters are compared for each instance of
	var compString = ""
	var caseA = 0;	//compared numbers the same
	var caseB = 0;	//compared numbers + 1
	var caseC = 0;	//compared numbers + 2+
	for (i=0; i < (array.length - 1) ; i++){
		if (array[i] == array[i+1]) {		//if the values are the same
			caseA++;
		} else if ( array[i] + 1 == array[i+1]){	//if the value is 1 higher
			caseB++;
		} else {	//if the value is 2+ higher
			caseC++;
		}
	}

	
	//set result summary and return score depending on dice roll
	if (diceNo - 1 == caseA) {	//All Numbers the same  4 4 4 4 4 = "aaaa"
		result = resSame;
		return 60 + sumDice;
	} else if (diceNo - 2 == caseA) { //N-1 numbers the same  1 5 5 5 5 5 = "caaaa"
		result = resMin1;
		return 40 + sumDice;
	} else if (diceNo - 1 == caseB) { //numbers in a sequence 1 2 3 4 5 = "bbbb"
		result = resStrt;
		return 20 + sumDice;
	} else if (caseA == 0 && caseC <= 1) {//all numbers different, no sequence (no A and atlease 1 c) 1 2 3 4 6 = "bbbc"
		result = resDiff;
		return sumDice;
	} else {	//non of the above 1 2 3 4 4 6 = "bbbac" / 1 2 3 3 4 5 = "bbabb"
		result = resNone;
		return 0;
	}

}






function diceEnd(){
	
	
	
}




//######  DICE #######


//https://www.w3schools.com/js/js_timing.asp
function rollDice(diceCount, array){
	
	resDesc.innerHTML = "Rolling..."
	
	//Get random dice number
	function randomDice(){
		var diceRoll = 1 + Math.random() * 6
		return parseInt(diceRoll)
	}

	//#####  ROUND DICE  #####
	//set actual dice roll for round
	for (iDice = 0; iDice < diceCount; iDice++) {
		array[iDice] = randomDice();
	}	
		
	//#####  Roll Animation  #####
	var timer = 100;
	var loop = 10
	var multi = 1.5
	time = timer * Math.pow(multi, loop-1)	//animation delay, set as global to use for result show
	imageDice.innerHTML = ""
	
	//roll will be delayed which is shown to user
	//loop through random animation images to simulate roll
	for (i = 1; i < loop; i++){
		
		setTimeout(	function (){
		imageDice.innerHTML = ""
		
		for (iDice = 0; iDice < diceCount; iDice++) {
			diceImage(randomDice());	
		}
		}	,timer);
		
		timer *= multi	//multiply timer to slow down rolls
	}
	
	//Show actual dice after animation
	arrayCopy = array.slice()	//copy array print and ignore sort
	setTimeout(	function(){	
		imageDice.innerHTML = ""
		for (iDice = 0; iDice < diceCount; iDice++) {
			diceImage(arrayCopy[iDice]);
		}
	},time);


	
}

//Set Dice Image
function diceImage(number){
	imageDice.innerHTML += "<img src=\"Dice" + number + ".png\" title=\""+number+"\" alt=\""+number+"\" class=\"dice\" >"
}

	
	
