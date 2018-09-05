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


var notes = {};
var playedNotes = [];
var lastClicked = 0;
var date = new Date();
var DELAY = 2500;

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

enableAllNotes();

// Handles the click, resetting time since last click, adding a note to the played notes, and trying to echo in 2.5 seconds
function handleClick(key) {
    lastClicked = date.getMilliseconds();
    playedNotes.push(key); // Add a key (String) to the notes the player has played // get the 
    setTimeout(tryEcho , DELAY); // Try to echo after 2500 milisseconds
}

// If enough time has passed since the last click, then echo, and reset playedNotes, and disables the notesboxes until the echo finishes
function tryEcho() {
    console.log("tried");
    console.log(date.getMilliseconds() - lastClicked);
    if (date.getMilliseconds() - lastClicked > DELAY) {
        console.log("success");
        disableAllNotes();
        playBackNotes()
        playedNotes = [];
        setInterval(enableAllNotes, playedNotes.length * NOTE_DURATION);
    }
}

// Plays back all the notes in playedNotes
function playBackNotes() {
    
    playedNotes.forEach(function (key, i) {

        setTimeout(notes[key].play.bind(null,key), i * NOTE_DURATION);
    })
}
