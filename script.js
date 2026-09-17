/* =========================================================
   🌌 MUSIC WORLD
   FINAL JAVASCRIPT
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
   REPEAT
   IMPORTANT:
   NOT inside state
   0 = OFF
   1 = REPEAT SONG
   2 = REPEAT ALL
   ========================================================= */

let repeatMode = 0;


/* =========================================================
   2. DOM
   ========================================================= */

const scenes =
    document.querySelectorAll(".scene");

const worldScene =
    document.getElementById(
        "worldScene"
    );

const cat =
    document.getElementById(
        "cat"
    );

const catHint =
    document.getElementById(
        "catHint"
    );

const catStatus =
    document.getElementById(
        "catStatus"
    );

const toast =
    document.getElementById(
        "toast"
    );

const visualizer =
    document.getElementById(
        "visualizer"
    );

const rainLayer =
    document.getElementById(
        "rainLayer"
    );

const worldParticles =
    document.getElementById(
        "worldParticles"
    );

const playerLine =
    document.getElementById(
        "playerLine"
    );

const progressFill =
    document.getElementById(
        "progressFill"
    );

const byeCar =
    document.getElementById(
        "byeCar"
    );

const repeatLabel =
    document.getElementById(
        "repeatLabel"
    );

const playerStatus =
    document.getElementById(
        "playerStatus"
    );


/* =========================================================
   3. TOAST
   ========================================================= */

let toastTimer = null;


function showToast(message) {

    if (!toast)
        return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2000);
}


/* =========================================================
   4. AUDIO
   ========================================================= */

const audio =
    new Audio();


audio.preload =
    "auto";


audio.volume =
    state.volume;


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

    /* ARIANA GRANDE */

    "bye":
        "music/bye.mp3"
};


/* =========================================================
   6. SONG DATABASE
   ========================================================= */

const songs = [

    /* PERSIAN OLD */

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


    /* PERSIAN NEW */

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


    /* THE WEEKND */

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


    /* BILLIE */

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


    /* ARIANA GRANDE */

    {
        title: "bye",
        artist: "Ariana Grande",
        world: "ariana",
        description:
            "شب سینمایی، نورهای صورتی و بنفش و یک ماشین که روی نوار آهنگ حرکت می‌کند."
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

        scene.classList.remove(
            "active"
        );

    });


    scenes[number].classList.add(
        "active"
    );


    state.currentScene =
        number;


    state.inWorld =
        false;


    clearWorldFX();

    moveCat();
}


/* =========================================================
   8. START
   ========================================================= */

function startWorld() {

    goToScene(2);
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

        1: 2,

        2: 0,

        3: 1,

        4: 3,

        5: 3,

        6: 1,

        7: 6,

        8: 6
    };


    const parent =
        parents[
            state.currentScene
        ];


    if (
        parent !== undefined
    ) {

        goToScene(
            parent
        );
    }
}


/* =========================================================
   10. LANGUAGE
   ========================================================= */

function chooseLanguage(
    language
) {

    state.language =
        language;


    if (
        language === "persian"
    ) {

        goToScene(3);

    } else {

        goToScene(6);
    }
}


/* =========================================================
   11. PERSIAN AGE
   ========================================================= */

function choosePersianAge(
    age
) {

    state.persianAge =
        age;


    if (
        age === "old"
    ) {

        goToScene(4);

    } else {

        goToScene(5);
    }
}


/* =========================================================
   12. ENGLISH PATH
   ========================================================= */

function chooseEnglishGender(
    gender
) {

    state.englishGender =
        gender;


    if (
        gender === "male"
    ) {

        goToScene(7);

    } else {

        goToScene(8);
    }
}


/* =========================================================
   13. NO BUTTON
   ========================================================= */

function noAnswer() {

    state.noClicks++;


    const text =
        document.getElementById(
            "noText"
        );

    const button =
        document.getElementById(
            "noButton"
        );


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
            `translate(
                ${x}px,
                ${y}px
            )
            rotate(
                ${rotation}deg
            )`;
    }


    showToast(
        "گربه شاهد این تصمیم بود 😼"
    );
}


/* =========================================================
   14. FIND SONG
   ========================================================= */

function findSong(title) {

    return songs.find(
        song =>
            song.title === title
    );
}


/* =========================================================
   15. OPEN WORLD
   ========================================================= */

function openWorld(
    title,
    artistOverride = null,
    worldOverride = null
) {

    const song =
        findSong(title);


    if (!song) {

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
                item.title ===
                song.title
        );


    state.inWorld =
        true;


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

    const playerSongName =
        document.getElementById(
            "playerSongName"
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


    loadSong(
        state.currentSong
    );


    updateWorldFX();

    moveCat();

    updateByeCar(
        0
    );
}


/* =========================================================
   16. LOAD SONG
   ========================================================= */

function loadSong(song) {

    const file =
        audioFiles[
            song.title
        ];


    if (!file) {

        showToast(
            "فایل این آهنگ پیدا نشد ⚠️"
        );

        return;
    }


    audio.pause();


    audio.currentTime =
        0;


    audio.src =
        new URL(
            file,
            document.baseURI
        ).href;


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
}


/* =========================================================
   17. PLAY / PAUSE
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
                    "PLAY ERROR:",
                    error
                );

                showToast(
                    "آهنگ پخش نشد ⚠️"
                );
            });

    } else {

        audio.pause();
    }
}


/* =========================================================
   18. PLAY BUTTON
   ========================================================= */

function updatePlayButton() {

    const button =
        document.getElementById(
            "playButton"
        );


    if (!button)
        return;


    button.textContent =
        audio.paused
            ? "▶"
            : "⏸";
}


/* =========================================================
   19. VOLUME
   ========================================================= */

function changeVolume() {

    state.volume +=
        0.1;


    if (
        state.volume > 1
    ) {

        state.volume =
            0;
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
   20. PROGRESS
   ========================================================= */

function resetPlayerProgress() {

    if (progressFill) {

        progressFill.style.width =
            "0%";
    }

    updateByeCar(
        0
    );
}


function updatePlayerProgress() {

    if (!progressFill)
        return;


    if (
        !audio.duration ||
        Number.isNaN(
            audio.duration
        )
    ) {

        return;
    }


    const percent =
        (
            audio.currentTime /
            audio.duration
        ) * 100;


    progressFill.style.width =
        `${percent}%`;


    updateByeCar(
        percent
    );
}


/* =========================================================
   21. BYE CAR
   ========================================================= */

function updateByeCar(
    percent
) {

    if (!byeCar)
        return;


    if (
        !state.currentSong ||
        state.currentSong.title !==
        "bye"
    ) {

        byeCar.style.display =
            "none";

        return;
    }


    byeCar.style.display =
        "block";


    const safe =
        Math.max(
            0,
            Math.min(
                100,
                percent
            )
        );


    byeCar.style.left =
        `${safe}%`;
}


/* =========================================================
   22. SEEK
   ========================================================= */

function seekFromPointer(
    event
) {

    if (
        !audio.duration ||
        Number.isNaN(
            audio.duration
        )
    ) {

        return;
    }


    if (!playerLine)
        return;


    const rect =
        playerLine.getBoundingClientRect();


    const ratio =
        Math.max(
            0,
            Math.min(
                1,
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            )
        );


    audio.currentTime =
        ratio *
        audio.duration;


    updatePlayerProgress();
}


/* =========================================================
   23. REPEAT
   ========================================================= */

function cycleRepeatMode() {

    repeatMode++;


    if (
        repeatMode > 2
    ) {

        repeatMode =
            0;
    }


    updateRepeatUI();


    const messages = [

        "Repeat: OFF",

        "Repeat: SONG 🔂",

        "Repeat: ALL 🔁"
    ];


    showToast(
        messages[
            repeatMode
        ]
    );
}


function updateRepeatUI() {

    if (!repeatLabel)
        return;


    const labels = [

        "OFF",

        "SONG",

        "ALL"
    ];


    repeatLabel.textContent =
        labels[
            repeatMode
        ];
}


/* =========================================================
   24. AUDIO EVENTS
   ========================================================= */

audio.addEventListener(
    "loadeddata",
    () => {

        console.log(
            "✅ MP3 loaded:",
            audio.src
        );
    }
);


audio.addEventListener(
    "canplay",
    () => {

        if (playerStatus) {

            playerStatus.textContent =
                "READY";
        }
    }
);


audio.addEventListener(
    "timeupdate",
    updatePlayerProgress
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


        if (
            repeatMode === 1
        ) {

            audio.currentTime =
                0;

            audio.play()
                .catch(() => {});

            return;
        }


        if (
            repeatMode === 2
        ) {

            nextSong();

            return;
        }


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
            "❌ AUDIO ERROR:",
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
   25. CAT DANCE
   ========================================================= */

function updateCatDance() {

    if (!cat)
        return;


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
   26. CAT POSITION
   ========================================================= */

function moveCat() {

    const guide =
        document.getElementById(
            "catGuide"
        );


    if (!guide)
        return;


    guide.style.right =
        "auto";


    if (state.inWorld) {

        guide.style.left =
            "auto";

        guide.style.right =
            "4%";

        guide.style.top =
            "58%";

        return;
    }


    const positions = [

        ["8%","15%"],

        ["82%","70%"],

        ["10%","70%"],

        ["80%","15%"],

        ["12%","75%"],

        ["84%","75%"],

        ["8%","25%"],

        ["82%","20%"],

        ["10%","50%"]
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
   27. CAT CLICK
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
   28. SECRET WORLD
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
        document.createElement(
            "div"
        );


    secret.id =
        "secretWorld";


    Object.assign(
        secret.style,
        {

            position: "fixed",

            inset: "0",

            zIndex: "9999",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            textAlign: "center",

            background:
                "#020207"

        }
    );


    secret.innerHTML = `

        <div style="
            width:min(520px,90%);
            padding:35px 24px;
            border:1px solid rgba(255,255,255,.08);
            border-radius:28px;
            background:rgba(10,10,18,.78);
            backdrop-filter:blur(18px);
            box-shadow:0 30px 90px rgba(0,0,0,.55);
        ">

            <div style="
                font-size:64px;
                margin-bottom:12px;
            ">
                🐈‍⬛
            </div>

            <h2>
                SECRET WORLD
            </h2>

            <p style="
                color:rgba(255,255,255,.55);
            ">
                پس بالاخره پیدام کردی... 👀
            </p>

            <button
                class="main-btn"
                id="closeSecret"
                type="button"
            >
                برگشت 🌌
            </button>

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
   29. BACK TO SONGS
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
   30. NEXT SONG
   ========================================================= */

function nextSong() {

    if (
        state.currentSongIndex <
        0
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
   31. PREVIOUS SONG
   ========================================================= */

function previousSong() {

    if (
        state.currentSongIndex <
        0
    ) {

        return;
    }


    let index =
        state.currentSongIndex - 1;


    if (
        index < 0
    ) {

        index =
            songs.length - 1;
    }


    openWorld(
        songs[index].title
    );
}


/* =========================================================
   32. DYNAMIC FX
   ========================================================= */

let fxAnimationId =
    null;

let visualizerBars =
    [];

let visualizerPhases =
    [];

let lastVisualizerTime =
    0;


/* =========================================================
   33. MOBILE
   ========================================================= */

function isMobileLayout() {

    return window.matchMedia(
        "(max-width:700px)"
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
   34. CLEAR FX
   ========================================================= */

function clearDynamicFX() {

    if (rainLayer) {

        rainLayer.innerHTML =
            "";

        rainLayer.style.opacity =
            "0";
    }


    if (worldParticles) {

        worldParticles.innerHTML =
            "";
    }


    clearDynamicVisualizer();
}


function clearDynamicVisualizer() {

    stopVisualizer();


    visualizerBars =
        [];

    visualizerPhases =
        [];


    if (visualizer) {

        visualizer.innerHTML =
            "";
    }
}


function clearWorldFX() {

    clearDynamicFX();
}


/* =========================================================
   35. VISUALIZER
   ========================================================= */

function createVisualizer() {

    if (!visualizer)
        return;


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


/* =========================================================
   36. VISUALIZER LOOP
   ========================================================= */

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


        const wave2 =
            Math.abs(
                Math.sin(
                    timestamp / 410 +
                    phase * 1.7
                )
            );


        let height =
            10 +
            wave * 38 +
            wave2 * 15;


        if (!playing) {

            height =
                8 +
                wave * 10;
        }


        visualizerBars[i]
            .style.height =
            `${height}px`;
    }
}


/* =========================================================
   37. PARTICLES
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
            `${4 + Math.random() * 7}s`
        );


        particle.style.animationDelay =
            `${Math.random() * 5}s`;


        worldParticles.appendChild(
            particle
        );
    }
}


/* =========================================================
   38. STARS
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
            `${1.5 + Math.random() * 3}s`
        );


        star.style.animationDelay =
            `${Math.random() * 3}s`;


        worldParticles.appendChild(
            star
        );
    }
}


/* =========================================================
   39. RAIN
   ========================================================= */

function createRain(
    amount
) {

    if (!rainLayer)
        return;


    rainLayer.innerHTML =
        "";


    rainLayer.style.opacity =
        "1";


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
            `${-30 - Math.random() * 100}%`;


        drop.style.height =
            `${15 + Math.random() * 20}px`;


        drop.style.setProperty(
            "--time",
            `${.5 + Math.random() * .6}s`
        );


        drop.style.animationDelay =
            `${Math.random() * 2}s`;


        rainLayer.appendChild(
            drop
        );
    }
}


/* =========================================================
   40. BUBBLES
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
            `${50 + Math.random() * 50}%`;


        bubble.style.setProperty(
            "--time",
            `${5 + Math.random() * 6}s`
        );


        bubble.style.animationDelay =
            `${Math.random() * 5}s`;


        worldParticles.appendChild(
            bubble
        );
    }
}


/* =========================================================
   41. BIRDS
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


        bird.style.setProperty(
            "--time",
            `${7 + Math.random() * 6}s`
        );


        bird.style.animation =
            `mwBird ${
                7 + Math.random() * 6
            }s linear infinite`;


        bird.style.animationDelay =
            `${Math.random() * 5}s`;


        worldParticles.appendChild(
            bird
        );
    }
}


/* =========================================================
   42. SPECIAL GLOWS
   ========================================================= */

function createSpecialGlow(
    type
) {

    if (!worldParticles)
        return;


    const glow =
        document.createElement(
            "div"
        );


    glow.style.position =
        "absolute";


    glow.style.width =
        type === "starboy"
            ? "260px"
            : "220px";


    glow.style.height =
        glow.style.width;


    glow.style.left =
        "50%";


    glow.style.top =
        "50%";


    glow.style.transform =
        "translate(-50%,-50%)";


    glow.style.borderRadius =
        "50%";


    glow.style.pointerEvents =
        "none";


    if (
        type === "starboy"
    ) {

        glow.style.background =
            "radial-gradient(circle,rgba(255,0,80,.10),transparent 70%)";

        glow.style.animation =
            "mwStarboyGlow 4s ease-in-out infinite";

    } else {

        glow.style.background =
            "radial-gradient(circle,rgba(255,30,70,.07),transparent 70%)";

        glow.style.animation =
            "mwCallOutGlow 5s ease-in-out infinite";
    }


    worldParticles.appendChild(
        glow
    );
}


/* =========================================================
   43. WORLD FX MANAGER
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
        fxAmount(35,16)
    );


    /* SWAMP */

    if (
        world === "swamp"
    ) {

        createStars(
            fxAmount(60,28)
        );
    }


    /* RAIN */

    if (
        world === "rain"
    ) {

        createRain(
            fxAmount(120,45)
        );
    }


    /* ROAD */

    if (
        world === "road"
    ) {

        createStars(
            fxAmount(35,18)
        );

        createParticles(
            fxAmount(25,12)
        );
    }


    /* NEON */

    if (
        world === "neon"
    ) {

        createParticles(
            fxAmount(70,30)
        );
    }


    /* DARK */

    if (
        world === "dark"
    ) {

        createParticles(
            fxAmount(25,12)
        );
    }


    /* ROOM */

    if (
        world === "room"
    ) {

        createRain(
            fxAmount(65,28)
        );

        createParticles(
            fxAmount(25,12)
        );
    }


    /* RED */

    if (
        world === "red"
    ) {

        createParticles(
            fxAmount(65,28)
        );
    }


    /* VHS */

    if (
        world === "vhs"
    ) {

        createParticles(
            fxAmount(30,14)
        );
    }


    /* LUXURY */

    if (
        world === "luxury"
    ) {

        createStars(
            fxAmount(35,18)
        );
    }


    /* LOVELY */

    if (
        world === "lovely"
    ) {

        createStars(
            fxAmount(65,30)
        );
    }


    /* BIRDS */

    if (
        world === "birds"
    ) {

        createStars(
            fxAmount(90,38)
        );

        createBirds(
            fxAmount(8,4)
        );
    }


    /* OCEAN */

    if (
        world === "ocean"
    ) {

        createBubbles(
            fxAmount(40,18)
        );

        createParticles(
            fxAmount(30,14)
        );
    }


    /* STARBOY */

    if (
        world === "starboy"
    ) {

        createParticles(
            fxAmount(55,24)
        );

        createStars(
            fxAmount(25,12)
        );

        createSpecialGlow(
            "starboy"
        );
    }


    /* CALL OUT */

    if (
        world === "callout"
    ) {

        createParticles(
            fxAmount(28,12)
        );

        createStars(
            fxAmount(18,8)
        );

        createSpecialGlow(
            "callout"
        );
    }


    /* ARIANA / BYE */

    if (
        world === "ariana"
    ) {

        createParticles(
            fxAmount(44,20)
        );

        createStars(
            fxAmount(32,14)
        );
    }


    createVisualizer();
}


/* =========================================================
   44. DYNAMIC FX CSS
   ========================================================= */

function addWorldFXStyles() {

    if (
        document.getElementById(
            "musicWorldFXStyles"
        )
    ) {

        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "musicWorldFXStyles";


    style.textContent = `

        @keyframes mwBird {

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


        @keyframes mwStarboyGlow {

            0%,100% {

                transform:
                    translate(-50%,-50%)
                    scale(.85);

                opacity: .25;
            }

            50% {

                transform:
                    translate(-50%,-50%)
                    scale(1.15);

                opacity: .85;
            }
        }


        @keyframes mwCallOutGlow {

            0%,100% {

                transform:
                    translate(-50%,-50%)
                    scale(.9);

                opacity: .25;
            }

            50% {

                transform:
                    translate(-50%,-50%)
                    scale(1.18);

                opacity: .75;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


/* =========================================================
   45. KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const tag =
            event.target?.tagName;


        if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            tag === "SELECT"
        ) {

            return;
        }


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

            if (
                state.inWorld
            ) {

                backToSongs();
            }
        }
    }
);


/* =========================================================
   46. SEEK
   ========================================================= */

if (playerLine) {

    playerLine.addEventListener(
        "click",
        seekFromPointer
    );
}


/* =========================================================
   47. RESIZE
   ========================================================= */

let resizeTimer =
    null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(() => {

                if (
                    state.inWorld
                ) {

                    updateWorldFX();
                }


                moveCat();


            }, 180);
    }
);


/* =========================================================
   48. GLOBAL FUNCTIONS
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

window.secretEnding =
    secretEnding;

window.cycleRepeatMode =
    cycleRepeatMode;


/* =========================================================
   49. STARTUP
   ========================================================= */

addWorldFXStyles();

moveCat();

updatePlayButton();

updateRepeatUI();

updateCatDance();


console.log(
    "🌌 MUSIC WORLD STARTED"
);

console.log(
    "🎵 Songs:",
    songs.length
);

console.log(
    "🔂 Repeat system ready"
);

console.log(
    "🚗 BYE car progress system ready"
);

console.log(
    "🌙 Moon + 🌧️ Rain + 😼 Cat ready"
);