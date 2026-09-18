/* =========================================================
   MUSIC WORLD
   SOCIAL MUSIC UNIVERSE
   MAIN CLIENT
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const API_BASE = "http://localhost:3000/api";

let socket = null;


/* =========================================================
   AUDIO FILES
========================================================= */
const AUDIO_FILES = {
    swamp: "music/mordab.mp3",
    rain: "music/baran.mp3",
    road: "music/safar.mp3",
    neon: "music/24_7.mp3",
    dark: "music/hooman.mp3",
    room: "music/arta.mp3",
    sogand: "music/mariz ham.mp3",
    butterfly: "music/dasht parvaneh.mp3",

    oneOfTheGirls: "music/one of the girl.mp3",
    timeless: "music/timeless.mp3",
    luxury: "music/popular.mp3",
    starboy: "music/starboy.mp3",
    callOutMyName: "music/call out my name.mp3",

    lovely: "music/lovely.mp3",
    birdsOfAFeather: "music/Billie Eilish Birds of a Feather.mp3",

    bye: "music/bye.mp3"
};


/* =========================================================
   SONG DATABASE
========================================================= */

const songs = [

    {
        id: "swamp",
        title: "مرداب",
        artist: "Googoosh",
        language: "persian",
        world: "SWAMP",
        file: AUDIO_FILES.swamp
    },

    {
        id: "rain",
        title: "باران",
        artist: "Vigen",
        language: "persian",
        world: "RAIN",
        file: AUDIO_FILES.rain
    },

    {
        id: "road",
        title: "اگه یه روز بری سفر",
        artist: "Faramarz Aslani",
        language: "persian",
        world: "ROAD",
        file: AUDIO_FILES.road
    },

    {
        id: "neon",
        title: "24/7",
        artist: "AROWN",
        language: "persian",
        world: "NEON",
        file: AUDIO_FILES.neon
    },

    {
        id: "dark",
        title: "چشمت سیاه",
        artist: "Hoomaan",
        language: "persian",
        world: "DARK",
        file: AUDIO_FILES.dark
    },

    {
        id: "room",
        title: "خونه‌ی من",
        artist: "Arta",
        language: "persian",
        world: "ROOM",
        file: AUDIO_FILES.room
    },

    {
        id: "sogand",
        title: "مریض هم",
        artist: "Sogand",
        language: "persian",
        world: "SOGAND",
        file: AUDIO_FILES.sogand
    },

    {
        id: "butterfly",
        title: "دشت پروانه‌ها",
        artist: "Sogand",
        language: "persian",
        world: "BUTTERFLY",
        file: AUDIO_FILES.butterfly
    },


    {
        id: "oneOfTheGirls",
        title: "One Of The Girls",
        artist: "The Weeknd",
        language: "english",
        world: "THE WEEKND",
        file: AUDIO_FILES.oneOfTheGirls
    },

    {
        id: "red",
        title: "RED",
        artist: "The Weeknd",
        language: "english",
        world: "VHS",
        file: AUDIO_FILES.red
    },

    {
        id: "timeless",
        title: "Timeless",
        artist: "The Weeknd",
        language: "english",
        world: "VHS",
        file: AUDIO_FILES.timeless
    },

    {
        id: "luxury",
        title: "Popular",
        artist: "The Weeknd",
        language: "english",
        world: "LUXURY",
        file: AUDIO_FILES.luxury
    },

    {
        id: "starboy",
        title: "Starboy",
        artist: "The Weeknd",
        language: "english",
        world: "STARBOY",
        file: AUDIO_FILES.starboy
    },

    {
        id: "callOutMyName",
        title: "Call Out My Name",
        artist: "The Weeknd",
        language: "english",
        world: "CALL OUT",
        file: AUDIO_FILES.callOutMyName
    },

    {
        id: "lovely",
        title: "lovely",
        artist: "Billie Eilish",
        language: "english",
        world: "BIRDS",
        file: AUDIO_FILES.lovely
    },

    {
        id: "birdsOfAFeather",
        title: "BIRDS OF A FEATHER",
        artist: "Billie Eilish",
        language: "english",
        world: "BIRDS",
        file: AUDIO_FILES.birdsOfAFeather
    },

    {
        id: "oceanEyes",
        title: "ocean eyes",
        artist: "Billie Eilish",
        language: "english",
        world: "OCEAN",
        file: AUDIO_FILES.oceanEyes
    },

    {
        id: "bye",
        title: "bye",
        artist: "Ariana Grande",
        language: "english",
        world: "ARIANA",
        file: AUDIO_FILES.bye
    }

];


/* =========================================================
   STATE
========================================================= */

const state = {

    user: null,

    language: "all",

    currentSongIndex: -1,

    currentSong: null,

    isPlaying: false,

    volume: 1,

    favorites: [],

    friends: [],

    friendRequests: [],

    groups: [],

    currentGroup: null,

    globalMessages: [],

    groupMessages: [],

    onlineUsers: 0,

    currentView: "music",

    repeatMode: 0,

    catClicks: 0,

    listenTogether: null,

    lastNowPlayingUpdate: 0

};


/* =========================================================
   DOM
========================================================= */

const $ = (id) => document.getElementById(id);


/* Auth */

const authScreen = $("authScreen");
const mainScreen = $("mainScreen");

const registerForm = $("registerForm");
const loginForm = $("loginForm");

const registerUsername = $("registerUsername");
const registerEmail = $("registerEmail");
const registerPassword = $("registerPassword");

const loginEmail = $("loginEmail");
const loginPassword = $("loginPassword");

const authSwitch = $("authSwitch");


/* Navigation */

const navButtons =
    document.querySelectorAll(".nav-button");


const views = {
    music: $("musicView"),
    friends: $("friendsView"),
    chat: $("chatView"),
    groups: $("groupsView"),
    profile: $("profileView")
};


/* Music */

const songGrid = $("songGrid");
const favoritesGrid = $("favoritesGrid");
const favoritesCount = $("favoritesCount");

const languageButtons =
    document.querySelectorAll(".language-button");


/* Player */

const audioPlayer = $("audioPlayer");

const playerCover = $("playerCover");
const playerSongName = $("playerSongName");
const playerArtistName = $("playerArtistName");

const playerFavoriteButton =
    $("playerFavoriteButton");

const previousButton = $("previousButton");
const playButton = $("playButton");
const nextButton = $("nextButton");
const repeatButton = $("repeatButton");

const currentTimeElement = $("currentTime");
const progressBar = $("progressBar");
const durationElement = $("duration");

const volumeBar = $("volumeBar");


/* User */

const topbarAvatar = $("topbarAvatar");
const topbarUsername = $("topbarUsername");


/* Friends */

const userSearchInput = $("userSearchInput");
const userSearchButton = $("userSearchButton");

const userSearchResults = $("userSearchResults");

const friendsList = $("friendsList");
const friendsCount = $("friendsCount");

const friendRequestsList =
    $("friendRequestsList");

const friendRequestsCount =
    $("friendRequestsCount");


/* Chat */

const globalMessages = $("globalMessages");

const globalChatForm = $("globalChatForm");
const globalChatInput = $("globalChatInput");

const onlineUsersCount =
    $("onlineUsersCount");


/* Groups */

const groupsList = $("groupsList");
const createGroupButton = $("createGroupButton");

const groupRoom = $("groupRoom");

const groupRoomName = $("groupRoomName");
const groupRoomDescription =
    $("groupRoomDescription");

const inviteFriendsButton =
    $("inviteFriendsButton");

const groupMembers = $("groupMembers");
const groupMembersCount =
    $("groupMembersCount");

const groupMessages = $("groupMessages");

const groupChatForm = $("groupChatForm");
const groupChatInput = $("groupChatInput");

const groupListenTogetherButton =
    $("groupListenTogetherButton");


/* Profile */

const profileAvatar = $("profileAvatar");
const profileUsername = $("profileUsername");
const profileStatus = $("profileStatus");
const profileNowPlaying = $("profileNowPlaying");
const profileLastActive = $("profileLastActive");
const profileFriendsCount =
    $("profileFriendsCount");
const profileFavorites =
    $("profileFavorites");


/* User modal */

const userProfileModal =
    $("userProfileModal");

const userProfileName =
    $("userProfileName");

const userProfileAvatar =
    $("userProfileAvatar");

const userProfileStatus =
    $("userProfileStatus");

const userProfileNowPlaying =
    $("userProfileNowPlaying");

const userProfileLastActive =
    $("userProfileLastActive");

const userProfileFavorites =
    $("userProfileFavorites");

const addFriendButton =
    $("addFriendButton");

const messageUserButton =
    $("messageUserButton");


/* Group modal */

const createGroupModal =
    $("createGroupModal");

const createGroupForm =
    $("createGroupForm");

const groupNameInput =
    $("groupNameInput");

const groupDescriptionInput =
    $("groupDescriptionInput");


/* Invite modal */

const inviteFriendsModal =
    $("inviteFriendsModal");

const inviteFriendsList =
    $("inviteFriendsList");


/* Listen Together */

const listenTogetherView =
    $("listenTogetherView");

const listenRoomName =
    $("listenRoomName");

const listenTrackCover =
    $("listenTrackCover");

const listenTrackName =
    $("listenTrackName");

const listenTrackArtist =
    $("listenTrackArtist");

const syncStatusDot =
    $("syncStatusDot");

const syncStatusText =
    $("syncStatusText");

const listenMembers =
    $("listenMembers");

const listenMembersCount =
    $("listenMembersCount");

const listenPlayButton =
    $("listenPlayButton");

const listenPauseButton =
    $("listenPauseButton");

const listenNextButton =
    $("listenNextButton");

const leaveListenButton =
    $("leaveListenButton");


/* Cat */

const cat =
    $("cat");

const catStatus =
    $("catStatus");

const catProgress =
    $("catProgress");

const catHint =
    $("catHint");


/* Toast */

const toast =
    $("toast");


/* =========================================================
   UTILITY
========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function getInitials(name) {

    if (!name) {
        return "?";
    }

    const parts =
        String(name)
            .trim()
            .split(/\s+/);

    if (parts.length === 1) {
        return parts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${minutes}:${remaining}`;
}


function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2600);
}


function showAuth() {

    authScreen.classList.remove("hidden");
    mainScreen.classList.add("hidden");
}


function showMain() {

    authScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
}


async function api(
    endpoint,
    options = {}
) {

    const config = {
        credentials: "include",
        ...options
    };

    config.headers = {
        ...(options.body
            ? {
                "Content-Type":
                    "application/json"
            }
            : {}),
        ...(options.headers || {})
    };

    const response =
        await fetch(
            `${API_BASE}${endpoint}`,
            config
        );

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            "Request failed"
        );
    }

    return data;
}


/* =========================================================
   AUTH
========================================================= */

function updateAuthSwitch() {

    const registerVisible =
        !registerForm.classList.contains("hidden");

    if (registerVisible) {

        authSwitch.textContent =
            "Already have an account? Log in";

    } else {

        authSwitch.textContent =
            "Don't have an account? Create one";

    }
}


authSwitch.addEventListener(
    "click",
    () => {

        const registerVisible =
            !registerForm.classList.contains("hidden");

        if (registerVisible) {

            registerForm.classList.add("hidden");
            loginForm.classList.remove("hidden");

        } else {

            loginForm.classList.add("hidden");
            registerForm.classList.remove("hidden");

        }

        updateAuthSwitch();
    }
);


registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const username =
            registerUsername.value.trim();

        const email =
            registerEmail.value.trim();

        const password =
            registerPassword.value;

        if (
            username.length < 3 ||
            username.length > 30
        ) {

            showToast(
                "Username must be 3–30 characters."
            );

            return;
        }

        if (password.length < 8) {

            showToast(
                "Password must contain at least 8 characters."
            );

            return;
        }

        const button =
            registerForm.querySelector(
                "button[type='submit']"
            );

        const original =
            button.innerHTML;

        button.disabled = true;
        button.textContent =
            "CREATING...";

        try {

            const result =
                await api(
                    "/auth/register",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            username,
                            email,
                            password
                        })
                    }
                );

            state.user =
                result.user;

            registerForm.reset();

            await initializeAfterLogin();

            showToast(
                "Account created successfully."
            );

        } catch (error) {

            showToast(
                error.message
            );

        } finally {

            button.disabled = false;
            button.innerHTML = original;

        }
    }
);


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;

        const button =
            loginForm.querySelector(
                "button[type='submit']"
            );

        const original =
            button.innerHTML;

        button.disabled = true;
        button.textContent =
            "LOGGING IN...";

        try {

            const result =
                await api(
                    "/auth/login",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

            state.user =
                result.user;

            loginForm.reset();

            await initializeAfterLogin();

            showToast(
                "Welcome back."
            );

        } catch (error) {

            showToast(
                error.message
            );

        } finally {

            button.disabled = false;
            button.innerHTML = original;

        }
    }
);


async function checkSession() {

    try {

        const result =
            await api("/auth/me");

        if (result.user) {

            state.user =
                result.user;

            await initializeAfterLogin();

            return true;
        }

    } catch {
        // No active session.
    }

    showAuth();

    return false;
}


async function logout() {

    try {

        await api(
            "/auth/logout",
            {
                method: "POST"
            }
        );

    } catch {
        // Continue clearing local state.
    }

    state.user = null;
    state.favorites = [];
    state.friends = [];
    state.friendRequests = [];
    state.groups = [];
    state.currentGroup = null;

    if (socket) {

        socket.disconnect();
        socket = null;

    }

    audioPlayer.pause();

    audioPlayer.removeAttribute("src");
    audioPlayer.load();

    state.currentSong = null;
    state.currentSongIndex = -1;
    state.isPlaying = false;

    showAuth();

    showToast(
        "You have been logged out."
    );
}


/* =========================================================
   USER UI
========================================================= */

function updateUserUI() {

    if (!state.user) {
        return;
    }

    const username =
        state.user.username ||
        "User";

    const initials =
        getInitials(username);

    topbarUsername.textContent =
        username;

    topbarAvatar.textContent =
        initials;

    profileUsername.textContent =
        username;

    profileAvatar.textContent =
        initials;

    profileStatus.textContent =
        state.user.online === false
            ? "Offline"
            : "Online";

    profileFriendsCount.textContent =
        state.friends.length;

    profileFavorites.textContent =
        state.favorites.length;

    profileLastActive.textContent =
        state.user.lastActive
            ? formatLastActive(
                state.user.lastActive
            )
            : "Now";
}


function formatLastActive(value) {

    if (!value) {
        return "Unknown";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    const diff =
        Date.now() - date.getTime();

    const seconds =
        Math.floor(diff / 1000);

    if (seconds < 30) {
        return "Just now";
    }

    const minutes =
        Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours =
        Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hr ago`;
    }

    const days =
        Math.floor(hours / 24);

    return `${days} day${days === 1 ? "" : "s"} ago`;
}


/* =========================================================
   NAVIGATION
========================================================= */

function switchView(viewName) {

    if (!views[viewName]) {
        return;
    }

    state.currentView =
        viewName;

    Object.entries(views)
        .forEach(
            ([name, element]) => {

                element.classList.toggle(
                    "hidden",
                    name !== viewName
                );

            }
        );

    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.view === viewName
        );

    });

    if (viewName === "friends") {
        loadFriendsData();
    }

    if (viewName === "chat") {
        loadGlobalMessages();
    }

    if (viewName === "groups") {
        loadGroups();
    }

    if (viewName === "profile") {
        loadProfile();
    }
}


navButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            switchView(
                button.dataset.view
            );

        }
    );

});


/* =========================================================
   MUSIC RENDERING
========================================================= */

function getFilteredSongs() {

    if (state.language === "all") {
        return songs;
    }

    return songs.filter(
        song =>
            song.language ===
            state.language
    );
}


function isFavorite(songId) {

    return state.favorites.some(
        favorite => {

            if (typeof favorite === "string") {
                return favorite === songId;
            }

            return (
                favorite.songId === songId ||
                favorite.id === songId
            );
        }
    );
}


function renderSongs() {

    const filtered =
        getFilteredSongs();

    songGrid.innerHTML =
        filtered.map(song => {

            const favorite =
                isFavorite(song.id);

            return `
                <article
                    class="song-card"
                    data-song-id="${escapeHTML(song.id)}"
                >

                    <span class="song-world">
                        ${escapeHTML(song.world)}
                    </span>

                    <button
                        class="favorite-button ${favorite ? "active" : ""}"
                        data-favorite-song="${escapeHTML(song.id)}"
                        type="button"
                        title="Favorite"
                    >
                        ${favorite ? "♥" : "♡"}
                    </button>

                    <h3>
                        ${escapeHTML(song.title)}
                    </h3>

                    <p>
                        ${escapeHTML(song.artist)}
                    </p>

                </article>
            `;

        }).join("");
}


function renderFavorites() {

    const favoriteSongs =
        songs.filter(
            song =>
                isFavorite(song.id)
        );

    favoritesCount.textContent =
        favoriteSongs.length;

    if (!favoriteSongs.length) {

        favoritesGrid.innerHTML = `
            <div class="empty-state">
                No favorite songs yet.
            </div>
        `;

        return;
    }

    favoritesGrid.innerHTML =
        favoriteSongs.map(song => {

            return `
                <article
                    class="song-card"
                    data-song-id="${escapeHTML(song.id)}"
                >

                    <span class="song-world">
                        ${escapeHTML(song.world)}
                    </span>

                    <button
                        class="favorite-button active"
                        data-favorite-song="${escapeHTML(song.id)}"
                        type="button"
                    >
                        ♥
                    </button>

                    <h3>
                        ${escapeHTML(song.title)}
                    </h3>

                    <p>
                        ${escapeHTML(song.artist)}
                    </p>

                </article>
            `;

        }).join("");
}


function renderAllMusic() {

    renderSongs();
    renderFavorites();

}


/* =========================================================
   LANGUAGE
========================================================= */

languageButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            state.language =
                button.dataset.language;

            languageButtons.forEach(
                item =>
                    item.classList.toggle(
                        "active",
                        item === button
                    )
            );

            renderSongs();

        }
    );

});


/* =========================================================
   SONG SELECTION
========================================================= */

function findSongIndex(songId) {

    return songs.findIndex(
        song =>
            song.id === songId
    );
}


function selectSong(songId) {

    const index =
        findSongIndex(songId);

    if (index === -1) {
        return;
    }

    loadSong(
        index,
        true
    );
}


function loadSong(
    index,
    autoplay = false
) {

    if (
        index < 0 ||
        index >= songs.length
    ) {
        return;
    }

    const song =
        songs[index];

    state.currentSongIndex =
        index;

    state.currentSong =
        song;

    const file =
        new URL(
            song.file,
            document.baseURI
        ).href;

    audioPlayer.src = file;

    audioPlayer.volume =
        state.volume;

    playerSongName.textContent =
        song.title;

    playerArtistName.textContent =
        song.artist;

    playerCover.src =
        getSongCover(song);

    updateFavoritePlayerButton();

    updateNowPlayingText();

    if (autoplay) {

        playCurrentSong();

    } else {

        updatePlayButton();

    }

}


function getSongCover(song) {

    /*
     * If you later add real cover images,
     * simply return their path here.
     */

    return createGradientCover(
        song.title,
        song.artist
    );
}


function createGradientCover(
    title,
    artist
) {

    const safeTitle =
        encodeURIComponent(
            String(title)
                .slice(0, 18)
        );

    const safeArtist =
        encodeURIComponent(
            String(artist)
                .slice(0, 18)
        );

    return `
        data:image/svg+xml;charset=UTF-8,
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="500"
            height="500"
            viewBox="0 0 500 500"
        >
            <defs>
                <linearGradient
                    id="g"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stop-color="#9b5cff"
                    />
                    <stop
                        offset="100%"
                        stop-color="#ff4fd8"
                    />
                </linearGradient>
            </defs>

            <rect
                width="500"
                height="500"
                fill="#05050c"
            />

            <circle
                cx="410"
                cy="90"
                r="180"
                fill="url(#g)"
                opacity="0.75"
            />

            <circle
                cx="80"
                cy="440"
                r="160"
                fill="#3e8cff"
                opacity="0.4"
            />

            <text
                x="35"
                y="390"
                fill="white"
                font-family="Arial"
                font-size="34"
                font-weight="700"
            >
                ${safeTitle}
            </text>

            <text
                x="35"
                y="430"
                fill="#d4ccef"
                font-family="Arial"
                font-size="19"
            >
                ${safeArtist}
            </text>
        </svg>
    `.replace(/\s+/g, " ");
}


/* =========================================================
   PLAYER
========================================================= */

async function playCurrentSong() {

    if (!state.currentSong) {

        if (songs.length) {
            loadSong(0, false);
        }

        return;
    }

    try {

        await audioPlayer.play();

        state.isPlaying = true;

        updatePlayButton();

        await updateNowPlaying();

    } catch (error) {

        console.error(
            "Playback error:",
            error
        );

        showToast(
            "The audio file could not be played."
        );

    }
}


function pauseCurrentSong() {

    audioPlayer.pause();

    state.isPlaying = false;

    updatePlayButton();

    updateNowPlaying();

}


function toggleMusic() {

    if (!state.currentSong) {

        loadSong(0, true);

        return;
    }

    if (audioPlayer.paused) {

        playCurrentSong();

    } else {

        pauseCurrentSong();

    }
}


function updatePlayButton() {

    playButton.textContent =
        audioPlayer.paused
            ? "▶"
            : "❚❚";
}


function updateFavoritePlayerButton() {

    if (!state.currentSong) {

        playerFavoriteButton.textContent =
            "♡";

        return;
    }

    playerFavoriteButton.textContent =
        isFavorite(
            state.currentSong.id
        )
            ? "♥"
            : "♡";

    playerFavoriteButton.style.color =
        isFavorite(
            state.currentSong.id
        )
            ? "#ff5ca8"
            : "";
}


function updateNowPlayingText() {

    if (!state.currentSong) {

        profileNowPlaying.textContent =
            "Nothing";

        return;
    }

    profileNowPlaying.textContent =
        `${state.currentSong.title} — ${state.currentSong.artist}`;
}


async function updateNowPlaying() {

    if (!state.user) {
        return;
    }

    const now =
        Date.now();

    if (
        now -
        state.lastNowPlayingUpdate <
        1500
    ) {
        return;
    }

    state.lastNowPlayingUpdate =
        now;

    try {

        await api(
            "/users/me/now-playing",
            {
                method: "POST",

                body: JSON.stringify({
                    songId:
                        state.isPlaying &&
                        state.currentSong
                            ? state.currentSong.id
                            : null,

                    isPlaying:
                        state.isPlaying
                })
            }
        );

    } catch (error) {

        console.warn(
            "Now playing update failed:",
            error.message
        );

    }
}


function nextSong(autoPlay = true) {

    if (!songs.length) {
        return;
    }

    if (
        state.currentSongIndex ===
        songs.length - 1
    ) {

        if (state.repeatMode === 2) {

            loadSong(0, autoPlay);

            return;
        }

        state.currentSongIndex = -1;

        state.currentSong = null;

        audioPlayer.pause();

        audioPlayer.removeAttribute("src");
        audioPlayer.load();

        state.isPlaying = false;

        updatePlayButton();

        playerSongName.textContent =
            "Nothing";

        playerArtistName.textContent =
            "—";

        updateNowPlaying();

        showToast(
            "Playlist finished."
        );

        return;
    }

    loadSong(
        state.currentSongIndex + 1,
        autoPlay
    );
}


function previousSong() {

    if (!songs.length) {
        return;
    }

    if (
        audioPlayer.currentTime >
        3
    ) {

        audioPlayer.currentTime = 0;

        return;
    }

    let index =
        state.currentSongIndex - 1;

    if (index < 0) {

        index =
            songs.length - 1;

    }

    loadSong(
        index,
        true
    );
}


function cycleRepeat() {

    state.repeatMode =
        (state.repeatMode + 1) % 3;

    updateRepeatButton();

    const messages = [
        "Repeat: OFF",
        "Repeat: SONG",
        "Repeat: ALL"
    ];

    showToast(
        messages[state.repeatMode]
    );
}


function updateRepeatButton() {

    if (state.repeatMode === 0) {

        repeatButton.textContent =
            "↻";

        repeatButton.title =
            "Repeat Off";

    } else if (
        state.repeatMode === 1
    ) {

        repeatButton.textContent =
            "↻¹";

        repeatButton.title =
            "Repeat Song";

    } else {

        repeatButton.textContent =
            "↻∞";

        repeatButton.title =
            "Repeat All";
    }
}


/* =========================================================
   AUDIO EVENTS
========================================================= */

audioPlayer.addEventListener(
    "play",
    () => {

        state.isPlaying = true;

        updatePlayButton();

        updateNowPlaying();

    }
);


audioPlayer.addEventListener(
    "pause",
    () => {

        state.isPlaying = false;

        updatePlayButton();

        updateNowPlaying();

    }
);


audioPlayer.addEventListener(
    "loadedmetadata",
    () => {

        durationElement.textContent =
            formatTime(
                audioPlayer.duration
            );

    }
);


audioPlayer.addEventListener(
    "timeupdate",
    () => {

        if (
            !Number.isFinite(
                audioPlayer.duration
            )
        ) {
            return;
        }

        const percentage =
            (
                audioPlayer.currentTime /
                audioPlayer.duration
            ) * 100;

        progressBar.value =
            percentage;

        currentTimeElement.textContent =
            formatTime(
                audioPlayer.currentTime
            );

    }
);


audioPlayer.addEventListener(
    "ended",
    () => {

        if (state.repeatMode === 1) {

            audioPlayer.currentTime = 0;

            playCurrentSong();

            return;
        }

        nextSong(true);

    }
);


progressBar.addEventListener(
    "input",
    () => {

        if (
            !Number.isFinite(
                audioPlayer.duration
            )
        ) {
            return;
        }

        audioPlayer.currentTime =
            (
                Number(progressBar.value) /
                100
            ) *
            audioPlayer.duration;

    }
);


volumeBar.addEventListener(
    "input",
    () => {

        state.volume =
            Number(volumeBar.value);

        audioPlayer.volume =
            state.volume;

    }
);


playButton.addEventListener(
    "click",
    toggleMusic
);

previousButton.addEventListener(
    "click",
    previousSong
);

nextButton.addEventListener(
    "click",
    () => nextSong(true)
);

repeatButton.addEventListener(
    "click",
    cycleRepeat
);

playerFavoriteButton.addEventListener(
    "click",
    () => {

        if (state.currentSong) {

            toggleFavorite(
                state.currentSong.id
            );

        }

    }
);


/* =========================================================
   FAVORITES
========================================================= */

async function loadFavorites() {

    try {

        const result =
            await api(
                "/favorites"
            );

        state.favorites =
            result.favorites ||
            [];

        renderAllMusic();

        updateFavoritePlayerButton();

        updateUserUI();

    } catch (error) {

        console.warn(
            "Favorites could not be loaded:",
            error.message
        );

    }
}


async function toggleFavorite(songId) {

    if (!state.user) {

        showToast(
            "Please log in first."
        );

        return;
    }

    const favorite =
        isFavorite(songId);

    try {

        if (favorite) {

            await api(
                `/favorites/${encodeURIComponent(songId)}`,
                {
                    method: "DELETE"
                }
            );

        } else {

            await api(
                "/favorites",
                {
                    method: "POST",

                    body: JSON.stringify({
                        songId
                    })
                }
            );

        }

        await loadFavorites();

        showToast(
            favorite
                ? "Removed from favorites."
                : "Added to favorites."
        );

    } catch (error) {

        showToast(
            error.message
        );

    }
}


/* =========================================================
   FRIENDS
========================================================= */

async function loadFriendsData() {

    try {

        const result =
            await api(
                "/friends"
            );

        state.friends =
            result.friends ||
            [];

        renderFriends();

    } catch (error) {

        console.warn(
            "Friends load failed:",
            error.message
        );

    }

    try {

        const result =
            await api(
                "/friends/requests"
            );

        state.friendRequests =
            result.requests ||
            [];

        renderFriendRequests();

    } catch (error) {

        console.warn(
            "Friend requests load failed:",
            error.message
        );

    }

    updateUserUI();
}


function renderFriends() {

    friendsCount.textContent =
        state.friends.length;

    if (!state.friends.length) {

        friendsList.innerHTML = `
            <div class="empty-state">
                You don't have any friends yet.
            </div>
        `;

        return;
    }

    friendsList.innerHTML =
        state.friends.map(friend => {

            const username =
                friend.username ||
                "User";

            const online =
                friend.online === true;

            return `
                <div
                    class="user-row"
                    data-user-id="${escapeHTML(friend.id || friend._id || "")}"
                >

                    <div class="user-avatar-small">
                        ${escapeHTML(
                            getInitials(username)
                        )}
                    </div>

                    <div class="user-row-info">

                        <strong>
                            ${escapeHTML(username)}
                        </strong>

                        <span>
                            <span
                                class="online-dot"
                                style="
                                    background:
                                    ${online
                                        ? "var(--success)"
                                        : "#666"}
                                "
                            ></span>

                            ${
                                online
                                    ? "Online"
                                    : formatLastActive(
                                        friend.lastActive
                                    )
                            }

                            ${
                                friend.nowPlaying
                                    ? ` • ${escapeHTML(
                                        friend.nowPlaying
                                    )}`
                                    : ""
                            }

                        </span>

                    </div>

                </div>
            `;

        }).join("");
}


function renderFriendRequests() {

    friendRequestsCount.textContent =
        state.friendRequests.length;

    if (!state.friendRequests.length) {

        friendRequestsList.innerHTML = `
            <div class="empty-state">
                No pending friend requests.
            </div>
        `;

        return;
    }

    friendRequestsList.innerHTML =
        state.friendRequests.map(request => {

            const username =
                request.username ||
                request.fromUsername ||
                "User";

            const id =
                request.id ||
                request.userId ||
                request.fromUserId;

            return `
                <div class="user-row">

                    <div class="user-avatar-small">
                        ${escapeHTML(
                            getInitials(username)
                        )}
                    </div>

                    <div class="user-row-info">

                        <strong>
                            ${escapeHTML(username)}
                        </strong>

                        <span>
                            Wants to be your friend.
                        </span>

                    </div>

                    <button
                        class="primary-button small"
                        data-accept-friend="${escapeHTML(id)}"
                        type="button"
                    >
                        ACCEPT
                    </button>

                </div>
            `;

        }).join("");
}


async function searchUsers() {

    const query =
        userSearchInput.value.trim();

    if (query.length < 2) {

        showToast(
            "Enter at least 2 characters."
        );

        return;
    }

    try {

        const result =
            await api(
                `/users/search?q=${encodeURIComponent(query)}`
            );

        renderUserSearchResults(
            result.users || []
        );

    } catch (error) {

        showToast(
            error.message
        );

    }
}


function renderUserSearchResults(users) {

    if (!users.length) {

        userSearchResults.innerHTML = `
            <div class="empty-state">
                No users found.
            </div>
        `;

        return;
    }

    userSearchResults.innerHTML =
        users.map(user => {

            const id =
                user.id ||
                user._id;

            const username =
                user.username ||
                "User";

            return `
                <div
                    class="user-row"
                    data-user-id="${escapeHTML(id)}"
                >

                    <div class="user-avatar-small">
                        ${escapeHTML(
                            getInitials(username)
                        )}
                    </div>

                    <div class="user-row-info">

                        <strong>
                            ${escapeHTML(username)}
                        </strong>

                        <span>
                            ${
                                user.online
                                    ? "Online"
                                    : "Offline"
                            }

                            ${
                                user.nowPlaying
                                    ? ` • ${escapeHTML(
                                        user.nowPlaying
                                    )}`
                                    : ""
                            }
                        </span>

                    </div>

                    <button
                        class="secondary-button"
                        data-view-user="${escapeHTML(id)}"
                        type="button"
                    >
                        VIEW
                    </button>

                </div>
            `;

        }).join("");
}


async function sendFriendRequest(userId) {

    try {

        await api(
            `/friends/requests/${encodeURIComponent(userId)}`,
            {
                method: "POST"
            }
        );

        showToast(
            "Friend request sent."
        );

    } catch (error) {

        showToast(
            error.message
        );

    }
}


async function acceptFriendRequest(requestId) {

    try {

        await api(
            `/friends/requests/${encodeURIComponent(requestId)}/accept`,
            {
                method: "POST"
            }
        );

        await loadFriendsData();

        showToast(
            "Friend request accepted."
        );

    } catch (error) {

        showToast(
            error.message
        );

    }
}


/* =========================================================
   USER PROFILE
========================================================= */

let selectedUserId = null;


async function openUserProfile(userId) {

    if (!userId) {
        return;
    }

    selectedUserId =
        userId;

    try {

        const result =
            await api(
                `/users/${encodeURIComponent(userId)}`
            );

        const user =
            result.user;

        if (!user) {
            throw new Error(
                "User not found."
            );
        }

        const username =
            user.username ||
            "User";

        userProfileName.textContent =
            username;

        userProfileAvatar.textContent =
            getInitials(username);

        userProfileStatus.textContent =
            user.online
                ? "Online"
                : "Offline";

        userProfileNowPlaying.textContent =
            user.nowPlaying ||
            "Nothing";

        userProfileLastActive.textContent =
            formatLastActive(
                user.lastActive
            );

        userProfileFavorites.textContent =
            user.favoritesCount ??
            0;

        userProfileModal.classList.remove(
            "hidden"
        );

    } catch (error) {

        showToast(
            error.message
        );

    }
}


/* =========================================================
   GLOBAL CHAT
========================================================= */

async function loadGlobalMessages() {

    try {

        const result =
            await api(
                "/chat/global/messages"
            );

        state.globalMessages =
            result.messages ||
            [];

        renderGlobalMessages();

    } catch (error) {

        console.warn(
            "Global chat load failed:",
            error.message
        );

    }
}


function renderGlobalMessages() {

    if (!state.globalMessages.length) {

        globalMessages.innerHTML = `
            <div class="empty-state">
                No messages yet. Start the conversation.
            </div>
        `;

        return;
    }

    globalMessages.innerHTML =
        state.globalMessages.map(
            message => {

                const author =
                    message.username ||
                    message.author ||
                    "User";

                const text =
                    message.text ||
                    message.content ||
                    "";

                const own =
                    state.user &&
                    (
                        message.userId ===
                        state.user.id ||
                        message.userId ===
                        state.user._id
                    );

                return `
                    <div
                        class="chat-message ${own ? "own" : ""}"
                    >

                        <div class="chat-message-author">
                            ${escapeHTML(author)}
                        </div>

                        <div class="chat-message-text">
                            ${escapeHTML(text)}
                        </div>

                        <div class="chat-message-time">
                            ${formatMessageTime(
                                message.createdAt
                            )}
                        </div>

                    </div>
                `;

            }
        ).join("");

    globalMessages.scrollTop =
        globalMessages.scrollHeight;
}


function formatMessageTime(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


async function sendGlobalMessage() {

    const text =
        globalChatInput.value.trim();

    if (!text) {
        return;
    }

    try {

        const result =
            await api(
                "/chat/global/messages",
                {
                    method: "POST",

                    body: JSON.stringify({
                        text
                    })
                }
            );

        globalChatInput.value = "";

        if (result.message) {

            state.globalMessages.push(
                result.message
            );

            renderGlobalMessages();

        } else {

            await loadGlobalMessages();

        }

    } catch (error) {

        showToast(
            error.message
        );

    }
}


globalChatForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        sendGlobalMessage();

    }
);


/* =========================================================
   ONLINE USERS
========================================================= */

async function loadOnlineCount() {

    try {

        const result =
            await api(
                "/users/online/count"
            );

        state.onlineUsers =
            Number(
                result.count || 0
            );

        onlineUsersCount.textContent =
            state.onlineUsers;

    } catch (error) {

        console.warn(
            "Online count failed:",
            error.message
        );

    }
}


/* =========================================================
   GROUPS
========================================================= */

async function loadGroups() {

    try {

        const result =
            await api(
                "/groups"
            );

        state.groups =
            result.groups ||
            [];

        renderGroups();

    } catch (error) {

        console.warn(
            "Groups load failed:",
            error.message
        );

    }
}


function renderGroups() {

    if (!state.groups.length) {

        groupsList.innerHTML = `
            <div class="empty-state">
                No groups yet.
                Create the first one.
            </div>
        `;

        return;
    }

    groupsList.innerHTML =
        state.groups.map(group => {

            const id =
                group.id ||
                group._id;

            return `
                <div
                    class="group-card ${
                        state.currentGroup &&
                        (
                            state.currentGroup.id === id ||
                            state.currentGroup._id === id
                        )
                            ? "active"
                            : ""
                    }"
                    data-group-id="${escapeHTML(id)}"
                >

                    <h4>
                        ${escapeHTML(
                            group.name
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            group.description ||
                            "Music World group"
                        )}
                    </p>

                </div>
            `;

        }).join("");
}


async function createGroup() {

    const name =
        groupNameInput.value.trim();

    const description =
        groupDescriptionInput.value.trim();

    if (!name) {
        return;
    }

    try {

        const result =
            await api(
                "/groups",
                {
                    method: "POST",

                    body: JSON.stringify({
                        name,
                        description
                    })
                }
            );

        createGroupForm.reset();

        createGroupModal.classList.add(
            "hidden"
        );

        await loadGroups();

        if (result.group) {

            await openGroup(
                result.group.id ||
                result.group._id
            );

        }

        showToast(
            "Group created."
        );

    } catch (error) {

        showToast(
            error.message
        );

    }
}


async function openGroup(groupId) {

    try {

        const result =
            await api(
                `/groups/${encodeURIComponent(groupId)}`
            );

        state.currentGroup =
            result.group;

        groupRoom.classList.remove(
            "hidden"
        );

        groupRoomName.textContent =
            state.currentGroup.name;

        groupRoomDescription.textContent =
            state.currentGroup.description ||
            "";

        await loadGroupMembers(
            groupId
        );

        await loadGroupMessages(
            groupId
        );

        renderGroups();

    } catch (error) {

        showToast(
            error.message
        );

    }
}


async function loadGroupMembers(groupId) {

    try {

        const result =
            await api(
                `/groups/${encodeURIComponent(groupId)}/members`
            );

        const members =
            result.members ||
            [];

        groupMembersCount.textContent =
            members.length;

        groupMembers.innerHTML =
            members.slice(0, 8)
                .map(member => {

                    return `
                        <div
                            class="member-avatar"
                            title="${escapeHTML(
                                member.username
                            )}"
                        >
                            ${escapeHTML(
                                getInitials(
                                    member.username
                                )
                            )}
                        </div>
                    `;

                }).join("");

    } catch (error) {

        console.warn(
            "Group members failed:",
            error.message
        );

    }
}


async function loadGroupMessages(groupId) {

    try {

        const result =
            await api(
                `/groups/${encodeURIComponent(groupId)}/messages`
            );

        state.groupMessages =
            result.messages ||
            [];

        renderGroupMessages();

    } catch (error) {

        console.warn(
            "Group messages failed:",
            error.message
        );

    }
}


function renderGroupMessages() {

    if (!state.groupMessages.length) {

        groupMessages.innerHTML = `
            <div class="empty-state">
                No messages in this group yet.
            </div>
        `;

        return;
    }

    groupMessages.innerHTML =
        state.groupMessages.map(
            message => {

                const author =
                    message.username ||
                    "User";

                const text =
                    message.text ||
                    message.content ||
                    "";

                const own =
                    state.user &&
                    (
                        message.userId ===
                        state.user.id ||
                        message.userId ===
                        state.user._id
                    );

                return `
                    <div
                        class="chat-message ${
                            own ? "own" : ""
                        }"
                    >

                        <div class="chat-message-author">
                            ${escapeHTML(author)}
                        </div>

                        <div class="chat-message-text">
                            ${escapeHTML(text)}
                        </div>

                        <div class="chat-message-time">
                            ${formatMessageTime(
                                message.createdAt
                            )}
                        </div>

                    </div>
                `;

            }
        ).join("");

    groupMessages.scrollTop =
        groupMessages.scrollHeight;
}


async function sendGroupMessage() {

    if (!state.currentGroup) {
        return;
    }

    const text =
        groupChatInput.value.trim();

    if (!text) {
        return;
    }

    const groupId =
        state.currentGroup.id ||
        state.currentGroup._id;

    try {

        const result =
            await api(
                `/groups/${encodeURIComponent(groupId)}/messages`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        text
                    })
                }
            );

        groupChatInput.value = "";

        if (result.message) {

            state.groupMessages.push(
                result.message
            );

            renderGroupMessages();

        } else {

            await loadGroupMessages(
                groupId
            );

        }

    } catch (error) {

        showToast(
            error.message
        );

    }
}


async function loadInviteFriends() {

    if (!state.currentGroup) {
        return;
    }

    const available =
        state.friends.filter(
            friend =>
                !(
                    state.currentGroup.members ||
                    []
                ).some(
                    member =>
                        (
                            member.id ||
                            member._id
                        ) ===
                        (
                            friend.id ||
                            friend._id
                        )
                )
        );

    if (!available.length) {

        inviteFriendsList.innerHTML = `
            <div class="empty-state">
                No friends available to invite.
            </div>
        `;

        return;
    }

    inviteFriendsList.innerHTML =
        available.map(friend => {

            const id =
                friend.id ||
                friend._id;

            return `
                <div class="user-row">

                    <div class="user-avatar-small">
                        ${escapeHTML(
                            getInitials(
                                friend.username
                            )
                        )}
                    </div>

                    <div class="user-row-info">

                        <strong>
                            ${escapeHTML(
                                friend.username
                            )}
                        </strong>

                    </div>

                    <button
                        class="secondary-button"
                        data-invite-user="${escapeHTML(id)}"
                        type="button"
                    >
                        INVITE
                    </button>

                </div>
            `;

        }).join("");
}


async function inviteFriend(userId) {

    if (!state.currentGroup) {
        return;
    }

    const groupId =
        state.currentGroup.id ||
        state.currentGroup._id;

    try {

        await api(
            `/groups/${encodeURIComponent(groupId)}/invite`,
            {
                method: "POST",

                body: JSON.stringify({
                    userId
                })
            }
        );

        showToast(
            "Friend invited."
        );

        await openGroup(
            groupId
        );

    } catch (error) {

        showToast(
            error.message
        );

    }
}


/* =========================================================
   PROFILE
========================================================= */

async function loadProfile() {

    updateUserUI();

    try {

        const result =
            await api(
                "/auth/me"
            );

        if (result.user) {

            state.user =
                result.user;

            updateUserUI();

        }

    } catch {
        // Keep current profile.
    }
}


/* =========================================================
   LISTEN TOGETHER
========================================================= */

async function startListenTogether() {

    if (!state.currentGroup) {

        showToast(
            "Open a group first."
        );

        return;
    }

    const groupId =
        state.currentGroup.id ||
        state.currentGroup._id;

    try {

        const result =
            await api(
                "/listen-together/rooms",
                {
                    method: "POST",

                    body: JSON.stringify({
                        groupId,
                        songId:
                            state.currentSong
                                ? state.currentSong.id
                                : songs[0].id
                    })
                }
            );

        state.listenTogether =
            result.room;

        renderListenTogether();

        listenTogetherView.classList.remove(
            "hidden"
        );

        connectRealtime();

    } catch (error) {

        showToast(
            error.message
        );

    }
}


function renderListenTogether() {

    const room =
        state.listenTogether;

    if (!room) {
        return;
    }

    listenRoomName.textContent =
        room.name ||
        "Listen Together";

    const songId =
        room.songId ||
        (
            state.currentSong &&
            state.currentSong.id
        );

    const song =
        songs.find(
            item =>
                item.id === songId
        );

    if (song) {

        listenTrackName.textContent =
            song.title;

        listenTrackArtist.textContent =
            song.artist;

        listenTrackCover.src =
            getSongCover(song);

    }

    const members =
        room.members ||
        [];

    listenMembersCount.textContent =
        members.length;

    listenMembers.innerHTML =
        members.map(member => {

            return `
                <div
                    class="member-avatar"
                    title="${escapeHTML(
                        member.username
                    )}"
                >
                    ${escapeHTML(
                        getInitials(
                            member.username
                        )
                    )}
                </div>
            `;

        }).join("");

    syncStatusText.textContent =
        room.connected
            ? "Synced"
            : "Waiting";

}


async function updateListenState(
    changes
) {

    if (!state.listenTogether) {
        return;
    }

    const roomId =
        state.listenTogether.id ||
        state.listenTogether._id;

    try {

        const result =
            await api(
                `/listen-together/rooms/${encodeURIComponent(roomId)}/state`,
                {
                    method: "POST",

                    body: JSON.stringify(
                        changes
                    )
                }
            );

        if (result.room) {

            state.listenTogether =
                result.room;

            renderListenTogether();

        }

    } catch (error) {

        showToast(
            error.message
        );

    }
}


async function leaveListenTogether() {

    if (!state.listenTogether) {
        return;
    }

    const roomId =
        state.listenTogether.id ||
        state.listenTogether._id;

    try {

        await api(
            `/listen-together/rooms/${encodeURIComponent(roomId)}/leave`,
            {
                method: "POST"
            }
        );

    } catch {
        // Continue closing locally.
    }

    state.listenTogether =
        null;

    listenTogetherView.classList.add(
        "hidden"
    );
}


/* =========================================================
   CAT
========================================================= */

function updateCat() {

    const count =
        state.catClicks;

    catStatus.textContent =
        `GUIDE // ${count} / 5`;

    catProgress.style.transform =
        `scaleX(${Math.min(
            count / 5,
            1
        )})`;

    if (count === 0) {

        catHint.textContent =
            "The guide is watching.";

    } else if (count < 3) {

        catHint.textContent =
            "Something is waking up...";

    } else if (count < 5) {

        catHint.textContent =
            "You are getting close.";

    } else {

        catHint.textContent =
            "SECRET MUSIC WORLD UNLOCKED.";

    }
}


cat.addEventListener(
    "click",
    () => {

        state.catClicks++;

        updateCat();

        if (
            state.catClicks === 5
        ) {

            showToast(
                "The Music World guide recognizes you."
            );

        }

    }
);


/* =========================================================
   MODALS
========================================================= */

function closeModal(id) {

    const modal =
        $(id);

    if (modal) {
        modal.classList.add(
            "hidden"
        );
    }
}


document.addEventListener(
    "click",
    event => {

        const closeButton =
            event.target.closest(
                "[data-close-modal]"
            );

        if (closeButton) {

            closeModal(
                closeButton.dataset.closeModal
            );

            return;
        }

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   EVENT DELEGATION
========================================================= */

songGrid.addEventListener(
    "click",
    event => {

        const favoriteButton =
            event.target.closest(
                "[data-favorite-song]"
            );

        if (favoriteButton) {

            event.stopPropagation();

            toggleFavorite(
                favoriteButton.dataset.favoriteSong
            );

            return;
        }

        const card =
            event.target.closest(
                "[data-song-id]"
            );

        if (card) {

            selectSong(
                card.dataset.songId
            );

        }

    }
);


favoritesGrid.addEventListener(
    "click",
    event => {

        const favoriteButton =
            event.target.closest(
                "[data-favorite-song]"
            );

        if (favoriteButton) {

            event.stopPropagation();

            toggleFavorite(
                favoriteButton.dataset.favoriteSong
            );

            return;
        }

        const card =
            event.target.closest(
                "[data-song-id]"
            );

        if (card) {

            selectSong(
                card.dataset.songId
            );

        }

    }
);


userSearchButton.addEventListener(
    "click",
    searchUsers
);


userSearchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            searchUsers();

        }

    }
);


userSearchResults.addEventListener(
    "click",
    event => {

        const viewButton =
            event.target.closest(
                "[data-view-user]"
            );

        if (viewButton) {

            openUserProfile(
                viewButton.dataset.viewUser
            );

        }

    }
);


friendsList.addEventListener(
    "click",
    event => {

        const row =
            event.target.closest(
                "[data-user-id]"
            );

        if (row) {

            openUserProfile(
                row.dataset.userId
            );

        }

    }
);


friendRequestsList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-accept-friend]"
            );

        if (button) {

            acceptFriendRequest(
                button.dataset.acceptFriend
            );

        }

    }
);


groupsList.addEventListener(
    "click",
    event => {

        const card =
            event.target.closest(
                "[data-group-id]"
            );

        if (card) {

            openGroup(
                card.dataset.groupId
            );

        }

    }
);


inviteFriendsList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-invite-user]"
            );

        if (button) {

            inviteFriend(
                button.dataset.inviteUser
            );

        }

    }
);


/* =========================================================
   USER PROFILE ACTIONS
========================================================= */

addFriendButton.addEventListener(
    "click",
    async () => {

        if (!selectedUserId) {
            return;
        }

        await sendFriendRequest(
            selectedUserId
        );

    }
);


messageUserButton.addEventListener(
    "click",
    () => {

        closeModal(
            "userProfileModal"
        );

        switchView(
            "chat"
        );

        showToast(
            "Private messaging will be connected to the social backend."
        );

    }
);


/* =========================================================
   GROUP ACTIONS
========================================================= */

createGroupButton.addEventListener(
    "click",
    () => {

        createGroupModal.classList.remove(
            "hidden"
        );

    }
);


createGroupForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        createGroup();

    }
);


inviteFriendsButton.addEventListener(
    "click",
    async () => {

        await loadInviteFriends();

        inviteFriendsModal.classList.remove(
            "hidden"
        );

    }
);


groupChatForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        sendGroupMessage();

    }
);


groupListenTogetherButton.addEventListener(
    "click",
    startListenTogether
);


/* =========================================================
   LISTEN ACTIONS
========================================================= */

listenPlayButton.addEventListener(
    "click",
    async () => {

        if (!state.currentSong) {
            return;
        }

        await playCurrentSong();

        await updateListenState({
            songId:
                state.currentSong.id,

            isPlaying: true,

            position:
                audioPlayer.currentTime
        });

    }
);


listenPauseButton.addEventListener(
    "click",
    async () => {

        pauseCurrentSong();

        await updateListenState({
            isPlaying: false,

            position:
                audioPlayer.currentTime
        });

    }
);


listenNextButton.addEventListener(
    "click",
    async () => {

        nextSong(true);

        if (state.currentSong) {

            await updateListenState({
                songId:
                    state.currentSong.id,

                isPlaying:
                    state.isPlaying,

                position:
                    audioPlayer.currentTime
            });

        }

    }
);


leaveListenButton.addEventListener(
    "click",
    leaveListenTogether
);


/* =========================================================
   LOGOUT
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action='logout']"
            );

        if (button) {
            logout();
        }

    }
);


/* =========================================================
   REALTIME / SOCKET.IO
========================================================= */

function connectRealtime() {

    if (
        typeof window.io !==
        "function"
    ) {
        return;
    }

    if (socket) {
        return;
    }

    try {

        socket =
            window.io(
                "http://localhost:3000",
                {
                    withCredentials: true
                }
            );

        socket.on(
            "connect",
            () => {

                console.log(
                    "Music World realtime connected."
                );

                if (
                    state.listenTogether
                ) {

                    syncStatusText.textContent =
                        "Synced";

                    syncStatusDot.style.background =
                        "var(--success)";

                }

            }
        );


        socket.on(
            "disconnect",
            () => {

                if (
                    state.listenTogether
                ) {

                    syncStatusText.textContent =
                        "Disconnected";

                    syncStatusDot.style.background =
                        "var(--danger)";

                }

            }
        );


        socket.on(
            "global:message",
            message => {

                if (
                    !state.globalMessages.some(
                        item =>
                            (
                                item.id ||
                                item._id
                            ) ===
                            (
                                message.id ||
                                message._id
                            )
                    )
                ) {

                    state.globalMessages.push(
                        message
                    );

                    renderGlobalMessages();

                }

            }
        );


        socket.on(
            "online:count",
            count => {

                state.onlineUsers =
                    Number(count || 0);

                onlineUsersCount.textContent =
                    state.onlineUsers;

            }
        );


        socket.on(
            "friends:updated",
            async () => {

                await loadFriendsData();

            }
        );


        socket.on(
            "listen:state",
            room => {

                if (
                    !state.listenTogether
                ) {
                    return;
                }

                state.listenTogether =
                    room;

                renderListenTogether();

                applyRemoteListenState(
                    room
                );

            }
        );

    } catch (error) {

        console.warn(
            "Realtime connection failed:",
            error
        );

    }
}


function applyRemoteListenState(room) {

    if (!room) {
        return;
    }

    if (room.songId) {

        const index =
            findSongIndex(
                room.songId
            );

        if (
            index !== -1 &&
            state.currentSongIndex !== index
        ) {

            loadSong(
                index,
                false
            );

        }

    }

    if (
        Number.isFinite(
            Number(room.position)
        ) &&
        Math.abs(
            audioPlayer.currentTime -
            Number(room.position)
        ) > 2
    ) {

        audioPlayer.currentTime =
            Number(room.position);

    }

    if (room.isPlaying) {

        if (audioPlayer.paused) {

            playCurrentSong();

        }

    } else {

        if (!audioPlayer.paused) {

            audioPlayer.pause();

        }

    }

}


/* =========================================================
   INITIALIZATION
========================================================= */

async function initializeAfterLogin() {

    showMain();

    updateUserUI();

    switchView("music");

    renderAllMusic();

    updateRepeatButton();

    updateCat();

    connectRealtime();

    await Promise.allSettled([
        loadFavorites(),
        loadFriendsData(),
        loadGroups(),
        loadGlobalMessages(),
        loadOnlineCount(),
        loadProfile()
    ]);

    updateUserUI();
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.target.matches(
                "input, textarea"
            )
        ) {
            return;
        }

        if (event.code === "Space") {

            event.preventDefault();

            toggleMusic();

        }

        if (
            event.code === "ArrowRight"
        ) {

            nextSong(true);

        }

        if (
            event.code === "ArrowLeft"
        ) {

            previousSong();

        }

        if (
            event.key.toLowerCase() === "r"
        ) {

            cycleRepeat();

        }

    }
);


/* =========================================================
   START
========================================================= */

async function initializeMusicWorld() {

    renderAllMusic();

    updateRepeatButton();

    updateCat();

    await checkSession();

}


initializeMusicWorld();