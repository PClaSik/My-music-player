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
    { title: "Maui Wowie", file: "Kid_Cudi_-_Maui_Wowie_80059228.mp3" },
    { title: "Creep", file: "Radiohead_-_Creep_74893500.mp3" },
    { title: "ZEZE", file: "Kodak_Black_Travis_Scott_Offset_-_ZEZE_59805281.mp3" },
    { title: "3500", file: "Travis_Scott_-_3500_feat_Future_2_Chainz_80324989.mp3" },
    { title: "Apple Pie", file: "Travis_Scott_-_Apple_Pie_48277104.mp3" },
    { title: "No Surprises", file: "Radiohead_-_No_Surprises_79477227.mp3" },
    { title: "Modern Jam", file: "Travis Scott Tame Impala Modern Jam Dracula Mas.m4a" } // Твой m4a файл
];

let currentTrackIndex = 0;

// Функция для форматирования времени
function formatTime(time) {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// 1. УНИВЕРСАЛЬНАЯ ЗАГРУЗКА ТРЕКА
function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        const track = playlist[index];
        // Убедись, что путь к папке правильный (например, songs/)
        audio.src = `songs/${track.file}`; 
        
        // Обновляем метаданные в шторке iPhone
        updateMediaSession(track);
    }
}

// 2. ОБНОВЛЕНИЕ ШТОРКИ (Media Session)
function updateMediaSession(track) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title || track.file,
            artist: 'PClaSik',
            album: 'Pharrell Tribute',
            artwork: [
                { src: 'https://pclasik.github.io/My-music-player/cover.jpg', sizes: '512x512', type: 'image/jpg' }
            ]
        });

        // Добавляем обработчики кнопок в шторке
        navigator.mediaSession.setActionHandler('play', () => audio.play());
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
        navigator.mediaSession.setActionHandler('nexttrack', () => document.getElementById('next-btn').click());
        navigator.mediaSession.setActionHandler('previoustrack', () => document.getElementById('prev-btn').click());
    }
}

// 3. ФУНКЦИЯ ДЛЯ ПЕРЕМОТКИ В ШТОРКЕ (Таймлайн)
function updatePositionState() {
    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
        navigator.mediaSession.setPositionState({
            duration: audio.duration || 0,
            playbackRate: audio.playbackRate,
            position: audio.currentTime || 0
        });
    }
}

// Загружаем первый трек
loadTrack(currentTrackIndex);

// УПРАВЛЕНИЕ PLAY/PAUSE
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

// ОБНОВЛЕНИЕ ПРОГРЕССА И ВРЕМЕНИ
audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    currentTimeEl.innerText = formatTime(currentTime);
    
    if (duration) {
        durationEl.innerText = formatTime(duration);
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Синхронизируем таймер в шторке iPhone
        updatePositionState();
    }
});

// КНОПКА ВПЕРЕД
document.getElementById('next-btn').addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audio.play();
    btnText.innerText = "PAUSE";
});

// КНОПКА НАЗАД
document.getElementById('prev-btn').addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    audio.play();
    btnText.innerText = "PAUSE";
});

// ПЕРЕМОТКА ПО КЛИКУ
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

// АВТОМАТИЧЕСКИЙ ПЕРЕХОД К СЛЕДУЮЩЕМУ ТРЕКУ
audio.addEventListener('ended', () => {
    document.getElementById('next-btn').click();
});