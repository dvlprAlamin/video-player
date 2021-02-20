const player = document.getElementById('player');
const video = document.getElementById('player-viewer');
const progress = document.getElementById('progress');
const progressField = document.getElementById('progress-field');
const videoControls = document.getElementById('video-controls');
const playerBtn = document.getElementById('player-btn');
const fullscreenBtn = document.getElementById('fullScreen');
const theaterMode = document.getElementById('theater-mode');
const currentMinute = document.querySelector('[current-minute]');
const currentSecond = document.querySelector('[current-second]');
const totalMinute = document.querySelector('[total-minute]');
const totalSecond = document.querySelector('[total-second]');
const skipButtons = document.querySelectorAll('[skip]');
const range = document.querySelectorAll("[type='range']");


const scrub = (e) => {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    console.log(scrubTime);
}
const durationUpdate = () => {
    currentMinute.innerText = Math.floor(video.currentTime / 60);
    totalMinute.innerText = Math.floor(video.duration / 60);
    currentSecond.innerText = Math.round(video.currentTime % 60);
    totalSecond.innerText = Math.round(video.duration % 60);
}

// toggle play button
const togglePlay = () => video.paused ? video.play() : video.pause();

const updateButton = () => playerBtn.textContent = video.paused ? '▶' : '❚❚';

const skip = (e) => {
    const skipTime = e.target.getAttribute('skip');
    video.currentTime += +skipTime;
}

const handleRange = (e) => video[e.target.name] = e.target.value;

const updateProgress = () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressField.style.flexBasis = `${percent}%`
}

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

fullscreenBtn.addEventListener('click', () => {
    player.requestFullscreen() !== document.exitFullscreen();
    if (window.innerHeight !== screen.height) {
        theaterMode.style.display = 'none';
        fullscreenBtn.innerHTML = `<img title="Exit full screen (f)" src="./icon/collapse.png">`
    }
    else {
        theaterMode.style.display = 'inline-block';
        fullscreenBtn.innerHTML = `<img title="Full screen (f)" src="./icon/fullscreen.png">`
    }
});
theaterMode.addEventListener('click', () => {
    player.classList.toggle('theater-player');
    document.querySelector('#theater-mode img').classList.toggle('min-theater');
});


//  KeyboardEvent handler
const volume = document.getElementById('volume');
window.addEventListener("keydown", (e) => {
    e.key === " " && video.click();
    e.key === "k" && video.click();
    e.key === "ArrowLeft" && (video.currentTime -= 5);
    e.key === "ArrowRight" && (video.currentTime += 5);
    e.key === "ArrowUp" && (video.volume += .1) && (volume.value += .1);
    e.key === "ArrowDown" && (video.volume -= .1) && (volume.value -= .1);
    e.key === "f" && fullscreenBtn.click();
    e.key === "t" && theaterMode.click();
    console.log(volume.value);
});