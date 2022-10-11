const songs = [
  "Angel's Mouth",
  "The Gods Sprinkled Daisies Onto the Earth",
  "Tolerance Pavilion",
  "Warm Blood", 
];

const artists = [
  "S. Wurm",
  "Layia",
  "Levitating Mausoleum",
  "Rue Morgan",
];

let songIndex = 0;

//Set up audio elements
var soundA = document.createElement("audio");
var soundB = document.createElement("audio");

loadSong(songs[songIndex]);

function loadSong(song) {
  
  title.innerText = song;
  artist.innerText = artists[songIndex];
  soundA.src = `./assets/${song}.mp3`;
  soundA.preload = "auto";
  soundA.setAttribute("hidden", "true");
  soundA.setAttribute("onplaying", "stepA()");
  document.body.append(soundA);

  soundB.src = `./assets/${song}b.mp3`;
  soundB.preload = "auto";
  soundB.setAttribute("hidden", "true");
  soundB.setAttribute("onplaying", "stepB()");
  document.body.append(soundB);
};

//Get button elements
const aButton = document.getElementById("a__button");
const bButton = document.getElementById("b__button");
const playButton = document.getElementById("play__button");
const nextButton = document.getElementById("next__button");
const prevButton = document.getElementById("prev__button");
const progressBar = document.getElementById("progress__bar");
const progressFill = document.getElementById("progress__fill");

const playIcon = '<i class="fa-solid fa-play"></i>';
const pauseIcon = '<i class="fa-solid fa-pause"></i>';

//Check for mobile to enable audio playback without waiting for download status.
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  playButton.disabled = false;
}

//Default loading state for each sound
var soundAReady = false;
var soundBReady = false;

//When audio can play through (loaded), run the function to enable buttons
//The canplaythrough event will fire every time the audio switches, so the !soundA/BReady
//prevents additional checks
soundA.oncanplaythrough = function () {
  if (!soundAReady) {
    soundAReady = true;
    audioIsReady();
  }
};
soundB.oncanplaythrough = function () {
  if (!soundBReady) {
    soundBReady = true;
    audioIsReady();
  }
};

// Check if both A & B are ready and enable the correct buttons
function audioIsReady() {
  if (soundAReady && soundBReady) {
    console.log("...audio loaded!");
    aButton.disabled = false;
    playButton.disabled = false;
  } else {
    console.log("Audio loading...");
  }
}

const progress = document.getElementById("progress");
// Listen for click on entire progress bar div (to allow skipping ahead)
progress.addEventListener("click", function (event) {
  // Get X coordinate of click in div
  var rect = this.getBoundingClientRect();
  // Convert click position to percentage value
  var percentage = (event.clientX - rect.left) / this.offsetWidth;
  // Seek to the percentage converted to seconds
  soundA.currentTime = percentage * soundA.duration;
  soundB.currentTime = percentage * soundB.duration;
});

//Frame animations for progress bar fill - converts to CSS percentage
function stepA() {
  progressFill.style.width =
    ((soundA.currentTime / soundA.duration) * 100 || 0) + "%";
  requestAnimationFrame(stepA);
}
function stepB() {
  progressFill.style.width =
    ((soundB.currentTime / soundB.duration) * 100 || 0) + "%";
  requestAnimationFrame(stepB);
}

//Play correct audio and toggle A/B, Play/Pause
const playPause = () => {
  if (soundA.paused & soundB.paused) {
    let soundATime = soundA.currentTime;
    let soundBTime = soundB.currentTime;
    if (soundATime >= soundBTime) {
      soundA.play();
      bButton.disabled = false;
      aButton.disabled = true;
      playButton.innerHTML = pauseIcon;
    } else {
      soundB.play();
      bButton.disabled = true;
      aButton.disabled = false;
      playButton.innerHTML = pauseIcon;
    }
  } else {
    playButton.innerHTML = playIcon;
    soundA.pause();
    soundB.pause();
  }
};

const playSoundA = () => {
  playButton.innerHTML = pauseIcon;
  aButton.disabled = true;
  bButton.disabled = false;
  if (soundB.currentTime > 0) {
    soundA.currentTime = soundB.currentTime;
    soundA.play();
    soundB.pause();
  } else {
    soundA.play();
    soundB.pause();
  }
};

const playSoundB = () => {
  playButton.innerHTML = pauseIcon;
  bButton.disabled = true;
  aButton.disabled = false;

  if (soundA.currentTime > 0) {
    soundB.currentTime = soundA.currentTime;
    soundB.play();
    soundA.pause();
  } else {
    soundB.play();
  }
};

const nextSounds = () => {
  playButton.innerHTML = playIcon;
  aButton.disabled = false;
  bButton.disabled = true;
  playButton.disabled = false;
  soundA.pause();
  soundA.currentTime = 0;
  soundB.pause();
  soundB.currentTime = 0;

  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
};

const prevSounds = () => {
  playButton.innerHTML = playIcon;
  aButton.disabled = false;
  bButton.disabled = true;
  playButton.disabled = false;
  soundA.pause();
  soundA.currentTime = 0;
  soundB.pause();
  soundB.currentTime = 0;

  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
};

