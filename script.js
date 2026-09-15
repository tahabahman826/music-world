/* =========================================================
   🌌 MUSIC WORLD
   COMPLETE SCRIPT
   ========================================================= */


/* =========================================================
   1. STATE
   ========================================================= */

const state = {
    currentScene: 0,

    language: null,
    persianAge: null,
    englishGender: null,

    currentSong: null,
    currentSongIndex: -1,

    musicPlaying: false,
    volume: 0.7,

    noClicks: 0,
    catClicks: 0,

    inWorld: false
};


/* =========================================================
   2. SCENES
   ========================================================= */

const scenes = document.querySelectorAll(".scene");

const worldScene =
    document.getElementById("worldScene");


/* =========================================================
   3. CAT
   ========================================================= */

const cat =
    document.getElementById("cat");

const catHint =
    document.getElementById("catHint");

const catStatus =
    document.getElementById("catStatus");


/* =========================================================
   4. TOAST
   ========================================================= */

const toast =
    document.getElementById("toast");


function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


/* =========================================================
   5. AUDIO ENGINE
   ========================================================= */

const audio = new Audio();

audio.preload = "auto";
audio.volume = state.volume;


/* =========================================================
   6. REAL MP3 FILES
   ========================================================= */

/*
   پوشه:
   music/

   فایل‌ها دقیقاً مطابق فایل‌های تو هستند.
*/

const audioFiles = {

    "مرداب":
        "music/mordab.mp3",

    "باران":
        "music/baran.mp3",

    "اگه یه روز بری سفر":
        "music/safar.mp3",

    "24/7":
        "music/24_7.mp3",

    "چشمت سیاه":
        "music/hooman.mp3",

    "خونه‌ی من":
        "music/arta.mp3",

    "One Of The Girls":
        "music/one of the girl.mp3",

    "Timeless":
        "music/timeless.mp3",

    "Popular":
        "music/popular.mp3",

    "lovely":
        "music/lovely.mp3",

    "BIRDS OF A FEATHER":
        "music/Billie Eilish Birds of a Feather.mp3",

    "ocean eyes":
        "music/bili.mp3"
};


/* =========================================================
   7. SONG DATABASE
   ========================================================= */

const songs = [

    {
        title: "مرداب",
        artist: "Googoosh",
        world: "swamp",
        description:
            "شب آرام، ماه و مه کم‌رنگ؛ یک دنیای نوستالژیک و مرموز."
    },

    {
        title: "باران",
        artist: "Vigen",
        world: "rain",
        description:
            "خیابان خیس، چراغ‌های دور و بارانی که آرام شروع می‌شود."
    },

    {
        title: "اگه یه روز بری سفر",
        artist: "Faramarz Aslani",
        world: "road",
        description:
            "جاده‌ای در غروب؛ نورهای دور و حس یک سفر طولانی."
    },

    {
        title: "24/7",
        artist: "AROWN",
        world: "neon",
        description:
            "چراغ‌های نئون، شهر شبانه و موج‌های دیجیتالی."
    },

    {
        title: "چشمت سیاه",
        artist: "Hoomaan",
        world: "dark",
        description:
            "همه‌چیز آرام و تاریک شده؛ فقط ذرات نور در مه حرکت می‌کنند."
    },

    {
        title: "خونه‌ی من",
        artist: "Arta",
        world: "room",
        description:
            "اتاقی آرام با نور گرم پنجره و صدای باران در دوردست."
    },

    {
        title: "One Of The Girls",
        artist: "The Weeknd",
        world: "red",
        description:
            "نور قرمز و بنفش، مه شبانه و یک شهر تاریک."
    },

    {
        title: "Timeless",
        artist: "The Weeknd",
        world: "vhs",
        description:
            "خیابان شبانه، ماشین‌ها و حس یک صحنه قدیمی VHS."
    },

    {
        title: "Popular",
        artist: "The Weeknd",
        world: "luxury",
        description:
            "شب لوکس شهر، ساختمان‌های بلند و نور فلاش دوربین‌ها."
    },

    {
        title: "lovely",
        artist: "Billie Eilish",
        world: "lovely",
        description:
            "اتاق تاریک، نور ماه و فضایی سرد و آرام."
    },

    {
        title: "BIRDS OF A FEATHER",
        artist: "Billie Eilish",
        world: "birds",
        description:
            "آسمان شب، ماه بزرگ و سایه‌هایی که در دوردست حرکت می‌کنند."
    },

    {
        title: "ocean eyes",
        artist: "Billie Eilish",
        world: "ocean",
        description:
            "دنیایی زیر آب؛ نور ماه از میان آب عبور می‌کند."
    }
];


/* =========================================================
   8. SCENE NAVIGATION
   ========================================================= */

function goToScene(number) {

    if (!scenes[number]) {
        console.warn("Scene not found:", number);
        return;
    }

    scenes.forEach(scene => {
        scene.classList.remove("active");
    });

    scenes[number].classList.add("active");

    state.currentScene = number;
    state.inWorld = false;

    moveCat();
}


/* =========================================================
   9. START
   ========================================================= */

function startWorld() {

    goToScene(1);
}


/* =========================================================
   10. BACK
   ========================================================= */

function goBack() {

    if (state.inWorld) {
        backToSongs();
        return;
    }

    const parents = {

        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 3,
        6: 2,
        7: 6,
        8: 6
    };

    if (parents[state.currentScene] !== undefined) {

        goToScene(
            parents[state.currentScene]
        );
    }
}


/* =========================================================
   11. LANGUAGE
   ========================================================= */

function chooseLanguage(language) {

    state.language = language;

    if (language === "persian") {

        goToScene(3);

    } else {

        goToScene(6);
    }
}


/* =========================================================
   12. PERSIAN AGE
   ========================================================= */

function choosePersianAge(age) {

    state.persianAge = age;

    if (age === "old") {

        goToScene(4);

    } else {

        goToScene(5);
    }
}


/* =========================================================
   13. ENGLISH GENDER
   ========================================================= */

function chooseEnglishGender(gender) {

    state.englishGender = gender;

    if (gender === "male") {

        goToScene(7);

    } else {

        goToScene(8);
    }
}


/* =========================================================
   14. NO BUTTON
   ========================================================= */

function noAnswer() {

    state.noClicks++;

    const text =
        document.getElementById("noText");

    const button =
        document.getElementById("noButton");

    const messages = [

        "مطمئنی؟ 👀",

        "فکر کنم اشتباه زدی... 😐",

        "یه بار دیگه فکر کن 😼",

        "من هنوز منتظرم... 🎧",

        "آخرین فرصت! 😂"
    ];

    if (text) {

        text.textContent =
            messages[
                Math.min(
                    state.noClicks - 1,
                    messages.length - 1
                )
            ];
    }

    if (button) {

        const x =
            Math.random() * 160 - 80;

        const y =
            Math.random() * 100 - 50;

        const rotation =
            Math.random() * 16 - 8;

        button.style.transform =
            `translate(${x}px, ${y}px)
             rotate(${rotation}deg)`;
    }

    showToast(
        "گربه شاهد این تصمیم بود 😼"
    );
}


/* =========================================================
   15. FIND SONG
   ========================================================= */

function findSong(title) {

    return songs.find(
        song => song.title === title
    );
}


/* =========================================================
   16. OPEN WORLD
   ========================================================= */

function openWorld(title) {

    const song =
        findSong(title);

    if (!song) {

        console.error(
            "Song not found:",
            title
        );

        showToast(
            "این آهنگ پیدا نشد ⚠️"
        );

        return;
    }

    state.currentSong =
        song;

    state.currentSongIndex =
        songs.findIndex(
            item => item.title === song.title
        );

    state.inWorld = true;


    /* ---------- WORLD ---------- */

    if (worldScene) {

        scenes.forEach(scene => {
            scene.classList.remove("active");
        });

        worldScene.classList.add("active");

        worldScene.dataset.world =
            song.world;
    }


    /* ---------- TEXT ---------- */

    const songName =
        document.getElementById("songName");

    const artistName =
        document.getElementById("artistName");

    const description =
        document.getElementById(
            "worldDescription"
        );

    if (songName) {

        songName.textContent =
            song.title;
    }

    if (artistName) {

        artistName.textContent =
            song.artist;
    }

    if (description) {

        description.textContent =
            song.description;
    }


    /* ---------- AUDIO ---------- */

    loadSong(song);

    moveCat();
}


/* =========================================================
   17. LOAD MP3
   ========================================================= */

function loadSong(song) {

    const file =
        audioFiles[song.title];

    if (!file) {

        console.error(
            "MP3 path not found for:",
            song.title
        );

        showToast(
            "فایل این آهنگ پیدا نشد ⚠️"
        );

        return;
    }


    /* توقف آهنگ قبلی */

    audio.pause();

    audio.currentTime = 0;


    /*
       ساخت URL صحیح.
       مرورگر خودش فاصله‌های اسم فایل را
       به شکل مناسب تبدیل می‌کند.
    */

    const audioURL =
        new URL(
            file,
            document.baseURI
        ).href;


    audio.src =
        audioURL;


    audio.load();


    state.musicPlaying =
        false;


    updatePlayButton();


    console.log(
        "🎵 Loading MP3:",
        audioURL
    );


    showToast(
        `🎵 ${song.title}`
    );
}

/* =========================================================
   🐈‍⬛ CAT DANCE CONTROLLER
   ========================================================= */

function updateCatDance() {

    if (!cat) return;

    if (!audio.paused && !audio.ended) {
        cat.classList.add("dancing");
    } else {
        cat.classList.remove("dancing");
    }
}

/* =========================================================
   18. PLAY / PAUSE
   ========================================================= */
/* =========================================================
   🐈‍⬛ CAT DANCE CONTROLLER
   ========================================================= */

function updateCatDance() {

    if (!cat) return;

    if (!audio.paused && !audio.ended) {

        cat.classList.add("dancing");

    } else {

        cat.classList.remove("dancing");
    }
}
function toggleMusic() {

    if (!state.currentSong) {

        showToast(
            "اول یک آهنگ انتخاب کن 🎧"
        );

        return;
    }


    if (!audio.src) {

        showToast(
            "فایل MP3 آماده نیست ⚠️"
        );

        return;
    }


    if (audio.paused) {

        audio.play()
            .then(() => {

                state.musicPlaying =
                    true;

                updatePlayButton();

                showToast(
                    "🎵 Music Playing"
                );

            })
            .catch(error => {

                console.error(
                    "❌ PLAY ERROR:",
                    error
                );

                showToast(
                    "آهنگ پخش نشد ⚠️"
                );
            });

    } else {

        audio.pause();

        state.musicPlaying =
            false;

        updatePlayButton();
    }
}


/* =========================================================
   19. PLAY BUTTON
   ========================================================= */

function updatePlayButton() {

    const button =
        document.getElementById(
            "playButton"
        );

    if (!button) return;

    button.textContent =
        audio.paused
            ? "▶"
            : "⏸";
}


/* =========================================================
   20. VOLUME
   ========================================================= */

function changeVolume() {

    state.volume += 0.1;

    if (state.volume > 1) {

        state.volume = 0;
    }

    audio.volume =
        state.volume;

    showToast(
        `Volume: ${
            Math.round(
                state.volume * 100
            )
        }% 🔊`
    );
}


/* =========================================================
   21. AUDIO EVENTS
   ========================================================= */

audio.addEventListener(
    "loadeddata",
    () => {

        console.log(
            "✅ MP3 loaded successfully:",
            audio.src
        );
    }
);

/* =========================================================
   🎵 REAL PLAYER PROGRESS
   ========================================================= */

audio.addEventListener(
    "timeupdate",
    () => {

        const progress =
            document.querySelector(
                ".player-line span"
            );

        if (!progress) return;

        if (
            !audio.duration ||
            isNaN(audio.duration)
        ) {
            return;
        }

        const percent =
            (audio.currentTime /
                audio.duration) * 100;

        progress.style.width =
            percent + "%";
    }
);

audio.addEventListener(
    "canplay",
    () => {

        console.log(
            "🎧 MP3 ready to play"
        );
    }
);


audio.addEventListener(
    "play",
    () => {

        state.musicPlaying = true;

        updatePlayButton();

        updateCatDance();
    }
);

audio.addEventListener(
    "pause",
    () => {

        state.musicPlaying = false;

        updatePlayButton();

        updateCatDance();
    }
);;


audio.addEventListener(
    "ended",
    () => {

        state.musicPlaying =
            false;

        updatePlayButton();

        showToast(
            "آهنگ تموم شد 🎵"
        );
    }
);


audio.addEventListener(
    "error",
    () => {

        console.error(
            "❌ AUDIO ERROR"
        );

        console.error(
            "File:",
            audio.src
        );

        console.error(
            "Error:",
            audio.error
        );

        showToast(
            "فایل MP3 پیدا نشد یا قابل پخش نیست ⚠️"
        );
    }
);


/* =========================================================
   22. CAT POSITION
   ========================================================= */

function moveCat() {

    if (!cat) return;

    if (state.inWorld) {

        cat.style.left =
            "88%";

        cat.style.top =
            "78%";

        return;
    }

    const positions = [

        ["8%", "15%"],
        ["82%", "70%"],
        ["10%", "70%"],
        ["80%", "15%"],
        ["12%", "75%"],
        ["84%", "75%"],
        ["8%", "25%"],
        ["82%", "20%"],
        ["10%", "50%"]
    ];

    const position =
        positions[
            state.currentScene
        ] || positions[0];

    cat.style.left =
        position[0];

    cat.style.top =
        position[1];
}


/* =========================================================
   23. CAT CLICK
   ========================================================= */

function catClicked() {

    state.catClicks++;

    if (catStatus) {

        catStatus.textContent =
            `CAT GUIDE: ${
                Math.min(
                    state.catClicks,
                    5
                )
            } / 5`;
    }

    const messages = [

    "دنبال دردسری؟ 😼",

    "هی! چرا منو زدی؟ 👀",

    "فکر کردی نمی‌بینمت؟ 😾",

    "بازم منو زدی؟ 😼",

    "باشه... خودت خواستی! 🐈‍⬛"
];

    if (catHint) {

        catHint.textContent =
            messages[
                Math.min(
                    state.catClicks - 1,
                    messages.length - 1
                )
            ];

        catHint.classList.add("show");

        setTimeout(() => {

            catHint.classList.remove(
                "show"
            );

        }, 2200);
    }

    if (state.catClicks >= 5) {

        secretEnding();
    }
}


/* =========================================================
   24. BACK TO SONGS
   ========================================================= */

function backToSongs() {

    audio.pause();

    audio.currentTime = 0;

    state.musicPlaying =
        false;

    state.inWorld =
        false;

    updatePlayButton();


    if (state.language === "persian") {

        if (
            state.persianAge === "old"
        ) {

            goToScene(4);

        } else {

            goToScene(5);
        }

        return;
    }


    if (state.language === "english") {

        if (
            state.englishGender === "male"
        ) {

            goToScene(7);

        } else {

            goToScene(8);
        }

        return;
    }


    goToScene(2);
}


/* =========================================================
   25. NEXT SONG
   ========================================================= */

function nextSong() {

    if (
        state.currentSongIndex < 0
    ) {
        return;
    }

    let index =
        state.currentSongIndex + 1;

    if (
        index >= songs.length
    ) {

        index = 0;
    }

    openWorld(
        songs[index].title
    );
}


/* =========================================================
   26. PREVIOUS SONG
   ========================================================= */

function previousSong() {

    if (
        state.currentSongIndex < 0
    ) {
        return;
    }

    let index =
        state.currentSongIndex - 1;

    if (index < 0) {

        index =
            songs.length - 1;
    }

    openWorld(
        songs[index].title
    );
}


/* =========================================================
   27. SECRET ENDING
   ========================================================= */

function secretEnding() {

    if (
        document.getElementById(
            "secretWorld"
        )
    ) {
        return;
    }

    audio.pause();

    const secret =
        document.createElement("div");

    secret.id =
        "secretWorld";

    secret.innerHTML = `

        <div class="secret-content">

            <div class="secret-cat">
                🐈‍⬛
            </div>

            <h1>
                SECRET WORLD
            </h1>

            <p>
                پس بالاخره پیدام کردی... 👀
            </p>

            <button
                class="main-btn"
                id="closeSecret"
            >
                برگشت 🌌
            </button>

        </div>
    `;

    secret.style.position =
        "fixed";

    secret.style.inset =
        "0";

    secret.style.zIndex =
        "9999";

    secret.style.background =
        "#020207";

    secret.style.display =
        "flex";

    secret.style.alignItems =
        "center";

    secret.style.justifyContent =
        "center";

    secret.style.textAlign =
        "center";

    document.body.appendChild(
        secret
    );

    const close =
        document.getElementById(
            "closeSecret"
        );

    if (close) {

        close.onclick = () => {

            secret.remove();
        };
    }
}


/* =========================================================
   28. KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            toggleMusic();
        }


        if (
            event.code === "ArrowRight"
        ) {

            nextSong();
        }


        if (
            event.code === "ArrowLeft"
        ) {

            previousSong();
        }


        if (
            event.code === "Escape"
        ) {

            if (state.inWorld) {

                backToSongs();
            }
        }
    }
);


/* =========================================================
   29. GLOBAL FUNCTIONS
   ========================================================= */

window.startWorld =
    startWorld;

window.goToScene =
    goToScene;

window.goBack =
    goBack;

window.chooseLanguage =
    chooseLanguage;

window.choosePersianAge =
    choosePersianAge;

window.chooseEnglishGender =
    chooseEnglishGender;

window.noAnswer =
    noAnswer;

window.openWorld =
    openWorld;

window.toggleMusic =
    toggleMusic;

window.changeVolume =
    changeVolume;

window.backToSongs =
    backToSongs;

window.nextSong =
    nextSong;

window.previousSong =
    previousSong;

window.catClicked =
    catClicked;


/* =========================================================
   30. STARTUP
   ========================================================= */

moveCat();

updatePlayButton();


console.log(
    "🌌 MUSIC WORLD STARTED"
);

console.log(
    "🎵 Total songs:",
    songs.length
);

console.log(
    "🎧 Audio system ready"
);/* =========================================================
   🌌 MUSIC WORLD FX ENGINE
   VISUALIZER + PARTICLES + RAIN + WORLD EFFECTS
   ========================================================= */


/* =========================================================
   31. EFFECT CONTAINER
   ========================================================= */

/* =========================================================
   🌌 MUSIC WORLD VISUAL FX
   SAFE VERSION
   DOES NOT TOUCH AUDIO
   ========================================================= */

let fxContainer = null;
let visualizer = null;


/* =========================================================
   CREATE FX CONTAINER
   ========================================================= */

function createMusicFX() {

    if (!worldScene) return;

    fxContainer =
        document.getElementById("musicFX");

    if (!fxContainer) {

        fxContainer =
            document.createElement("div");

        fxContainer.id =
            "musicFX";

        fxContainer.style.position =
            "absolute";

        fxContainer.style.inset =
            "0";

        fxContainer.style.pointerEvents =
            "none";

        fxContainer.style.overflow =
            "hidden";

        fxContainer.style.zIndex =
            "2";

        worldScene.appendChild(
            fxContainer
        );
    }


    createVisualBars();
}


/* =========================================================
   VISUALIZER
   ========================================================= */

function createVisualBars() {

    if (!worldScene) return;

    visualizer =
        document.getElementById(
            "safeVisualizer"
        );

    if (!visualizer) {

        visualizer =
            document.createElement("div");

        visualizer.id =
            "safeVisualizer";

        visualizer.style.position =
            "absolute";

        visualizer.style.bottom =
            "70px";

        visualizer.style.left =
            "50%";

        visualizer.style.transform =
            "translateX(-50%)";

        visualizer.style.width =
            "420px";

        visualizer.style.height =
            "80px";

        visualizer.style.display =
            "flex";

        visualizer.style.alignItems =
            "flex-end";

        visualizer.style.justifyContent =
            "center";

        visualizer.style.gap =
            "5px";

        visualizer.style.zIndex =
            "4";

        visualizer.style.pointerEvents =
            "none";

        worldScene.appendChild(
            visualizer
        );
    }


    visualizer.innerHTML = "";


    for (
        let i = 0;
        i < 36;
        i++
    ) {

        const bar =
            document.createElement("div");

        bar.style.width =
            "6px";

        bar.style.height =
            `${8 + Math.random() * 30}px`;

        bar.style.borderRadius =
            "10px";

        bar.style.background =
            "linear-gradient(to top,#713cff,#e0caff)";

        bar.style.boxShadow =
            "0 0 12px rgba(130,80,255,.7)";

        bar.style.transition =
            "height .18s ease";

        visualizer.appendChild(
            bar
        );
    }
}


/* =========================================================
   VISUALIZER ANIMATION
   ========================================================= */

function animateSafeVisualizer() {

    if (!visualizer) {

        requestAnimationFrame(
            animateSafeVisualizer
        );

        return;
    }


    const bars =
        visualizer.children;


    for (
        let i = 0;
        i < bars.length;
        i++
    ) {

        const wave =
            10 +
            Math.abs(
                Math.sin(
                    Date.now() / 180 +
                    i * .55
                )
            ) * 55;


        const random =
            Math.random() * 12;


        bars[i].style.height =
            `${wave + random}px`;
    }


    requestAnimationFrame(
        animateSafeVisualizer
    );
}


/* =========================================================
   PARTICLES
   ========================================================= */

function createSafeParticles(
    amount = 40
) {

    if (!fxContainer) return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement("div");


        const size =
            2 + Math.random() * 4;


        particle.style.position =
            "absolute";

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.borderRadius =
            "50%";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;

        particle.style.background =
            "rgba(220,200,255,.8)";

        particle.style.boxShadow =
            "0 0 12px rgba(160,100,255,.8)";

        particle.style.animation =
            `safeParticle ${
                4 + Math.random() * 7
            }s ease-in-out infinite`;

        particle.style.animationDelay =
            `${Math.random() * 5}s`;

        fxContainer.appendChild(
            particle
        );
    }
}


/* =========================================================
   STARS
   ========================================================= */

function createSafeStars(
    amount = 60
) {

    if (!fxContainer) return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const star =
            document.createElement("div");


        const size =
            1 + Math.random() * 3;


        star.style.position =
            "absolute";

        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        star.style.borderRadius =
            "50%";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 70}%`;

        star.style.background =
            "white";

        star.style.boxShadow =
            "0 0 10px white";

        star.style.animation =
            `safeTwinkle ${
                1.5 + Math.random() * 3
            }s ease-in-out infinite`;

        star.style.animationDelay =
            `${Math.random() * 3}s`;

        fxContainer.appendChild(
            star
        );
    }
}


/* =========================================================
   RAIN
   ========================================================= */

function createSafeRain(
    amount = 100
) {

    if (!fxContainer) return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const drop =
            document.createElement("div");


        drop.style.position =
            "absolute";

        drop.style.width =
            "1px";

        drop.style.height =
            `${15 + Math.random() * 20}px`;

        drop.style.left =
            `${Math.random() * 100}%`;

        drop.style.top =
            `${-30 - Math.random() * 100}%`;

        drop.style.background =
            "rgba(180,210,255,.45)";

        drop.style.transform =
            "rotate(12deg)";

        drop.style.animation =
            `safeRain ${
                .5 + Math.random() * .6
            }s linear infinite`;

        drop.style.animationDelay =
            `${Math.random() * 2}s`;

        fxContainer.appendChild(
            drop
        );
    }
}


/* =========================================================
   BUBBLES
   ========================================================= */

function createSafeBubbles(
    amount = 30
) {

    if (!fxContainer) return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const bubble =
            document.createElement("div");


        const size =
            4 + Math.random() * 14;


        bubble.style.position =
            "absolute";

        bubble.style.width =
            `${size}px`;

        bubble.style.height =
            `${size}px`;

        bubble.style.border =
            "1px solid rgba(180,220,255,.6)";

        bubble.style.borderRadius =
            "50%";

        bubble.style.left =
            `${Math.random() * 100}%`;

        bubble.style.top =
            `${50 + Math.random() * 50}%`;

        bubble.style.animation =
            `safeBubble ${
                5 + Math.random() * 6
            }s linear infinite`;

        bubble.style.animationDelay =
            `${Math.random() * 5}s`;

        fxContainer.appendChild(
            bubble
        );
    }
}


/* =========================================================
   BIRDS
   ========================================================= */

function createSafeBirds(
    amount = 7
) {

    if (!fxContainer) return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const bird =
            document.createElement("div");


        bird.textContent =
            "⌁";


        bird.style.position =
            "absolute";

        bird.style.left =
            `${Math.random() * 100}%`;

        bird.style.top =
            `${10 + Math.random() * 40}%`;

        bird.style.fontSize =
            `${14 + Math.random() * 10}px`;

        bird.style.color =
            "rgba(255,255,255,.55)";

        bird.style.animation =
            `safeBird ${
                7 + Math.random() * 6
            }s linear infinite`;

        bird.style.animationDelay =
            `${Math.random() * 5}s`;

        fxContainer.appendChild(
            bird
        );
    }
}


/* =========================================================
   WORLD EFFECTS
   ========================================================= */

function updateWorldFX() {

    if (!state.currentSong)
        return;

    if (!worldScene)
        return;


    createMusicFX();


    fxContainer.innerHTML = "";


    const world =
        state.currentSong.world;


    /* DEFAULT */

    createSafeParticles(35);


    /* SWAMP */

    if (world === "swamp") {

        createSafeStars(60);
    }


    /* RAIN */

    if (world === "rain") {

        createSafeRain(120);
    }


    /* ROAD */

    if (world === "road") {

        createSafeStars(35);
        createSafeParticles(25);
    }


    /* NEON */

    if (world === "neon") {

        createSafeParticles(70);
    }


    /* DARK */

    if (world === "dark") {

        createSafeParticles(25);
    }


    /* ROOM */

    if (world === "room") {

        createSafeRain(65);
        createSafeParticles(25);
    }


    /* RED */

    if (world === "red") {

        createSafeParticles(65);
    }


    /* VHS */

    if (world === "vhs") {

        createSafeParticles(30);
    }


    /* LUXURY */

    if (world === "luxury") {

        createSafeStars(35);
    }


    /* LOVELY */

    if (world === "lovely") {

        createSafeStars(65);
    }


    /* BIRDS */

    if (world === "birds") {

        createSafeStars(90);
        createSafeBirds(8);
    }


    /* OCEAN */

    if (world === "ocean") {

        createSafeBubbles(40);
        createSafeParticles(30);
    }
}


/* =========================================================
   SAFE CSS
   ========================================================= */

function addSafeFXStyles() {

    if (
        document.getElementById(
            "safeMusicFXStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "safeMusicFXStyles";


    style.textContent = `

        @keyframes safeParticle {

            0% {
                transform:
                    translateY(20px)
                    scale(.7);

                opacity: .15;
            }

            50% {
                transform:
                    translateY(-30px)
                    scale(1.2);

                opacity: .8;
            }

            100% {
                transform:
                    translateY(20px)
                    scale(.7);

                opacity: .15;
            }
        }


        @keyframes safeTwinkle {

            0%,100% {
                opacity: .15;
                transform: scale(.7);
            }

            50% {
                opacity: 1;
                transform: scale(1.5);
            }
        }


        @keyframes safeRain {

            from {
                transform:
                    translateY(-120px)
                    rotate(12deg);
            }

            to {
                transform:
                    translateY(110vh)
                    rotate(12deg);
            }
        }


        @keyframes safeBubble {

            from {
                transform:
                    translateY(30vh);

                opacity: 0;
            }

            20% {
                opacity: .7;
            }

            to {
                transform:
                    translateY(-100vh);

                opacity: 0;
            }
        }


        @keyframes safeBird {

            0% {
                transform:
                    translateX(-100px);

                opacity: 0;
            }

            20% {
                opacity: .7;
            }

            100% {
                transform:
                    translateX(110vw);

                opacity: 0;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


/* =========================================================
   CONNECT FX TO WORLD
   ========================================================= */

const oldOpenWorld =
    window.openWorld;


window.openWorld =
    function(title) {

        oldOpenWorld(title);

        setTimeout(() => {

            updateWorldFX();

        }, 50);
    };


/* =========================================================
   START
   ========================================================= */

addSafeFXStyles();

createMusicFX();

animateSafeVisualizer();


console.log(
    "✨ SAFE VISUAL FX READY"
);