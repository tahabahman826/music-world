window.MUSIC_WORLD_CONFIG = Object.freeze({
    backendOrigin:
        ["localhost", "127.0.0.1"].includes(window.location.hostname)
            ? window.location.origin
            : "https://music-world-2-0-upgraded.onrender.com"
});