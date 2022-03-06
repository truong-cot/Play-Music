import {songs} from '../JS/songs.js';

// Khai bao:
const listSongs = document.querySelector(".listMusic");
const pause = document.querySelector(".icon-pause");
const play = document.querySelector(".icon-play");
const cd = document.querySelector(".cd");
const cdImage = document.querySelector(".cd-image");
const audio = document.querySelector("#audio");
const nameCurrentSong = document.querySelector('.dashboard h2');
const imageCurrentSong = document.querySelector('.cd .cd-image');
const togglePlay = document.querySelector(".btn-toggle-play");
const progress = document.querySelector("#progress");
const nextBtn = document.querySelector(".btn-next");
const prevBtn = document.querySelector(".btn-prev");
const randomBtn = document.querySelector(".btn-random");
const repeatBtn = document.querySelector(".btn-repeat");

var currentIndex = 0;
var checkRandom = false;
var checkRepeat = false;

// Hien thi danh sach bai hat 
function render() {
    var htmls = songs.map(function(song, index) {
        return `
        <div class="song ${index === currentIndex ? "active" : ""}" data-index="${index}")>
            <div class="song-image" 
                style = "background-image: url('${song.image}')">
            </div>
            <div class="title">
                <h3>${song.name}</h3>
                <h6>${song.singer}</h6>
            </div>
            <div class="song-icon">
                <i class="fa-solid fa-ellipsis"></i>
            </div>
        </div>
        `
    })
    
    listSongs.innerHTML = htmls.join('');
    getSongElement();

}

function getSongElement() {
    const song = document.querySelectorAll(".song");
    song.forEach((e) => {
        e.onclick = function() {
            e.classList.add("active");
            currentIndex = Number(e.dataset.index);
            loadCurrentSong();
            render();
            pause.style.display = "block";
            play.style.display = "none";
            audio.play();
            imageRotate.play();
        }
    })
}


// Hàm xử lý sự kiện scroll
function handleEvent() {   
    var cdWidth = cd.offsetWidth; // width ban đầu của block

    document.onscroll = function(){
        var scroll = window.scrollY || document.documentElement.scrollTop // width khi scroll
        var newWidth = cdWidth - scroll; // width ban đầu - width scroll

        if (newWidth > 0) {
            cd.style.width = newWidth + 'px'; // Giảm width 
            cd.style.opacity = newWidth / cdWidth;
        }else {
            cd.style.width = 0;
        }
    }
}

// Get ra bai hat dau tien
function getCurrentSong() {
    return songs[currentIndex];
}

// Load bài hát đầu tiên ra UI 
function loadCurrentSong() {
    nameCurrentSong.textContent = getCurrentSong().name;
    imageCurrentSong.style.backgroundImage = `url("${getCurrentSong().image}")`;
    audio.src = getCurrentSong().path;
}

// Next bài hát
function nextSong() {
    currentIndex++;
    // check dieu kien
    if(currentIndex >= songs.length) {
        currentIndex = 0;
    }
    // gọi đến hàm loadSong
    loadCurrentSong();
    render();
}

// Prev bài hát
function prevSong() {
    currentIndex--;
    // check dieu kien
    if(currentIndex < 0) {
        currentIndex = songs.length - 1;
    }
    // gọi đến hàm loadSong
    loadCurrentSong();
    render();
}

// Hàm randum song
function randumSong() {
    var newIndex;
    do {
        newIndex = Math.floor(Math.random() * songs.length);
    } while (currentIndex === newIndex);

    // Gắn newIndex cho currentIndex
    currentIndex = newIndex;
    loadCurrentSong();
    render();
}

// Xử lý hình ảnh quay / dừng
var imageRotate = cdImage.animate([
    {
        transform: 'rotate(360deg)'
    }
],
{
    duration: 5000,
    iterations: Infinity,
})
imageRotate.pause();


// Sự kiện thì ấn nút play
function playing() {
    play.onclick = function() {
        pause.style.display = "block";
        play.style.display = "none";
        audio.play();
        imageRotate.play();
    }

    // Chạy thanh input range
    audio.ontimeupdate = function() {
        var phanTram = 100 / audio.duration * audio.currentTime;
        
        if(phanTram.toString() !== 'NaN') {
            progress.value = phanTram;
        }
        // console.log(audio.currentTime, audio.duration, phanTram);
    }

    // Xử lý tua
    progress.onchange = function(e) {
        var phanTramTua = e.target.value; // Lấy ra phần trăm khi click tua
        audio.currentTime = audio.duration * phanTramTua / 100; // gắn lại currentTime
    }

    // Xử lý sự kiện repeat
    audio.onended = function () {
        if(checkRepeat === false) {
            if(checkRandom === true) {
                randumSong();
            }
            else {
                nextSong();
            }
            pause.style.display = "block";
            play.style.display = "none";
            audio.play();
            imageRotate.play();
        }
        else {
            audio.play();
        }
    }

}

// Ham scroll into view (view baif hat duoc active)
function scrollIntoView() {
    document.querySelector(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
}

// Sự kiện paused
function paused() {
    pause.onclick = function() {
        pause.style.display = "none";
        play.style.display = "block";
        audio.pause();
        imageRotate.pause();
    }
}

// Sự kiện ấn nút next
nextBtn.onclick = function() {
    if(checkRandom === true) {
        randumSong();
    }
    else {
        nextSong();
    }
    pause.style.display = "block";
    play.style.display = "none";
    audio.play();
    imageRotate.play();
    scrollIntoView();
}

// SỰ kiện ấn nút prev
prevBtn.onclick = function() {
    if (checkRandom === true) {
        randumSong();
    }
    else{
        prevSong();
    }
    pause.style.display = "block";
    play.style.display = "none";
    audio.play();
    imageRotate.play();
    scrollIntoView();
}

// Sự kiên click nút randum
randomBtn.onclick = function() {
    checkRandom =  !checkRandom;
    // Nếu là true thì active còn nếu false thì remove
    randomBtn.classList.toggle("active", checkRandom);
}

// Sự kiện click nút repeat
repeatBtn.onclick = function() {
    checkRepeat = !checkRepeat;
    repeatBtn.classList.toggle("active", checkRepeat);
}

// Ham start:
function start() {
    // xử lý sự kiện scroll
    handleEvent();

    // render songs
    render();

    // Lấy ra bài hát đầu tiền
    getCurrentSong();

    // render bài hát đầu tiên ra UI 
    loadCurrentSong();

    // Playing
    playing();

    // Paused
    paused();
}
start();