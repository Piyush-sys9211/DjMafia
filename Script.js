/* ========================= */
/* DJ MAFIA - FULL JS */
/* REAL WORKING BASS */
/* ========================= */

const API =
"https://manish-jiosaavn-api.manishjai9527.workers.dev/api/search/songs?query=";

const results =
document.getElementById("results");

/* ========================= */
/* AUDIO CONTEXT */
/* ========================= */

const audioContext =
new (
window.AudioContext ||
window.webkitAudioContext
)();

/* ========================= */
/* AUDIO ELEMENTS */
/* ========================= */

const leftAudio =
new Audio();

const rightAudio =
new Audio();

leftAudio.crossOrigin =
"anonymous";

rightAudio.crossOrigin =
"anonymous";

/* ========================= */
/* LEFT AUDIO CHAIN */
/* ========================= */

const leftSource =
audioContext.createMediaElementSource(
leftAudio
);

/* BASS */

const leftBassFilter =
audioContext.createBiquadFilter();

leftBassFilter.type =
"lowshelf";

leftBassFilter.frequency.value =
200;

leftBassFilter.gain.value =
0;

/* TREBLE */

const leftTrebleFilter =
audioContext.createBiquadFilter();

leftTrebleFilter.type =
"highshelf";

leftTrebleFilter.frequency.value =
3000;

leftTrebleFilter.gain.value =
0;

/* CONNECT */

leftSource.connect(
leftBassFilter
);

leftBassFilter.connect(
leftTrebleFilter
);

leftTrebleFilter.connect(
audioContext.destination
);

/* ========================= */
/* RIGHT AUDIO CHAIN */
/* ========================= */

const rightSource =
audioContext.createMediaElementSource(
rightAudio
);

/* BASS */

const rightBassFilter =
audioContext.createBiquadFilter();

rightBassFilter.type =
"lowshelf";

rightBassFilter.frequency.value =
200;

rightBassFilter.gain.value =
0;

/* TREBLE */

const rightTrebleFilter =
audioContext.createBiquadFilter();

rightTrebleFilter.type =
"highshelf";

rightTrebleFilter.frequency.value =
3000;

rightTrebleFilter.gain.value =
0;

/* CONNECT */

rightSource.connect(
rightBassFilter
);

rightBassFilter.connect(
rightTrebleFilter
);

rightTrebleFilter.connect(
audioContext.destination
);

/* ========================= */
/* SONG STORAGE */
/* ========================= */

let songs = [];

/* ========================= */
/* SEARCH SONGS */
/* ========================= */

async function searchSongs(){

const query =
document
.getElementById(
"searchInput"
)
.value;

if(!query) return;

results.innerHTML =
"Loading Songs...";

const res =
await fetch(
API + query
);

const data =
await res.json();

results.innerHTML = "";

songs = [];

data.data.results.forEach(
(song,index)=>{

const image =
song.image?.[2]?.url || "";

const url =
song.downloadUrl?.[4]?.url ||
song.downloadUrl?.[3]?.url ||
song.downloadUrl?.[2]?.url;

songs.push({

name:
song.name,

artist:
song.primaryArtists,

image:
image,

url:
url

});

const card =
document.createElement(
"div"
);

card.className =
"song-card";

card.innerHTML = `

<img src="${image}">

<h3>${song.name}</h3>

<p>${song.primaryArtists}</p>

<div class="card-buttons">

<button onclick="loadLeft(${index})">
LEFT
</button>

<button onclick="loadRight(${index})">
RIGHT
</button>

</div>

`;

results.appendChild(
card
);

});

}

/* ========================= */
/* LOAD SONGS */
/* ========================= */

function loadLeft(index){

const song =
songs[index];

leftAudio.src =
song.url;

document
.getElementById(
"leftCover"
).src =
song.image;

document
.getElementById(
"leftSong"
).innerText =
song.name;

}

function loadRight(index){

const song =
songs[index];

rightAudio.src =
song.url;

document
.getElementById(
"rightCover"
).src =
song.image;

document
.getElementById(
"rightSong"
).innerText =
song.name;

}

/* ========================= */
/* PLAY / PAUSE */
/* ========================= */

function playLeft(){

audioContext.resume();

leftAudio.play();

}

function pauseLeft(){

leftAudio.pause();

}

function playRight(){

audioContext.resume();

rightAudio.play();

}

function pauseRight(){

rightAudio.pause();

}

/* ========================= */
/* SEEK BARS */
/* ========================= */

leftAudio.addEventListener(
"timeupdate",
()=>{

leftSeek.value =

(leftAudio.currentTime /
leftAudio.duration)
*100 || 0;

}
);

rightAudio.addEventListener(
"timeupdate",
()=>{

rightSeek.value =

(rightAudio.currentTime /
rightAudio.duration)
*100 || 0;

}
);

/* SEEK CONTROL */

leftSeek.oninput = ()=>{

leftAudio.currentTime =

(leftSeek.value/100)
*
leftAudio.duration;

};

rightSeek.oninput = ()=>{

rightAudio.currentTime =

(rightSeek.value/100)
*
rightAudio.duration;

};

/* ========================= */
/* REAL BASS */
/* ========================= */

leftBass.oninput = e=>{

const value =
e.target.value;

leftBassFilter.gain.value =
value;

e.target.style.transform =
`rotate(${value*4}deg)`;

};

rightBass.oninput = e=>{

const value =
e.target.value;

rightBassFilter.gain.value =
value;

e.target.style.transform =
`rotate(${value*4}deg)`;

};

/* ========================= */
/* TREBLE */
/* ========================= */

leftTreble.oninput = e=>{

const value =
e.target.value;

leftTrebleFilter.gain.value =
value;

};

rightTreble.oninput = e=>{

const value =
e.target.value;

rightTrebleFilter.gain.value =
value;

};

/* ========================= */
/* SPEED */
/* ========================= */

leftSpeed.oninput = e=>{

leftAudio.playbackRate =
e.target.value;

};

rightSpeed.oninput = e=>{

rightAudio.playbackRate =
e.target.value;

};

/* ========================= */
/* VOLUME */
/* ========================= */

leftVolume.oninput = e=>{

leftAudio.volume =
e.target.value;

};

rightVolume.oninput = e=>{

rightAudio.volume =
e.target.value;

};

/* ========================= */
/* CROSS FADER */
/* ========================= */

crossfader.oninput = e=>{

const value =
e.target.value;

leftAudio.volume =
1 - value/100;

rightAudio.volume =
value/100;

};

/* ========================= */
/* FX BUTTONS */
/* ========================= */

function ultraBass(){

leftBassFilter.gain.value =
20;

rightBassFilter.gain.value =
20;

}

function nightcoreMode(){

leftAudio.playbackRate =
1.3;

rightAudio.playbackRate =
1.3;

}

function slowReverb(){

leftAudio.playbackRate =
0.8;

rightAudio.playbackRate =
0.8;

}

function partyMode(){

document.body.style.filter =
"hue-rotate(180deg)";

setTimeout(()=>{

document.body.style.filter =
"hue-rotate(0deg)";

},4000);

}

/* ========================= */
/* VISUALIZER */
/* ========================= */

const canvas =
document.getElementById(
"visualizer"
);

const c =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
150;

function animate(){

requestAnimationFrame(
animate
);

c.clearRect(
0,
0,
canvas.width,
canvas.height
);

for(let i=0;i<80;i++){

const h =
Math.random()*120;

const gradient =
c.createLinearGradient(
0,
0,
0,
canvas.height
);

gradient.addColorStop(
0,
"#00d9ff"
);

gradient.addColorStop(
1,
"#8a2cff"
);

c.fillStyle =
gradient;

c.fillRect(
i*20,
canvas.height-h,
12,
h
);

}

}

animate();