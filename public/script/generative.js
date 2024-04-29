document.body.style.margin   = 0
document.body.style.overflow = `hidden`

// grabbing 
const cnv_2 = document.getElementById (`rapid_notes`)
cnv_2.width = innerWidth
cnv_2.height = innerHeight

const audio_context = new AudioContext ()
audio_context.suspend ()
console.log (audio_context.state)

// define an async click handler function 
async function init_audio () {

    // wait for audio context to resume
    await audio_context.resume ()

}

// define a function that plays a note
function play_note (note, length) {

    // if the audio context is not running, resume it
    if (audio_context.state != 'running') init_audio ()

    // create an oscillator
    const osc = audio_context.createOscillator ()

    // make it a triangle wave this time
    osc.type            = 'triangle'

    // set the value using the equation 
    // for midi note to Hz
    osc.frequency.value = 440 * 2 ** ((note - 69) / 12)

    // create an amp node
    const amp = audio_context.createGain ()

    // connect the oscillator 
    // to the amp
    // to the audio out
    osc.connect (amp).connect (audio_context.destination)

    // the .currentTime property of the audio context
    // contains a time value in seconds
    const now = audio_context.currentTime

    // make a gain envelope
    // start at 0
    amp.gain.setValueAtTime (0, now)

    // take 0.02 seconds to go to 0.4, linearly
    amp.gain.linearRampToValueAtTime (0.4, now + 0.02)

    // this method does not like going to all the way to 0
    // so take length seconds to go to 0.0001, exponentially
    amp.gain.exponentialRampToValueAtTime (0.0001, now + length)

    // start the oscillator now
    osc.start (now)

    // stop the oscillator 1 second from now
    osc.stop  (now + length)
}

// making an array of midi notes
const notes = [ 62, 66, 69, 73, 74, 73, 69, 66 ]

// declaring a mutable iterator
let i = 0

// declaring a mutable state value
let running = false

// declaring a mutable variable for 
// the period of time between notes
let period = 200

// declaring a mutable variable for
// the length of the note
let len = 0

// declaring a function that plays the next note
function next_note () {

    // use the iterator to select a note from 
    // the notes array and pass it to the 
    // play_note function along with the 
    // len variable to specify the length of the note
    play_note (notes[i], len)

    // iterate the iterator
    i++

    // if i gets too big
    // cycle back to 0
    i %= notes.length
}

// this is a recursive function
function note_player () {

    // play the next note
    next_note ()

    // if running is true
    // it uses setTimeout to call itself 
    // after period milliseconds
    if (running) setTimeout (note_player, period)
}


const cnv = document.getElementById (`canvas1`)
cnv.width = innerWidth
cnv.height = innerHeight
const ctx = cnv.getContext (`2d`)

// Create a class for the root 
class Root {
    constructor (x,y){
        this.x = x;
        this.y = y;
        this.ctx = 

        this.speedX = 2;
        this.speedY = 2;

        this.size = 5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.size +=0.1;

        if (this.size < 10){
            ctx.fillStyle = 'black';
            ctx.fillRect (this.x, this.y, this.size, this.size);

            requestAnimationFrame (this.update.bind(this))
        }
    }
}

// this function handles the mouse event
// when the cursor enters the canvas
window.addEventListener ("mousedown", function (e) {


    // set running to true
    running = true

    // initiate the recurseive note_player function
    note_player ()
})

window.addEventListener ("mousemove", function (e){
    // as the cursor goes from left to right
    // len gos from 0 to 5
    len = 5 * e.offsetX / cnv_2.width

    // as the cursor goes from bottom to top
    // period goes from 420 to 20 (milliseconds)
    period = 20 + ((e.offsetY / cnv_2.height) ** 2) * 400

    const root = new Root (e.x, e.y);
    root.update ();
})

// this function handles the mouse event
// when the cursor leaves the canvas
window.addEventListener ("mouseup", function (e){

    // set running to false
    running = false
})
