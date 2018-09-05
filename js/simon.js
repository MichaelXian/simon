var KEYS = ['c', 'd', 'e', 'f'];
var NOTE_DURATION = 1000;
// I didn't disable noteboxes until the sound ended because the example game didn't, 
// and it makes sense so that you don't fail just because you clicked too early


// NoteBox
//
// Acts as an interface to the coloured note boxes on the page, exposing methods
// for playing audio, handling clicks,and enabling/disabling the note box.
function NoteBox(key, onClick) {
	// Create references to box element and audio element.
	var boxEl = document.getElementById(key);
	var audioEl = document.getElementById(key + '-audio');
	if (!boxEl) throw new Error('No NoteBox element with id' + key);
	if (!audioEl) throw new Error('No audio element with id' + key + '-audio');

	// When enabled, will call this.play() and this.onClick() when clicked.
	// Otherwise, clicking has no effect.
	var enabled = true;
	// Counter of how many play calls have been made without completing.
	// Ensures that consequent plays won't prematurely remove the active class.
	var playing = 0;

	this.key = key;
	this.onClick = onClick || function () {};

	// Plays the audio associated with this NoteBox
	this.play = function () {
		playing++;
		// Always play from the beginning of the file.
		audioEl.currentTime = 0;
		audioEl.play();

		// Set active class for NOTE_DURATION time
		boxEl.classList.add('active');
		setTimeout(function () {
			playing--
			if (!playing) { // !0 === true...
				boxEl.classList.remove('active');
			}
		}, NOTE_DURATION)
	}

	// Enable this NoteBox
	this.enable = function () {
		enabled = true;
	}

	// Disable this NoteBox
	this.disable = function () {
		enabled = false;
	}

	// Call this NoteBox's clickHandler and play the note.
	this.clickHandler = function () {
		if (!enabled) return; // || boxEl.classList.contains("active")) return;

		this.onClick(this.key)
		this.play()
	}.bind(this)

	boxEl.addEventListener('mousedown', this.clickHandler);
}

// Example usage of NoteBox.
//
// This will create a map from key strings (i.e. 'c') to NoteBox objects so that
// clicking the corresponding boxes on the page will play the NoteBox's audio.
// It will also demonstrate programmatically playing notes by calling play directly.
var notes = {};
var simonNotes = [];
var playedNotes = [];
var failed = false;

KEYS.forEach(function (key) {
	notes[key] = new NoteBox(key, handleClick);
});

// Disables all notes (NoteBox) in notes
function disableAllNotes() {
    KEYS.forEach(function (key) {
        notes[key].disable();
    });
}

// Enables all notes (NoteBox) in notes
function enableAllNotes() {
    KEYS.forEach(function (key) {
        notes[key].enable();
    });
}
/*
KEYS.concat(KEYS.slice().reverse()).forEach(function(key, i) {
	setTimeout(notes[key].play.bind(null, key), i * NOTE_DURATION);
});
*/


function startGame() {
    setTextById("startGame","Reset Game");
    initGame()
    nextSimon()
}

function setTextById(id, text) {
    document.getElementById(id).innerHTML = text;
}
// Initializes values of the game
function initGame() {
    failed = false;
    simonNotes = [];
    playedNotes = [];
}

// Makes simon play
function nextSimon() {
        setTextById("turn", "Simon's Turn");
        disableAllNotes();
        playedNotes = []; // reset played notes
        simonNotes.push(generateKey()); // add a new note to simon's notes
        playSimonNotes();
        setTimeout(enableAllNotes, simonNotes.length * NOTE_DURATION);
        setTimeout(function() {setTextById("turn", "Your Turn");}, simonNotes.length * NOTE_DURATION);
}

// returns a random key (String) from KEYS
function generateKey() {
    var i = Math.floor(Math.random() * 4);
    return KEYS[i];
}

// Plays all the keys (String) in simonNotes, by finding the corresponding note (NoteBox)
function playSimonNotes() {
    simonNotes.forEach(function (key, i) {
        setTimeout(notes[key].play.bind(null,key), i * NOTE_DURATION);
    })
}

// Adds a note (String) to playedNotes, checks if the player failed, and, if the player played enough notes, makes it simon's turn
function handleClick(key) {
    playedNotes.push(key); // Add a key (String) to the notes the player has played, and check if they failed the game
    if (!checkFail() && simonNotes.length == playedNotes.length) { // get the next simon if the player hasn't failed, and has played enough notes
        setTimeout(nextSimon , 2 * NOTE_DURATION); // delay by NOTE_DURATION so the first player note and first simon note don't overlap
    }
}

// Check if the player has failed, depending on the last note (String) they played. Returns true if they have failed, false otherwise
function checkFail() {
    if (playedNotes[playedNotes.length - 1] != notes[simonNotes[playedNotes.length - 1]].key) { // check if the last note (String) the player played is the same as simon's
        fail();
        disableAllNotes();
        return true;
    }
    return false;
}

// Shows the player that they're a failure
function fail() {
    setTextById("turn", "You Died");
    document.getElementById("youDiedSound").play(); // Play the death sound
    die();
    setInterval(undie, 8000)
}


// Shows the You Died, and blocks the screen
function die() {
    document.getElementById("screenBlocker").style.zIndex = 9; // block the screen
    let youDied = document.getElementById("youDied");
    youDied.classList.add("fadeIn"); // Make it fade in
    youDied.style.zIndex = "10"; // Make it appear in front of everything
}



// Undoes dying; removes the You Died and unblocks the screen
function undie() {
    document.getElementById("screenBlocker").style.zIndex = -1;
    let youDied = document.getElementById("youDied");
    youDied.classList.remove("fadeIn"); // reset it's fade in
    youDied.style.zIndex = -1; 
    setTextById("turn", "Reset Game ^")
}

//setTimeout(notes['c'].play.bind(null, 'c'), NOTE_DURATION);