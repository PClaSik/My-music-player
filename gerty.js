
 const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const btnText = document.getElementById('btn-text');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const playlist = [
    { title: "1. intro (Template)", file: "Kid Cudi - Electrowavebaby.mp3" },
    { title: "2. Main vibe (Template)", file: "Kid Cudi feat Pharrell Williams, Travis Scott - At The Party (hitparad.fm).mp3" },
    { title: "3. Outro (Template)", file: "Kid_Cudi_Jaden_-_On_My_Own_65347943.mp3" },
    {file:"Kid_Cudi_-_Maui_Wowie_80059228.mp3"},
    {file:"Radiohead_-_Creep_74893500.mp3"},
    {file:"Kodak_Black_Travis_Scott_Offset_-_ZEZE_59805281.mp3"},
    {file:"Travis_Scott_-_3500_feat_Future_2_Chainz_80324989.mp3"},
    {file:"Travis_Scott_-_Apple_Pie_48277104.mp3"},
    {file:"Radiohead_-_No_Surprises_79477227.mp3"},
    {file:"Travis Scott Tame Impala Modern Jam Dracula Mas (online-audio-converter.com).mp3"},
];

let currentTrackIndex = 0;

// Функция для форматирования времени (секунды -> 0:00)
function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        audio.src = playlist[index].file;
    }
}

// Загружаем первую песню при старте
loadTrack(currentTrackIndex);

// Кнопка LISTEN (запуск плеера)
const listenBtn = document.querySelector('.btn');
if (listenBtn) {
    listenBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            btnText.innerText = "PAUSE";
            playBtn.style.borderColor = "#00ff00";
        }
    });
}

// Обработчики кликов на треки в плейлисте
document.querySelectorAll('.track-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index < playlist.length) {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            audio.play();
            btnText.innerText = "PAUSE";
            playBtn.style.borderColor = "#00ff00";
        }
    });
});

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        btnText.innerText = "PAUSE";
        playBtn.style.borderColor = "#00ff00";
    } else {
        audio.pause();
        btnText.innerText = "SEE YOU SPACE COWBOY...";
        playBtn.style.borderColor = "#fff";
    }
});

// Обновляем время вместе с полоской прогресса
audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    
    // Обновляем текст текущего времени
    if (currentTimeEl) currentTimeEl.innerText = formatTime(currentTime);
    
    // Обновляем общую длительность и прогресс
    if (duration && !isNaN(duration)) {
        if (durationEl) durationEl.innerText = formatTime(duration);
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});

// Кнопка ВПЕРЕД
document.getElementById('next-btn').addEventListener('click', () => {
    currentTrackIndex++;
    if (currentTrackIndex >= playlist.length) {
        currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    audio.play();
    btnText.innerText = "PAUSE";
});

// Кнопка НАЗАД
document.getElementById('prev-btn').addEventListener('click', () => {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = playlist.length - 1;
    }
    loadTrack(currentTrackIndex);
    audio.play();
    btnText.innerText = "PAUSE";
});

// Автопереключение на следующий трек
audio.addEventListener('ended', () => {
    document.getElementById('next-btn').click();
});

// Клик по прогресс-бару для перемотки
progressContainer.addEventListener('click', function(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

// Drag-to-seek functionality
let isMouseDown = false;

progressContainer.onmousedown = (e) => {
    isMouseDown = true;
    rewind(e);
};

window.onmouseup = () => {
    if (isMouseDown) {
        isMouseDown = false;
    }
};

window.onmousemove = (e) => {
    if (isMouseDown) {
        const rect = progressContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let width = rect.width;
        
        if (x < 0) x = 0;
        if (x > width) x = width;

        const progressPercent = (x / width) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
};

function rewind(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Media Session API для управления с блокировки экрана
if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: 'In My Mind',
        artist: 'PClaSik',
        album: 'Pharrell Tribute',
        artwork: [
            { src: 'https://pclasik.github.io/My-music-player/cover.jpg', sizes: '512x512', type: 'image/jpg' }
        ]
    });

    navigator.mediaSession.setActionHandler('play', () => { audio.play(); });
    navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); });
}

