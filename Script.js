/* ========================= */
/* UPDATED script.js */
/* HAR SONG KE LIYE FULL CONTROLS */
/* ========================= */

const API =
"https://manish-jiosaavn-api.manishjai9527.workers.dev/api/search/songs?query=";

const results =
document.getElementById("results");

/* AUDIO PLAYERS */

const leftAudio = new Audio();
const rightAudio = new Audio();

leftAudio.crossOrigin = "anonymous";
rightAudio.crossOrigin = "anonymous";

/* AUDIO CONTEXT */

const ctx =
new(window.AudioContext ||
window.webkitAudioContext)();

/* LEFT DECK */

const leftSource =
ctx.createMediaElementSource(leftAudio);

const leftBass =
ctx.createBiquadFilter();

leftBass.type = "lowshelf";

leftBass.frequency.value = 200;

const leftTreble =
ctx.createBiquadFilter();

leftTreble.type = "highshelf";

leftTreble.frequency.value = 3000;

const leftGain =
ctx.createGain();

leftGain.gain.value = 1;

/* RIGHT DECK */

const rightSource =
ctx.createMediaElementSource(rightAudio);

const rightBass =
ctx.createBiquadFilter();

rightBass.type = "lowshelf";

rightBass.frequency.value = 200;

const rightTreble =
ctx.createBiquadFilter();

rightTreble.type = "highshelf";

rightTreble.frequency.value = 3000;

const rightGain =
ctx.createGain();

rightGain.gain.value = 1;

/* ANALYSER */

const analyser =
ctx.createAnalyser();

/* CONNECT LEFT */

leftSource.connect(leftBass);

leftBass.connect(leftTreble);

leftTreble.connect(leftGain);

leftGain.connect(analyser);

/* CONNECT RIGHT */

rightSource.connect(rightBass);

rightBass.connect(rightTreble);

rightTreble.connect(rightGain);

rightGain.connect(analyser);

analyser.connect(ctx.destination);

/* SONG STORAGE */

let songs = [];

/* SEARCH SONGS */

async function searchSongs(){

const query =
document.getElementById("searchInput").value;

if(!query) return;

results.innerHTML =
"Loading Songs...";

const res =
await fetch(API + query);

const data =
await res.json();

results.innerHTML = "";

songs = [];

data.data.results.forEach((song,index)=>{

const image =
song.image?.[2]?.url || "";

const url =
song.downloadUrl?.[4]?.url ||
song.downloadUrl?.[3]?.url ||
song.downloadUrl?.[2]?.url;

songs.push({
name:song.name,
artist:song.primaryArtists,
image:image,
url:url
});

const card =
document.createElement("div");

card.className = "song-card";

card.innerHTML = `
<img src="${image}">
<h3>${song.name}</h3>
<p>${song.primaryArtists}</p>

<div class="card-buttons">

<button onclick="loadLeft(${index})">
LEFT DECK
</button>

<button onclick="loadRight(${index})">
RIGHT DECK
</button>

</div>
`;

results.appendChild(card);

});

}

/* LOAD LEFT */

function loadLeft(index){

ctx.resume();

const song =
songs[index];

leftAudio.src = song.url;

document.getElementById("leftCover").src =
song.image;

document.getElementById("leftSong").innerText =
song.name;

}

/* LOAD RIGHT */

function loadRight(index){

ctx.resume();

const song =
songs[index];

rightAudio.src = song.url;

document.getElementById("rightCover").src =
song.image;

document.getElementById("rightSong").innerText =
song.name;

}

/* PLAY PAUSE */

function playLeft(){

ctx.resume();

leftAudio.play();

}

function pauseLeft(){

leftAudio.pause();

}

function playRight(){

ctx.resume();

rightAudio.play();

}

function pauseRight(){

rightAudio.pause();

}

/* ========================= */
/* LEFT DECK CONTROLS */
/* ========================= */

document.getElementById("leftBass")
.oninput = e=>{

leftBass.gain.value =
e.target.value;

};

document.getElementById("leftTreble")
.oninput = e=>{

leftTreble.gain.value =
e.target.value;

};

document.getElementById("leftSpeed")
.oninput = e=>{

leftAudio.playbackRate =
e.target.value;

};

document.getElementById("leftVolume")
.oninput = e=>{

leftGain.gain.value =
e.target.value;

};

/* ========================= */
/* RIGHT DECK CONTROLS */
/* ========================= */

document.getElementById("rightBass")
.oninput = e=>{

rightBass.gain.value =
e.target.value;

};

document.getElementById("rightTreble")
.oninput = e=>{

rightTreble.gain.value =
e.target.value;

};

document.getElementById("rightSpeed")
.oninput = e=>{

rightAudio.playbackRate =
e.target.value;

};

document.getElementById("rightVolume")
.oninput = e=>{

rightGain.gain.value =
e.target.value;

};

/* ========================= */
/* CROSS FADER */
/* ========================= */

document.getElementById("crossfader")
.oninput = e=>{

const value =
e.target.value;

leftGain.gain.value =
1 - value / 100;

rightGain.gain.value =
value / 100;

};

/* ========================= */
/* EFFECTS */
/* ========================= */

function ultraBass(){

leftBass.gain.value = 25;

rightBass.gain.value = 25;

}

function nightcoreMode(){

leftAudio.playbackRate = 1.3;

rightAudio.playbackRate = 1.3;

}

function slowReverb(){

leftAudio.playbackRate = 0.8;

rightAudio.playbackRate = 0.8;

}

function karaokeMode(){

leftTreble.gain.value = -10;

rightTreble.gain.value = -10;

}

/* ========================= */
/* VISUALIZER */
/* ========================= */

const canvas =
document.getElementById("visualizer");

const c =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height = 140;

analyser.fftSize = 256;

const bufferLength =
analyser.frequencyBinCount;

const dataArray =
new Uint8Array(bufferLength);

function animate(){

requestAnimationFrame(animate);

analyser.getByteFrequencyData(dataArray);

c.clearRect(
0,
0,
canvas.width,
canvas.height
);

let x = 0;

for(let i=0;i<bufferLength;i++){

const h =
dataArray[i];

const gradient =
c.createLinearGradient(
0,
0,
0,
canvas.height
);

gradient.addColorStop(0,"#00f0ff");

gradient.addColorStop(1,"#ff003c");

c.fillStyle = gradient;

c.fillRect(
x,
canvas.height-h/2,
6,
h/2
);

x += 8;

}

}

animate();