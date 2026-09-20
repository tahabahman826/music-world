# Music World 2.0

Full-stack social music application with authentication, favorites, friends,
global and group chat, presence, groups and synchronized listening.

## Install and run

```bash
npm install
cp .env.example .env
npm start
```

Open `http://localhost:3000`. Before production, set a long random
`SESSION_SECRET` and list every allowed frontend origin in `FRONTEND_ORIGINS`.

## Verification

```bash
npm run check
npm test
```

## Render deployment

`render.yaml` is included and uses a paid `starter` web-service plan because
Render persistent disks are not available on free web services. Set
`FRONTEND_ORIGINS` in Render to the exact public
frontend address, without a trailing slash. The persistent disk at `/var/data`
stores both application data and sessions. After creating a new Render service,
update `config.js` with its public origin.

This JSON-backed deployment is suitable for one small Render instance. Before
horizontal scaling or high traffic, migrate data and sessions to PostgreSQL and
Redis respectively.

## Separate static frontend

The backend can serve the frontend itself. For GitHub Pages or another static
host, upload `index.html`, `style.css`, `script.js`, `config.js`, and `music/`.
Set `backendOrigin` in `config.js`, then add the frontend origin to the backend's
`FRONTEND_ORIGINS` variable.

## Required licensed audio

The supplied archive contained no music. Add audio you are licensed to use to
`music/` with these exact filenames:

- `mordab.mp3`, `baran.mp3`, `safar.mp3`, `24_7.mp3`
- `hooman.mp3`, `arta.mp3`, `mariz ham.mp3`, `dasht parvaneh.mp3`
- `one of the girl.mp3`, `red.mp3`, `timeless.mp3`, `popular.mp3`
- `starboy.mp3`, `call out my name.mp3`, `lovely.mp3`
- `Billie Eilish Birds of a Feather.mp3`, `ocean eyes.mp3`, `bye.mp3`

## Main upgrades

- authenticated Socket.IO connections and private group rooms
- persistent file-based sessions instead of the production-unsafe memory store
- atomic data writes with corrupted-file preservation
- CORS/origin enforcement, rate limiting, security headers and session rotation
- corrected realtime event contracts and synchronized playback state
- configurable backend URL, API timeouts and duplicate-message prevention
- complete package, Render, environment, verification and integration-test files
