const currentTrackName = document.getElementById('current-track-name');
 const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const btnText = document.getElementById('btn-text');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const playlist = [
    { title: "Kid Cudi - Electrowavebaby", file: "Kid Cudi - Electrowavebaby.mp3" },
    { title: "Kid Cudi ft. Travis Scott - At The Party", file: "Kid Cudi feat Pharrell Williams, Travis Scott - At The Party (hitparad.fm).mp3" },
    { title: "Kid Cudi & Jaden - On My Own", file: "Kid_Cudi_Jaden_-_On_My_Own_65347943.mp3" },
    { title: "Kid Cudi - Maui Wowie", file: "Kid_Cudi_-_Maui_Wowie_80059228.mp3" },
    { title: "Radiohead - Creep", file: "Radiohead_-_Creep_74893500.mp3" },
    { title: "Kodak Black ft. Travis Scott - ZEZE", file: "Kodak_Black_Travis_Scott_Offset_-_ZEZE_59805281.mp3" },
    { title: "Travis Scott - 3500", file: "Travis_Scott_-_3500_feat_Future_2_Chainz_80324989.mp3" },
    { title: "Travis Scott - Apple Pie", file: "Travis_Scott_-_Apple_Pie_48277104.mp3" },
    { title: "Radiohead - No Surprises", file: "Radiohead_-_No_Surprises_79477227.mp3" },
    { title: "Travis Scott - Modern Jam (Remix)", file: "Travis Scott Tame Impala Modern Jam Dracula Mas (online-audio-converter.com).mp3" },
];

let currentTrackIndex = 0;

function populateTracklist() {
  const tracklist = document.querySelector('.tracklist');
  if (tracklist) {
    tracklist.innerHTML = '<h2 id="current-track-name">Select a track</h2>';
    playlist.forEach((track, index) => {
      const trackItem = document.createElement('div');
      trackItem.className = 'track-item';
      trackItem.textContent = `${index + 1}. ${track.title}`;
      trackItem.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audio.play();
        btnText.textContent = "PAUSE";
        playBtn.style.borderColor = "#00ff00";
      });
      tracklist.appendChild(trackItem);
    });
  }
}


// Функция для форматирования времени (секунды -> 0:00)
function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        audio.src = playlist[index].file;
        const trackTitleDisplay = document.getElementById('current-track-name');
        if (trackTitleDisplay) {
            trackTitleDisplay.innerText = playlist[index].title;
        }
        // Проверяем, существует ли функция обновления, прежде чем её вызвать
        if (typeof updateMetadata === "function") {
            updateMetadata();
        }
    }
}

function updateMetadata() {
    if ('mediaSession' in navigator) {
        const track = playlist[currentTrackIndex];
        // Проверка: если в массиве нет title, берем file
        const trackTitle = track.title ? track.title : track.file;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: trackTitle,
            artist: 'PClaSik',
            album: 'My Playlist',
            artwork: [
                { src: 'cover.jpg', sizes: '512x512', type: 'image/jpg' }
            ]
        });
    }
}

// Загружаем первую песню при старте
loadTrack(currentTrackIndex);
populateTracklist();







playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        btnText.textContent = "PAUSE";
        playBtn.style.borderColor = "#00ff00";
    } else {
        audio.pause();
        btnText.textContent = "PAUSE";
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
if ('mediaSession' in navigator) {
    // Эта часть отвечает за кнопки Play/Pause
    navigator.mediaSession.setActionHandler('play', () => { 
        audio.play(); 
        btnText.textContent = "PAUSE";
    });
    navigator.mediaSession.setActionHandler('pause', () => { 
        audio.pause(); 
        btnText.textContent = "PAUSE";
    });


    // А эти две строчки активируют стрелочки "Вперед" и "Назад" в шторке
    navigator.mediaSession.setActionHandler('nexttrack', () => {
        document.getElementById('next-btn').click();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
        document.getElementById('prev-btn').click();
    });
}
