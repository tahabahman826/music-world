/* =========================================================
   🌌 MUSIC WORLD 3.0
   Integrated rebuild:
   - Single project for PC + mobile
   - Same core navigation
   - Local MP3 support
   - Ariana Grande / bye added
   - Cat system kept isolated
   - Dynamic FX kept isolated
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
   2. DOM REFERENCES
   ========================================================= */

const scenes =
    document.querySelectorAll(".scene");

const worldScene =
    document.getElementById("worldScene");

const cat =
    document.getElementById("cat");

const catHint =
    document.getElementById("catHint");

const catStatus =
    document.getElementById("catStatus");

const toast =
    document.getElementById("toast");

const visualizer =
    document.getElementById("visualizer");

const rainLayer =
    document.getElementById("rainLayer");

const worldParticles =
    document.getElementById("worldParticles");

const playerSongName =
    document.getElementById("playerSongName");

const playerStatus =
    document.getElementById("playerStatus");

const playerLine =
    document.getElementById("playerLine");


/* =========================================================
   3. TOAST
   ========================================================= */

let toastTimer = null;

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


/* =========================================================
   4. AUDIO ENGINE
   ========================================================= */

const audio = new Audio();

audio.preload = "metadata";
audio.volume = state.volume;


/* =========================================================
   5. AUDIO FILES
   ========================================================= */

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

    "Starboy":
        "music/starboy.mp3",

    "Call Out My Name":
        "music/call out my name.mp3",


    "lovely":
        "music/lovely.mp3",

    "BIRDS OF A FEATHER":
        "music/Billie Eilish Birds of a Feather.mp3",

    "ocean eyes":
        "music/bili.mp3",


    /* NEW — ARIANA GRANDE */

    "bye":
        "music/bye.mp3"
};


/* =========================================================
   6. SONG DATABASE
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
        title: "Starboy",
        artist: "The Weeknd",
        world: "starboy",
        description:
            "شهر شبانه، نورهای نئونی و فضایی مدرن و سینمایی."
    },


    {
        title: "Call Out My Name",
        artist: "The Weeknd",
        world: "callout",
        description:
            "فضایی تاریک و احساسی با نور قرمز و حرکت‌های نرم."
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
    },


    /* NEW — ARIANA GRANDE */

    {
        title: "bye",
        artist: "Ariana Grande",
        world: "ariana",
        description:
            "فضایی نرم و سینمایی با نور صورتی، بنفش و ذرات درخشان."
    }

];


/* =========================================================
   7. SCENE NAVIGATION
   ========================================================= */

function goToScene(number) {

    if (!scenes[number]) {
        console.warn(
            "Scene not found:",
            number
        );

        return;
    }

    scenes.forEach(scene => {
        scene.classList.remove("active");
    });

    scenes[number].classList.add("active");

    state.currentScene = number;
    state.inWorld = false;

    clearWorldFX();
    moveCat();
}


/* =========================================================
   8. START
   ========================================================= */

function startWorld() {

    goToScene(1);

}


/* =========================================================
   9. BACK
   ========================================================= */

function goBack() {

    if (state.inWorld) {

        backToSongs();

        return;
    }

    const parents = {

        1: 0,
        2: 1,
        3: 1,
        4: 3,
        5: 3,
        6: 1,
        7: 6,
        8: 6

    };

    const parent =
        parents[state.currentScene];

    if (parent !== undefined) {

        goToScene(parent);

    }

}


/* =========================================================
   10. LANGUAGE
   ========================================================= */

function chooseLanguage(language) {

    state.language =
        language;

    if (language === "persian") {

        goToScene(3);

    } else {

        goToScene(6);

    }

}


/* =========================================================
   11. PERSIAN AGE
   ========================================================= */

function choosePersianAge(age) {

    state.persianAge =
        age;

    if (age === "old") {

        goToScene(4);

    } else {

        goToScene(5);

    }

}


/* =========================================================
   12. ENGLISH ARTIST PATH
   ========================================================= */

function chooseEnglishGender(gender) {

    state.englishGender =
        gender;

    if (gender === "male") {

        goToScene(7);

    } else {

        goToScene(8);

    }

}


/* =========================================================
   13. SONG SEARCH
   ========================================================= */

function findSong(title) {

    return songs.find(
        song =>
            song.title === title
    );

}


/* =========================================================
   14. OPEN WORLD
   ========================================================= */

function openWorld(
    title,
    artistOverride = null,
    worldOverride = null
) {

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

    state.currentSong = {

        ...song,

        artist:
            artistOverride ||
            song.artist,

        world:
            worldOverride ||
            song.world

    };

    state.currentSongIndex =
        songs.findIndex(
            item =>
                item.title === song.title
        );

    state.inWorld = true;


    if (worldScene) {

        scenes.forEach(scene => {

            scene.classList.remove(
                "active"
            );

        });

        worldScene.classList.add(
            "active"
        );

        worldScene.dataset.world =
            state.currentSong.world;

    }


    const songName =
        document.getElementById(
            "songName"
        );

    const artistName =
        document.getElementById(
            "artistName"
        );

    const description =
        document.getElementById(
            "worldDescription"
        );


    if (songName) {

        songName.textContent =
            state.currentSong.title;

    }


    if (artistName) {

        artistName.textContent =
            state.currentSong.artist;

    }


    if (description) {

        description.textContent =
            state.currentSong.description;

    }


    if (playerSongName) {

        playerSongName.textContent =
            state.currentSong.title;

    }


    if (playerStatus) {

        playerStatus.textContent =
            "LOADING";

    }


    loadSong(
        state.currentSong
    );

    updateWorldFX();

    moveCat();

}


/* =========================================================
   15. LOAD SONG
   ========================================================= */

function loadSong(song) {

    const file =
        audioFiles[song.title];

    if (!file) {

        console.error(
            "Audio path not found:",
            song.title
        );

        showToast(
            "فایل این آهنگ پیدا نشد ⚠️"
        );

        return;
    }


    audio.pause();

    audio.currentTime = 0;


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


    resetPlayerProgress();

    updatePlayButton();

    updateCatDance();


    if (playerStatus) {

        playerStatus.textContent =
            "READY";

    }


    showToast(
        `🎵 ${song.title}`
    );


    console.log(
        "🎵 Loading MP3:",
        audioURL
    );

}


/* =========================================================
   16. MUSIC TOGGLE
   ========================================================= */

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

                updateCatDance();


                if (playerStatus) {

                    playerStatus.textContent =
                        "PLAYING";

                }


                showToast(
                    "🎵 Music Playing"
                );

            })

            .catch(error => {

                console.error(
                    "❌ PLAY ERROR:",
                    error
                );


                if (playerStatus) {

                    playerStatus.textContent =
                        "PLAY ERROR";

                }


                showToast(
                    "آهنگ پخش نشد ⚠️"
                );

            });

    } else {

        audio.pause();

        state.musicPlaying =
            false;

        updatePlayButton();

        updateCatDance();


        if (playerStatus) {

            playerStatus.textContent =
                "PAUSED";

        }

    }

}


/* =========================================================
   17. PLAY BUTTON
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
   18. VOLUME
   ========================================================= */

function changeVolume() {

    state.volume += 0.1;


    if (state.volume > 1) {

        state.volume = 0;

    }


    state.volume =
        Math.round(
            state.volume * 10
        ) / 10;


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
   19. PLAYER PROGRESS
   ========================================================= */

function resetPlayerProgress() {

    const progress =
        document.querySelector(
            ".player-line span"
        );

    if (!progress) return;

    progress.style.width =
        "0%";

}


function updatePlayerProgress() {

    const progress =
        document.querySelector(
            ".player-line span"
        );

    if (!progress) return;


    if (
        !audio.duration ||
        Number.isNaN(audio.duration)
    ) {

        return;

    }


    const percent =
        (
            audio.currentTime /
            audio.duration
        ) * 100;


    progress.style.width =
        `${percent}%`;

}


/* =========================================================
   20. PLAYER SEEK
   ========================================================= */

function seekFromPointer(event) {

    if (
        !audio.duration ||
        Number.isNaN(audio.duration) ||
        !playerLine
    ) {

        return;

    }


    const rect =
        playerLine.getBoundingClientRect();


    const ratio =
        Math.min(
            1,
            Math.max(
                0,
                (
                    event.clientX -
                    rect.left
                ) / rect.width
            )
        );


    audio.currentTime =
        ratio *
        audio.duration;

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


audio.addEventListener(
    "canplay",
    () => {

        console.log(
            "🎧 MP3 ready to play"
        );


        if (playerStatus) {

            playerStatus.textContent =
                audio.paused
                    ? "READY"
                    : "PLAYING";

        }

    }
);


audio.addEventListener(
    "timeupdate",
    () => {

        updatePlayerProgress();

    }
);


audio.addEventListener(
    "play",
    () => {

        state.musicPlaying =
            true;

        updatePlayButton();

        updateCatDance();


        if (playerStatus) {

            playerStatus.textContent =
                "PLAYING";

        }

    }
);


audio.addEventListener(
    "pause",
    () => {

        state.musicPlaying =
            false;

        updatePlayButton();

        updateCatDance();


        if (
            state.inWorld &&
            playerStatus
        ) {

            playerStatus.textContent =
                "PAUSED";

        }

    }
);


audio.addEventListener(
    "ended",
    () => {

        state.musicPlaying =
            false;

        updatePlayButton();

        updateCatDance();

        updatePlayerProgress();


        if (playerStatus) {

            playerStatus.textContent =
                "ENDED";

        }


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


        if (playerStatus) {

            playerStatus.textContent =
                "FILE ERROR";

        }


        showToast(
            "فایل MP3 پیدا نشد یا قابل پخش نیست ⚠️"
        );

    }
);


/* =========================================================
   22. CAT DANCE
   ========================================================= */

function updateCatDance() {

    if (!cat) return;


    if (
        !audio.paused &&
        !audio.ended
    ) {

        cat.classList.add(
            "dancing"
        );

    } else {

        cat.classList.remove(
            "dancing"
        );

    }

}


/* =========================================================
   23. CAT POSITION
   ========================================================= */

function moveCat() {

    const guide =
        document.getElementById(
            "catGuide"
        );


    if (!guide) return;


    if (state.inWorld) {

        guide.style.left =
            "auto";

        guide.style.right =
            "4%";

        guide.style.top =
            "62%";

        return;

    }


    guide.style.right =
        "auto";


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
        ] ||
        positions[0];


    guide.style.left =
        position[0];

    guide.style.top =
        position[1];

}


/* =========================================================
   24. CAT CLICK
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


        catHint.classList.add(
            "show"
        );


        setTimeout(() => {

            catHint.classList.remove(
                "show"
            );

        }, 2200);

    }


    if (
        state.catClicks >= 5
    ) {

        secretEnding();

    }

}


/* =========================================================
   25. BACK TO SONGS
   ========================================================= */

function backToSongs() {

    audio.pause();

    audio.currentTime =
        0;

    state.musicPlaying =
        false;

    state.inWorld =
        false;


    updatePlayButton();

    updateCatDance();

    resetPlayerProgress();

    clearWorldFX();


    if (
        state.language ===
        "persian"
    ) {

        if (
            state.persianAge ===
            "old"
        ) {

            goToScene(4);

        } else {

            goToScene(5);

        }

        return;

    }


    if (
        state.language ===
        "english"
    ) {

        if (
            state.englishGender ===
            "male"
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
   26. NEXT SONG
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
   27. PREVIOUS SONG
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
   28. SECRET SYSTEM
   ========================================================= */

function secretClick() {

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


    if (
        state.catClicks >= 5
    ) {

        secretEnding();

    }

}


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
        document.createElement(
            "div"
        );


    secret.id =
        "secretWorld";


    secret.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            z-index:9999;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            padding:24px;
            background:
                radial-gradient(
                    circle at 50% 35%,
                    rgba(145,90,255,.2),
                    transparent 28%
                ),
                #020207;
        ">

            <div style="
                width:min(520px,100%);
                padding:36px 24px;
                border:1px solid rgba(255,255,255,.08);
                border-radius:28px;
                background:rgba(10,10,18,.72);
                backdrop-filter:blur(18px);
                box-shadow:
                    0 30px 90px
                    rgba(0,0,0,.5);
            ">

                <div style="
                    font-size:64px;
                    margin-bottom:12px;
                ">
                    🐈‍⬛
                </div>

                <div style="
                    font-size:12px;
                    letter-spacing:.2em;
                    font-weight:900;
                    color:rgba(255,255,255,.5);
                    margin-bottom:10px;
                ">
                    SECRET WORLD
                </div>

                <h2 style="
                    margin:0 0 12px;
                ">
                    پس بالاخره پیدام کردی... 👀
                </h2>

                <p style="
                    color:rgba(255,255,255,.55);
                    line-height:1.7;
                ">
                    گربه هنوز اینجاست.
                </p>

                <button
                    class="main-btn"
                    id="closeSecret"
                    type="button"
                >
                    برگشت 🌌
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        secret
    );


    const close =
        document.getElementById(
            "closeSecret"
        );


    if (close) {

        close.onclick =
            () => {

                secret.remove();

            };

    }

}


/* =========================================================
   29. FX STATE
   ========================================================= */

let fxAnimationId = null;

let visualizerBars = [];

let visualizerPhases = [];

let lastVisualizerTime = 0;


/* =========================================================
   30. MOBILE / FX HELPERS
   ========================================================= */

function isMobileLayout() {

    return window.matchMedia(
        "(max-width: 760px)"
    ).matches;

}


function fxAmount(
    desktop,
    mobile
) {

    return isMobileLayout()
        ? mobile
        : desktop;

}


/* =========================================================
   31. CLEAR FX
   ========================================================= */

function clearDynamicFX() {

    if (rainLayer) {

        rainLayer.innerHTML =
            "";

    }


    if (worldParticles) {

        worldParticles.innerHTML =
            "";

    }


    clearDynamicVisualizer();

}


function clearDynamicVisualizer() {

    stopVisualizer();

    visualizerBars = [];

    visualizerPhases = [];


    if (visualizer) {

        visualizer.innerHTML =
            "";

    }

}


function clearWorldFX() {

    clearDynamicFX();

}


/* =========================================================
   32. VISUALIZER
   ========================================================= */

function createVisualizer() {

    if (!visualizer) return;


    clearDynamicVisualizer();


    const amount =
        isMobileLayout()
            ? 18
            : 30;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const bar =
            document.createElement(
                "div"
            );


        bar.className =
            "bar";


        bar.style.height =
            `${
                10 +
                Math.random() * 18
            }px`;


        visualizer.appendChild(
            bar
        );


        visualizerBars.push(
            bar
        );


        visualizerPhases.push(
            Math.random() *
            Math.PI *
            2
        );

    }


    startVisualizer();

}


function startVisualizer() {

    if (fxAnimationId)
        return;


    lastVisualizerTime =
        0;


    fxAnimationId =
        requestAnimationFrame(
            animateVisualizer
        );

}


function stopVisualizer() {

    if (!fxAnimationId)
        return;


    cancelAnimationFrame(
        fxAnimationId
    );


    fxAnimationId =
        null;

}


function animateVisualizer(
    timestamp
) {

    fxAnimationId =
        requestAnimationFrame(
            animateVisualizer
        );


    if (
        !state.inWorld ||
        visualizerBars.length === 0
    ) {

        return;

    }


    const interval =
        isMobileLayout()
            ? 65
            : 30;


    if (
        timestamp -
        lastVisualizerTime <
        interval
    ) {

        return;

    }


    lastVisualizerTime =
        timestamp;


    const playing =
        !audio.paused &&
        !audio.ended;


    for (
        let i = 0;
        i < visualizerBars.length;
        i++
    ) {

        const phase =
            visualizerPhases[i];


        const wave =
            Math.abs(
                Math.sin(
                    timestamp / 230 +
                    phase
                )
            );


        const secondWave =
            Math.abs(
                Math.sin(
                    timestamp / 410 +
                    phase * 1.7
                )
            );


        let height =
            10 +
            wave * 38 +
            secondWave * 15;


        if (!playing) {

            height =
                8 +
                wave * 10;

        }


        visualizerBars[i].style.height =
            `${height}px`;

    }

}


/* =========================================================
   33. PARTICLES
   ========================================================= */

function createParticles(
    amount
) {

    if (!worldParticles)
        return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        const size =
            2 +
            Math.random() * 4;


        particle.className =
            "world-particle";


        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;


        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.setProperty(
            "--time",
            `${
                4 +
                Math.random() * 7
            }s`
        );


        particle.style.animationDelay =
            `${
                Math.random() * 5
            }s`;


        worldParticles.appendChild(
            particle
        );

    }

}


/* =========================================================
   34. STARS
   ========================================================= */

function createStars(
    amount
) {

    if (!worldParticles)
        return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const star =
            document.createElement(
                "div"
            );


        const size =
            1 +
            Math.random() * 3;


        star.className =
            "star";


        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;


        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 70}%`;


        star.style.setProperty(
            "--time",
            `${
                1.5 +
                Math.random() * 3
            }s`
        );


        star.style.animationDelay =
            `${
                Math.random() * 3
            }s`;


        worldParticles.appendChild(
            star
        );

    }

}


/* =========================================================
   35. RAIN
   ========================================================= */

function createRain(
    amount
) {

    if (!rainLayer)
        return;


    rainLayer.innerHTML =
        "";


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const drop =
            document.createElement(
                "div"
            );


        drop.className =
            "rain-drop";


        drop.style.left =
            `${Math.random() * 100}%`;

        drop.style.top =
            `${
                -30 -
                Math.random() * 100
            }%`;


        drop.style.height =
            `${
                15 +
                Math.random() * 20
            }px`;


        drop.style.setProperty(
            "--time",
            `${
                .5 +
                Math.random() * .6
            }s`
        );


        drop.style.animationDelay =
            `${
                Math.random() * 2
            }s`;


        rainLayer.appendChild(
            drop
        );

    }

}


/* =========================================================
   36. BUBBLES
   ========================================================= */

function createBubbles(
    amount
) {

    if (!worldParticles)
        return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const bubble =
            document.createElement(
                "div"
            );


        const size =
            4 +
            Math.random() * 14;


        bubble.className =
            "bubble";


        bubble.style.width =
            `${size}px`;

        bubble.style.height =
            `${size}px`;


        bubble.style.left =
            `${Math.random() * 100}%`;

        bubble.style.top =
            `${
                50 +
                Math.random() * 50
            }%`;


        bubble.style.setProperty(
            "--time",
            `${
                5 +
                Math.random() * 6
            }s`
        );


        bubble.style.animationDelay =
            `${
                Math.random() * 5
            }s`;


        worldParticles.appendChild(
            bubble
        );

    }

}


/* =========================================================
   37. BIRDS
   ========================================================= */

function createBirds(
    amount
) {

    if (!worldParticles)
        return;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const bird =
            document.createElement(
                "div"
            );


        bird.className =
            "bird";


        bird.textContent =
            "⌁";


        bird.style.left =
            `${Math.random() * 100}%`;


        bird.style.top =
            `${
                10 +
                Math.random() * 40
            }%`;


        bird.style.fontSize =
            `${
                14 +
                Math.random() * 10
            }px`;


        bird.style.setProperty(
            "--time",
            `${
                7 +
                Math.random() * 6
            }s`
        );


        bird.style.animationDelay =
            `${
                Math.random() * 5
            }s`;


        worldParticles.appendChild(
            bird
        );

    }

}


/* =========================================================
   38. WORLD FX MANAGER
   ========================================================= */

function updateWorldFX() {

    if (
        !state.currentSong ||
        !worldScene
    ) {

        return;

    }


    clearDynamicFX();


    const world =
        state.currentSong.world;


    worldScene.dataset.world =
        world;


    /* DEFAULT */

    createParticles(
        fxAmount(35, 16)
    );


    /* SWAMP */

    if (
        world === "swamp"
    ) {

        createStars(
            fxAmount(60, 28)
        );

    }


    /* RAIN */

    if (
        world === "rain"
    ) {

        createRain(
            fxAmount(120, 45)
        );

    }


    /* ROAD */

    if (
        world === "road"
    ) {

        createStars(
            fxAmount(35, 18)
        );


        createParticles(
            fxAmount(25, 12)
        );

    }


    /* NEON */

    if (
        world === "neon"
    ) {

        createParticles(
            fxAmount(70, 30)
        );

    }


    /* DARK */

    if (
        world === "dark"
    ) {

        createParticles(
            fxAmount(25, 12)
        );

    }


    /* ROOM */

    if (
        world === "room"
    ) {

        createRain(
            fxAmount(65, 28)
        );


        createParticles(
            fxAmount(25, 12)
        );

    }


    /* RED */

    if (
        world === "red"
    ) {

        createParticles(
            fxAmount(65, 28)
        );

    }


    /* VHS */

    if (
        world === "vhs"
    ) {

        createParticles(
            fxAmount(30, 14)
        );

    }


    /* LUXURY */

    if (
        world === "luxury"
    ) {

        createStars(
            fxAmount(35, 18)
        );

    }


    /* LOVELY */

    if (
        world === "lovely"
    ) {

        createStars(
            fxAmount(65, 30)
        );

    }


    /* BIRDS */

    if (
        world === "birds"
    ) {

        createStars(
            fxAmount(90, 38)
        );


        createBirds(
            fxAmount(8, 4)
        );

    }


    /* OCEAN */

    if (
        world === "ocean"
    ) {

        createBubbles(
            fxAmount(40, 18)
        );


        createParticles(
            fxAmount(30, 14)
        );

    }


    /* STARBOY */

    if (
        world === "starboy"
    ) {

        createParticles(
            fxAmount(55, 24)
        );


        createStars(
            fxAmount(25, 12)
        );

    }


    /* CALL OUT MY NAME */

    if (
        world === "callout"
    ) {

        createParticles(
            fxAmount(28, 12)
        );


        createStars(
            fxAmount(18, 8)
        );

    }


    /* ARIANA */

    if (
        world === "ariana"
    ) {

        createParticles(
            fxAmount(44, 20)
        );


        createStars(
            fxAmount(32, 14)
        );

    }


    createVisualizer();

}


/* =========================================================
   39. KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const targetTag =
            event.target?.tagName;


        const isTyping =
            targetTag === "INPUT" ||
            targetTag === "TEXTAREA" ||
            targetTag === "SELECT";


        if (isTyping)
            return;


        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            toggleMusic();

        }


        if (
            event.code ===
            "ArrowRight"
        ) {

            nextSong();

        }


        if (
            event.code ===
            "ArrowLeft"
        ) {

            previousSong();

        }


        if (
            event.code ===
            "Escape"
        ) {

            if (state.inWorld) {

                backToSongs();

            }

        }

    }
);


/* =========================================================
   40. PLAYER SEEK EVENT
   ========================================================= */

if (playerLine) {

    playerLine.addEventListener(
        "click",
        seekFromPointer
    );

}


/* =========================================================
   41. WINDOW RESIZE
   ========================================================= */

let resizeTimer = null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    if (
                        state.inWorld
                    ) {

                        updateWorldFX();

                    }


                    moveCat();

                },
                180
            );

    }
);


/* =========================================================
   42. GLOBAL FUNCTIONS
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

window.secretClick =
    secretClick;


/* =========================================================
   43. STARTUP
   ========================================================= */

moveCat();

updatePlayButton();

updateCatDance();


console.log(
    "🌌 MUSIC WORLD 3.0 STARTED"
);

console.log(
    "🎵 Total songs:",
    songs.length
);

console.log(
    "🎧 Audio system ready"
);

console.log(
    "📱 PC + MOBILE responsive mode ready"
);

console.log(
    "🍑 Ariana Grande / bye added"
);