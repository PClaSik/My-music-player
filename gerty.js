const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const btnText = document.getElementById('btn-text');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');

const playlist = [
    { title: "1. intro (Template)", file: "Kid Cudi - Electrowavebaby.mp3" },
    { title: "2. Main vibe (Template)", file: "Kid Cudi feat Pharrell Williams, Travis Scott - At The Party (hitparad.fm).mp3" },
    { title: "3. Outro (Template)", file: "LOOOVE.flac" },
];

let currentTrackIndex = 0;

function loadTrack(index) {
    if (index >= 0 && index < playlist.length) {
        audio.src = playlist[index].file;
    }
}

// Загружаем первую песню при старте
loadTrack(currentTrackIndex);

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        btnText.innerText = "PAUSE";
        playBtn.style.borderColor = "#00ff00";
    } else {
        audio.pause();
        btnText.innerText = "PLAY";
        playBtn.style.borderColor = "#fff";
    }
});

// This event fires while music is playing
audio.ontimeupdate = () => {
    if (audio.duration && !isNaN(audio.duration)) {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percentage + "%";
    }
};

// Кнопка ВПЕРЕД
document.getElementById('next-btn').addEventListener('click', () => {
    currentTrackIndex++;
    
    // Если дошли до конца — прыгаем в начало
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
    
    // Если ушли за начало — прыгаем в самый конец
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
audio.addEventListener('timeupdate',()=>{
    const { duration, currentTime}=audio;
    if(duration){
    const progressPercent=(correntTime/duration)*100;
    peogressBar.style.width=`${progressPercent}%`;
    }
});
progressContainer.addEventListener('click', function(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
if(duration){
    audio.currentTime = (clickX / width) * audio.duration;
    console.log("Перемотка на: " + setTime); // Проверим в консоли (F12)
}
});
function playSmoothly() {
    audio.volume = 0; // Начинаем с тишины
    audio.play();
    
    // Постепенно увеличиваем громкость до 1.0 за 500мс
    let fadeIn = setInterval(() => {
        if (audio.volume < 0.9) {
            audio.volume += 0.1;
        } else {
            audio.volume = 1;
            clearInterval(fadeIn);
        }
    }, 50); 
}
let isMouseDown = false;

// 1. Зажали мышь — фиксируем это
progressContainer.onmousedown = (e) => {
    isMouseDown = true;
    rewind(e); // Сразу прыгаем в место клика
};

// 2. Отпустили мышь — вот ТУТ окончательно ставим время песни
window.onmouseup = (e) => {
    if (isMouseDown) {
        isMouseDown = false;
        // Можно добавить плавное появление звука здесь, если хочешь
    }
};

// 3. Двигаем мышь
window.onmousemove = (e) => {
    if (isMouseDown) {
        // Вычисляем положение относительно контейнера
        const rect = progressContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let width = rect.width;
        
        // Ограничиваем, чтобы не вылетало за границы (0-100%)
        if (x < 0) x = 0;
        if (x > width) x = width;

        const progressPercent = (x / width) * 100;
        progressBar.style.width = `${progressPercent}%`; // Меняем ТОЛЬКО визуально

        // Если хочешь, чтобы звук ВСЕ-ТАКИ шел, но не тупил, 
        // можно обновлять currentTime не каждое движение, а через раз.
        // Но лучше обновлять его в функции rewind ниже.
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
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// Функция для форматирования времени (секунды -> 0:00)
function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Обновляем время вместе с полоской прогресса
audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    
    // Обновляем текст текущего времени
    currentTimeEl.innerText = formatTime(currentTime);
    
    // Обновляем общую длительность (только когда она загрузится)
    if (duration) {
        durationEl.innerText = formatTime(duration);
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});