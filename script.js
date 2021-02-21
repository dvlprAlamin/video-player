const player = document.getElementById('player');
const video = document.getElementById('player-viewer');
const loader = document.getElementById('loader');
const progress = document.getElementById('progress');
const range = document.querySelectorAll("[type='range']");
const progressField = document.getElementById('progress-field');
const videoControls = document.getElementById('video-controls');
const playerBtn = document.getElementById('player-btn');
const fullscreenBtn = document.getElementById('fullScreen');
const theaterMode = document.getElementById('theater-mode');
const theaterImg = document.querySelector('#theater-mode img');
const miniPlayerBtn = document.getElementById('mini-player');
const currentMinute = document.querySelector('[current-minute]');
const currentSecond = document.querySelector('[current-second]');
const totalMinute = document.querySelector('[total-minute]');
const totalSecond = document.querySelector('[total-second]');
const skipButtons = document.querySelectorAll('[skip]');



// scrub function
const scrub = (e) => {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    console.log(scrubTime);
}

// update duration
const durationUpdate = () => {
    currentMinute.innerText = Math.floor(video.currentTime / 60);
    totalMinute.innerText = Math.floor(video.duration / 60);
    currentSecond.innerText = Math.round(video.currentTime % 60);
    totalSecond.innerText = Math.round(video.duration % 60);
}

// toggle play button
const togglePlay = () => video.paused ? video.play() : video.pause();
// update play/pause button
const updateButton = () => playerBtn.textContent = video.paused ? '▶' : '❚❚';
// skip event handler
const skip = (e) => {
    const skipTime = e.target.getAttribute('skip');
    video.currentTime += +skipTime;
}
// volume and speed handler
const handleRange = (e) => video[e.target.name] = (e.target.value / 100);
// progress updater
const updateProgress = () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressField.style.flexBasis = `${percent}%`
}


// Player Handler
const fullScreenHandler = () => {
    player.requestFullscreen() !== document.exitFullscreen();
    if (window.innerHeight !== screen.height) {
        theaterMode.style.display = 'none';
        fullscreenBtn.innerHTML = `<img title="Exit full screen (f)" src="./icon/collapse.png">`
    }
    else {
        theaterMode.style.display = 'inline-block';
        fullscreenBtn.innerHTML = `<img title="Full screen (f)" src="./icon/fullscreen.png">`
    }
}
const theaterModeHandler = () => {
    player.classList.toggle('theater-player');
    theaterImg.classList.toggle('min-theater');
}
const miniPlayerHandler = () => video.requestPictureInPicture() !== document.exitPictureInPicture();


// Event handler
playerBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', () => {
    updateProgress();
    durationUpdate();
});

skipButtons.forEach(button => {
    button.addEventListener('click', skip)
})
range.forEach(item => {
    item.addEventListener('change', handleRange)
})
range.forEach(item => {
    item.addEventListener('mousemove', handleRange)
})

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullscreenBtn.addEventListener('click', fullScreenHandler);

theaterMode.addEventListener('click', theaterModeHandler);

miniPlayerBtn.addEventListener('click', miniPlayerHandler);




//  KeyboardEvent handler
const volume = document.getElementById('volume');
const speed = document.getElementById('speed');
window.addEventListener("keydown", (e) => {
    e.key === " " && video.click();
    e.key === "k" && video.click();
    e.key === "ArrowLeft" && (video.currentTime -= 5);
    e.key === "ArrowRight" && (video.currentTime += 5);
    if (e.key === "ArrowUp" && video.volume !== 1) {
        video.volume = (Math.round(video.volume * 100 + 10)) / 100;
        volume.value = +volume.value + 10;
    }
    if (e.key === "ArrowDown" && video.volume !== 0) {
        video.volume = (Math.round(video.volume * 100 - 10)) / 100;
        volume.value = +volume.value - 10;
    }
    if (e.key === "]" && video.playbackRate !== 2) {
        video.playbackRate = (Math.round(video.playbackRate * 100 + 25)) / 100;
        speed.value = +speed.value + 25;
    }
    if (e.key === "[" && video.playbackRate !== .5) {
        video.playbackRate = (Math.round(video.playbackRate * 100 - 25)) / 100;
        speed.value = +speed.value - 25;
    }
    e.key === "f" && fullscreenBtn.click();
    e.key === "t" && theaterMode.click();
    e.key === "i" && miniPlayerBtn.click();
});

// disable right click for player
player.addEventListener('contextmenu', event => event.preventDefault());


// loader handler
video.onwaiting = () => showPlaceholder()
video.onplaying = () => hidePlaceholder();

const showPlaceholder = () => loader.style.display = "block";
const hidePlaceholder = () => loader.style.display = "none"