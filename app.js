"use strict";
const size = 6;
const shipCap = 6;
const theButton = document.getElementById("theButton");
const theBoard = document.getElementById("board");
const theTitle = document.getElementById("title");
var players;
var boxes = [];
var currentPlayer = 0;
var phase = "start";
const scoreboard = [ 
		{
			placed:document.getElementById("placed-0"),
			sunk:document.getElementById("sunk-0"),
			shots:document.getElementById("shots-0")
		},
		{
			placed:document.getElementById("placed-1"),
			sunk:document.getElementById("sunk-1"),
			shots:document.getElementById("shots-1")
		}];

const player0ScoreBoard = document.getElementById("playerboard-0");
const player1ScoreBoard = document.getElementById("playerboard-1");

init();

function placeShip (e) {
	console.log("placeShip");
	// Kontrollera om ruta redan är skepp
	if (players[currentPlayer].shipBoxes.includes(e.target)) {
		// Ta bort skepp-klass
		theButton.disabled = true;
		boxes[e.target.id].classList.replace("ship", "empty");
		players[currentPlayer].shipBoxes.splice(players[currentPlayer].shipBoxes.indexOf(e.target), 1);
		// Dekrementera shipsplaced
		updatePlaced(-1);
	} else {
		// Kontrollera att spelaren får placera skepp
		if (players[currentPlayer].shipsPlaced == shipCap) {
			alert("Du har redan placerat ut alla dina skepp!");
		} else {
			boxes[e.target.id].classList.remove("empty");
			boxes[e.target.id].classList.add("ship");
			players[currentPlayer].shipBoxes.push(e.target);
			updatePlaced(1);
		}
	}
	if (players[currentPlayer].shipsPlaced == shipCap) {
		theButton.disabled = false;
	}
}

function bombBox(e) {
	console.log("bombBox");
	console.log("Bombed box " + e.target.id);
	var opposingPlayer = (currentPlayer == 0) ? 1:0;
	var box = e.target;
	players[currentPlayer].shots += 1;
	scoreboard[currentPlayer].shots.textContent = players[currentPlayer].shots;
	// Kontrollera om det är träff eller miss
	if (players[opposingPlayer].shipBoxes.includes(box)) {
		console.log("Hit!");
		players[currentPlayer].hits += 1;
		scoreboard[currentPlayer].sunk.textContent = players[currentPlayer].hits;
		e.target.classList.replace("empty", "sunk");
		players[currentPlayer].sunkBoxes.push(e.target);
		players[opposingPlayer].shipBoxes.splice(players[opposingPlayer].shipBoxes.indexOf(e.target), 1);
		if (players[opposingPlayer].shipBoxes.length == 0) {
			win();
		}
	} else {
		console.log("Miss!");
		e.target.classList.replace("empty", "miss");
		players[currentPlayer].missedBoxes.push(e.target);
	}
	for (var box of boxes) {
		box.onclick = () => {alert("Du har redan gjort ditt drag!")}
	}
	theButton.disabled = false;
}

function nextPhase(phase_to) {
	console.log("nextPhase");
	phase = phase_to;
	theTitle.textContent = (phase == "placing") ? "Placerings-fas":"Bombnings-fas";
	theButton.textContent = "Klar!";
	theButton.disabled = true;
	theButton.onclick = nextPlayer;
	if(phase == "bombing") {
		nextPlayer();
	}
	updateBoard();
}

function updatePlaced(change) {
	console.log("updatePlaced");
	players[currentPlayer].shipsPlaced += change;
	scoreboard[currentPlayer].placed.textContent = players[currentPlayer].shipsPlaced;
}

function nextPlayer() {
	console.log("nextPlayer");
	document.getElementById("playerboard-" + currentPlayer).style.backgroundColor = "#ddd";
	currentPlayer = (currentPlayer == 0) ? 1:0;
	document.getElementById("playerboard-" + currentPlayer).style.backgroundColor = "#faff7c";
	if (phase == "placing" && currentPlayer == 1) {
		theButton.onclick = () => {nextPhase("bombing")};
	}
	updateBoard();
	theBoard.onclick = null;
	theButton.disabled = true;
}

function updateBoard() {
	console.log("updateBoard");
	for (var box of boxes) {
		box.classList.remove("miss");
		box.classList.remove("sunk");
		box.classList.add("empty");
		box.onclick = (phase == "placing") ? (e) => {placeShip(e)} : (e) => {bombBox(e)}
	}
	for (var box of players[currentPlayer].missedBoxes) {
		box.classList.replace("empty", "miss");
		if (phase == "bombing") {
			box.onclick = () => {alert("Du har redan prövat den rutan!")}
		}
	}
	for (var box of players[currentPlayer].sunkBoxes) {
		box.classList.replace("empty", "sunk");
		if (phase == "bombing") {
			box.onclick = () => {alert("Du har sänkt ett skepp på den rutan!")}
		}
	}
}

function win() {
	console.log("win");
	theTitle.textContent ="Player " + currentPlayer + " has won!!";
	theButton.textContent = "Start over";
	theButton.onclick = init;
}

function createBox(size, id) {
	var box;
	console.log("createBox");
	box = document.createElement("DIV");
	box.classList.add("board-box");
	box.id = id.toString();
	box.style.width = (100 / size) + "%";
	return box
}

function init() {
	console.log("init");
	currentPlayer = 0;
	players = [
		{	
			shots: 0,
			hits: 0,
			shipsPlaced: 0,
			shipBoxes: [],
			sunkBoxes: [],
			missedBoxes: []
		},
			{	
			shots: 0,
			hits: 0,
			shipsPlaced: 0,
			shipBoxes: [],
			sunkBoxes: [],
			missedBoxes: []
		}
	];
	var row;
	if (phase == "start"){
		for(var i = 0; i < size; i++) {
			row = document.createElement("DIV");
			row.classList.add("board-row");
			row.style.height = (100 / size) + "%";
			for (var j = 0; j < size; j++) {
				var box = createBox(size, (i*size + j));
				boxes.push(box);
				row.appendChild(box);
			}
			document.getElementById("board").appendChild(row);
		}
		theButton.onclick = () => {
			document.getElementById("playerboard-0").style.backgroundColor = "#faff7c";
			nextPhase("placing")
		};
	}
	else {
		nextPhase("placing");
		for(var player of scoreboard) {
			player.placed.textContent = 0;
			player.sunk.textContent = 0;
			player.shots.textContent = 0;
		}
	}
}

