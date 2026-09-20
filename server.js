"use strict";

const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const FileStoreFactory = require("session-file-store");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN ||
    "https://tahabahman826.github.io,http://localhost:3000,http://127.0.0.1:3000")
    .split(",").map(value => value.trim().replace(/\/$/, "")).filter(Boolean);
const SESSION_SECRET = process.env.SESSION_SECRET || "music-world-development-only-secret";
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, "data"));
const DATABASE_FILE = path.join(DATA_DIR, "data.json");
const SESSION_DIR = path.join(DATA_DIR, "sessions");

if (IS_PRODUCTION && !process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is required in production.");
fs.mkdirSync(SESSION_DIR, { recursive: true });

const DATABASE_KEYS = ["users", "favorites", "friendRequests", "friendships", "messages", "groups", "groupMessages", "listenRooms"];
const freshDatabase = () => Object.fromEntries(DATABASE_KEYS.map(key => [key, []]));

function loadDatabase() {
    if (!fs.existsSync(DATABASE_FILE)) return freshDatabase();
    try {
        const value = JSON.parse(fs.readFileSync(DATABASE_FILE, "utf8"));
        const result = freshDatabase();
        for (const key of DATABASE_KEYS) result[key] = Array.isArray(value[key]) ? value[key] : [];
        return result;
    } catch (error) {
        const backup = `${DATABASE_FILE}.corrupt-${Date.now()}`;
        fs.copyFileSync(DATABASE_FILE, backup);
        console.error("Invalid database preserved at", backup, error.message);
        return freshDatabase();
    }
}

let database = loadDatabase();

function saveDatabase() {
    const temporary = `${DATABASE_FILE}.${process.pid}.tmp`;
    try {
        fs.writeFileSync(temporary, JSON.stringify(database, null, 2), { encoding: "utf8", mode: 0o600 });
        fs.renameSync(temporary, DATABASE_FILE);
        return true;
    } catch (error) {
        console.error("DATABASE SAVE ERROR:", error);
        try { fs.rmSync(temporary, { force: true }); } catch {}
        return false;
    }
}

if (!fs.existsSync(DATABASE_FILE)) saveDatabase();

const now = () => new Date().toISOString();
const generateId = prefix => `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(6).toString("hex")}`;
const findUserById = id => database.users.find(user => user.id === id);
const findUserByEmail = email => database.users.find(user => user.email === String(email).toLowerCase());
const isFriend = (a, b) => database.friendships.some(item =>
    (item.userA === a && item.userB === b) || (item.userA === b && item.userB === a));
const isGroupMember = (group, userId) => Boolean(group?.members?.includes(userId));
const groupChannel = id => `group:${id}`;
const userChannel = id => `user:${id}`;

function publicUser(user, { includeEmail = false } = {}) {
    if (!user) return null;
    return {
        id: user.id, username: user.username,
        ...(includeEmail ? { email: user.email } : {}),
        online: Boolean(user.online), lastActive: user.lastActive || null,
        nowPlaying: user.nowPlaying || null, createdAt: user.createdAt
    };
}

function publicRoom(room) {
    return { ...room, members: (room.members || []).map(findUserById).filter(Boolean).map(publicUser), connected: true };
}

function requireAuth(req, res, next) {
    const user = findUserById(req.session?.userId);
    if (!user) return res.status(401).json({ message: "You must be logged in." });
    user.lastActive = now();
    req.user = user;
    next();
}

function persistOrFail(res) {
    if (saveDatabase()) return true;
    res.status(500).json({ message: "Database could not be saved." });
    return false;
}

const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const allowedOrigin = origin => !origin || FRONTEND_ORIGINS.includes(origin.replace(/\/$/, ""));

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: { directives: {
        defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"], mediaSrc: ["'self'", "blob:"], connectSrc: ["'self'", ...FRONTEND_ORIGINS]
    } }
}));
app.use(cors({
    origin(origin, callback) {
        const allowed = allowedOrigin(origin);
        callback(allowed ? null : new Error("CORS blocked this origin."), allowed);
    },
    credentials: true, methods: ["GET", "POST", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "32kb", strict: true }));

const FileStore = FileStoreFactory(session);
const sessionMiddleware = session({
    name: "musicworld.sid",
    store: new FileStore({ path: SESSION_DIR, ttl: 60 * 60 * 24 * 30, retries: 1, logFn: () => {} }),
    secret: SESSION_SECRET, resave: false, saveUninitialized: false, rolling: true,
    cookie: { httpOnly: true, secure: IS_PRODUCTION, sameSite: IS_PRODUCTION ? "none" : "lax", maxAge: 1000 * 60 * 60 * 24 * 30 }
});
app.use(sessionMiddleware);
app.use("/api", (req, res, next) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && !allowedOrigin(req.get("origin"))) {
        return res.status(403).json({ message: "Request origin is not allowed." });
    }
    next();
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
const messageLimiter = rateLimit({ windowMs: 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false });
const io = new Server(server, { cors: { origin: FRONTEND_ORIGINS, credentials: true, methods: ["GET", "POST"] }, maxHttpBufferSize: 100_000 });
io.engine.use(sessionMiddleware);
const connectedUsers = new Map();

function userSocketSet(userId) {
    if (!connectedUsers.has(userId)) connectedUsers.set(userId, new Set());
    return connectedUsers.get(userId);
}

function broadcastOnlineCount() {
    io.emit("online:count", database.users.filter(user => user.online).length);
}

function setPresence(userId, online) {
    const user = findUserById(userId);
    if (!user) return;
    user.online = online;
    user.lastActive = now();
    if (!online) user.nowPlaying = null;
    saveDatabase();
    io.emit("user_status", { userId, status: online ? "online" : "offline", lastActive: user.lastActive });
    broadcastOnlineCount();
}

function joinUserToGroup(userId, groupId) {
    for (const socket of io.sockets.sockets.values()) if (socket.userId === userId) socket.join(groupChannel(groupId));
}

function establishSession(req, userId) {
    return new Promise((resolve, reject) => {
        req.session.regenerate(error => {
            if (error) return reject(error);
            req.session.userId = userId;
            req.session.save(saveError => saveError ? reject(saveError) : resolve());
        });
    });
}

app.get("/api/health", (req, res) => res.json({ ok: true, service: "Music World Backend", version: "2.0.0", environment: process.env.NODE_ENV || "development", time: now() }));

app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");
        if (username.length < 3 || username.length > 30) return res.status(400).json({ message: "Username must be 3–30 characters." });
        if (!validEmail(email) || email.length > 150) return res.status(400).json({ message: "Enter a valid email address." });
        if (password.length < 8 || password.length > 128) return res.status(400).json({ message: "Password must be 8–128 characters." });
        if (findUserByEmail(email)) return res.status(409).json({ message: "This email is already registered." });
        if (database.users.some(user => user.username.toLowerCase() === username.toLowerCase())) return res.status(409).json({ message: "This username is already taken." });
        const timestamp = now();
        const user = { id: generateId("user"), username, email, passwordHash: await bcrypt.hash(password, 12), online: false, lastActive: timestamp, nowPlaying: null, createdAt: timestamp };
        database.users.push(user);
        if (!persistOrFail(res)) return;
        await establishSession(req, user.id);
        res.status(201).json({ success: true, user: publicUser(user, { includeEmail: true }) });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: "Registration failed." });
    }
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");
        const user = findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Invalid email or password." });
        await establishSession(req, user.id);
        user.lastActive = now(); saveDatabase();
        res.json({ success: true, user: publicUser(user, { includeEmail: true }) });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Login failed." });
    }
});

app.get("/api/auth/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user, { includeEmail: true }) }));

app.post("/api/auth/logout", requireAuth, (req, res) => {
    const userId = req.user.id;
    req.session.destroy(error => {
        if (error) return res.status(500).json({ message: "Logout failed." });
        for (const socket of io.sockets.sockets.values()) if (socket.userId === userId) socket.disconnect(true);
        res.clearCookie("musicworld.sid", { httpOnly: true, secure: IS_PRODUCTION, sameSite: IS_PRODUCTION ? "none" : "lax" });
        res.json({ success: true });
    });
});

app.get("/api/users/search", requireAuth, (req, res) => {
    const query = String(req.query.q || "").trim().toLowerCase().slice(0, 60);
    const users = query.length < 2 ? [] : database.users.filter(user => user.id !== req.user.id && user.username.toLowerCase().includes(query)).slice(0, 30).map(publicUser);
    res.json({ users });
});

app.get("/api/users/online/count", (req, res) => res.json({ count: database.users.filter(user => user.online).length }));

app.post("/api/users/me/now-playing", requireAuth, (req, res) => {
    const songId = req.body.songId ? String(req.body.songId).slice(0, 100) : null;
    req.user.nowPlaying = songId && Boolean(req.body.playing) ? songId : null;
    req.user.lastActive = now();
    if (!persistOrFail(res)) return;
    const friendIds = database.friendships.filter(item => item.userA === req.user.id || item.userB === req.user.id).map(item => item.userA === req.user.id ? item.userB : item.userA);
    for (const id of friendIds) io.to(userChannel(id)).emit("now_playing_update", { userId: req.user.id, song: req.user.nowPlaying });
    res.json({ success: true });
});

app.get("/api/favorites", requireAuth, (req, res) => res.json({ favorites: database.favorites.filter(item => item.userId === req.user.id) }));

app.post("/api/favorites", requireAuth, (req, res) => {
    const songId = String(req.body.songId || "").trim().slice(0, 100);
    if (!songId) return res.status(400).json({ message: "songId is required." });
    if (!database.favorites.some(item => item.userId === req.user.id && item.songId === songId)) {
        database.favorites.push({ id: generateId("favorite"), userId: req.user.id, songId, createdAt: now() });
        if (!persistOrFail(res)) return;
    }
    res.json({ success: true });
});

app.delete("/api/favorites/:songId", requireAuth, (req, res) => {
    database.favorites = database.favorites.filter(item => !(item.userId === req.user.id && item.songId === req.params.songId));
    if (!persistOrFail(res)) return;
    res.json({ success: true });
});

app.get("/api/friends/requests", requireAuth, (req, res) => {
    const requests = database.friendRequests.filter(item => item.toUserId === req.user.id).map(item => {
        const sender = findUserById(item.fromUserId);
        return { ...item, username: sender?.username || "User", user: publicUser(sender) };
    });
    res.json({ requests });
});

app.post("/api/friends/requests/:userId", requireAuth, (req, res) => {
    const target = findUserById(req.params.userId);
    if (!target) return res.status(404).json({ message: "User not found." });
    if (target.id === req.user.id) return res.status(400).json({ message: "You cannot add yourself." });
    if (isFriend(req.user.id, target.id)) return res.status(409).json({ message: "You are already friends." });
    if (database.friendRequests.some(item => (item.fromUserId === req.user.id && item.toUserId === target.id) || (item.fromUserId === target.id && item.toUserId === req.user.id))) return res.status(409).json({ message: "A friend request already exists." });
    const request = { id: generateId("request"), fromUserId: req.user.id, toUserId: target.id, createdAt: now() };
    database.friendRequests.push(request);
    if (!persistOrFail(res)) return;
    io.to(userChannel(target.id)).emit("friend_request", { request });
    res.status(201).json({ success: true, request });
});

app.post("/api/friends/requests/:requestId/accept", requireAuth, (req, res) => {
    const request = database.friendRequests.find(item => item.id === req.params.requestId && item.toUserId === req.user.id);
    if (!request) return res.status(404).json({ message: "Friend request not found." });
    database.friendRequests = database.friendRequests.filter(item => item.id !== request.id);
    if (!isFriend(request.fromUserId, request.toUserId)) database.friendships.push({ id: generateId("friendship"), userA: request.fromUserId, userB: request.toUserId, createdAt: now() });
    if (!persistOrFail(res)) return;
    io.to(userChannel(request.fromUserId)).to(userChannel(request.toUserId)).emit("friends:updated");
    res.json({ success: true });
});

app.get("/api/friends", requireAuth, (req, res) => {
    const friends = database.friendships.filter(item => item.userA === req.user.id || item.userB === req.user.id)
        .map(item => findUserById(item.userA === req.user.id ? item.userB : item.userA)).filter(Boolean).map(publicUser);
    res.json({ friends });
});

app.get("/api/chat/global/messages", requireAuth, (req, res) => res.json({ messages: database.messages.slice(-100) }));

app.post("/api/chat/global/messages", messageLimiter, requireAuth, (req, res) => {
    const text = String(req.body.text || "").trim();
    if (!text || text.length > 1000) return res.status(400).json({ message: "Message must be 1–1000 characters." });
    const message = { id: generateId("message"), userId: req.user.id, username: req.user.username, text, createdAt: now() };
    database.messages.push(message); database.messages = database.messages.slice(-2000);
    if (!persistOrFail(res)) return;
    io.emit("global:message", message);
    res.status(201).json({ success: true, message });
});

app.get("/api/users/:userId", requireAuth, (req, res) => {
    const user = findUserById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    const favoritesCount = database.favorites.filter(item => item.userId === user.id).length;
    res.json({ user: { ...publicUser(user), favoritesCount, friendship: isFriend(req.user.id, user.id) } });
});

app.get("/api/groups", requireAuth, (req, res) => res.json({ groups: database.groups.filter(group => isGroupMember(group, req.user.id)) }));

app.post("/api/groups", requireAuth, (req, res) => {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    if (!name || name.length > 80) return res.status(400).json({ message: "Group name must be 1–80 characters." });
    if (description.length > 500) return res.status(400).json({ message: "Description is too long." });
    const group = { id: generateId("group"), name, description, ownerId: req.user.id, members: [req.user.id], createdAt: now() };
    database.groups.push(group);
    if (!persistOrFail(res)) return;
    joinUserToGroup(req.user.id, group.id);
    io.to(userChannel(req.user.id)).emit("groups:updated");
    res.status(201).json({ success: true, group });
});

function groupForMember(req, res) {
    const group = database.groups.find(item => item.id === req.params.groupId);
    if (!group) { res.status(404).json({ message: "Group not found." }); return null; }
    if (!isGroupMember(group, req.user.id)) { res.status(403).json({ message: "You are not a member of this group." }); return null; }
    return group;
}

app.get("/api/groups/:groupId", requireAuth, (req, res) => {
    const group = groupForMember(req, res); if (!group) return;
    res.json({ group });
});

app.get("/api/groups/:groupId/members", requireAuth, (req, res) => {
    const group = groupForMember(req, res); if (!group) return;
    res.json({ members: group.members.map(findUserById).filter(Boolean).map(publicUser) });
});

app.post("/api/groups/:groupId/invite", requireAuth, (req, res) => {
    const group = groupForMember(req, res); if (!group) return;
    const user = findUserById(String(req.body.userId || ""));
    if (!user) return res.status(404).json({ message: "User not found." });
    if (group.members.includes(user.id)) return res.status(409).json({ message: "User is already a member." });
    if (!isFriend(req.user.id, user.id)) return res.status(403).json({ message: "You can only invite friends." });
    group.members.push(user.id);
    if (!persistOrFail(res)) return;
    joinUserToGroup(user.id, group.id);
    io.to(groupChannel(group.id)).to(userChannel(user.id)).emit("group:updated", { groupId: group.id });
    io.to(userChannel(user.id)).emit("groups:updated");
    res.json({ success: true });
});

app.get("/api/groups/:groupId/messages", requireAuth, (req, res) => {
    const group = groupForMember(req, res); if (!group) return;
    res.json({ messages: database.groupMessages.filter(item => item.groupId === group.id).slice(-100) });
});

app.post("/api/groups/:groupId/messages", messageLimiter, requireAuth, (req, res) => {
    const group = groupForMember(req, res); if (!group) return;
    const text = String(req.body.text || "").trim();
    if (!text || text.length > 1000) return res.status(400).json({ message: "Message must be 1–1000 characters." });
    const message = { id: generateId("groupmsg"), groupId: group.id, userId: req.user.id, username: req.user.username, text, createdAt: now() };
    database.groupMessages.push(message);
    if (database.groupMessages.length > 10_000) database.groupMessages = database.groupMessages.slice(-10_000);
    if (!persistOrFail(res)) return;
    io.to(groupChannel(group.id)).emit("group:message", message);
    res.status(201).json({ success: true, message });
});

app.post("/api/listen-together/rooms", requireAuth, (req, res) => {
    const group = database.groups.find(item => item.id === String(req.body.groupId || ""));
    if (!group) return res.status(404).json({ message: "Group not found." });
    if (!isGroupMember(group, req.user.id)) return res.status(403).json({ message: "You are not a member of this group." });
    let room = database.listenRooms.find(item => item.groupId === group.id);
    if (!room) {
        room = { id: generateId("listen"), name: `${group.name} — Listen Together`, groupId: group.id,
            songId: req.body.songId ? String(req.body.songId).slice(0, 100) : null, position: 0, playing: false,
            members: [req.user.id], createdAt: now() };
        database.listenRooms.push(room);
    } else if (!room.members.includes(req.user.id)) room.members.push(req.user.id);
    if (!persistOrFail(res)) return;
    const payload = publicRoom(room);
    io.to(groupChannel(group.id)).emit("listen:room", payload);
    res.json({ success: true, room: payload });
});

app.post("/api/listen-together/rooms/:roomId/state", requireAuth, (req, res) => {
    const room = database.listenRooms.find(item => item.id === req.params.roomId);
    if (!room) return res.status(404).json({ message: "Listen room not found." });
    if (!room.members.includes(req.user.id)) return res.status(403).json({ message: "Join this listening room first." });
    if (req.body.songId !== undefined) room.songId = String(req.body.songId).slice(0, 100);
    if (req.body.position !== undefined) room.position = Math.max(0, Math.min(Number(req.body.position) || 0, 86_400));
    if (req.body.playing !== undefined) room.playing = Boolean(req.body.playing);
    if (!persistOrFail(res)) return;
    const payload = publicRoom(room);
    io.to(groupChannel(room.groupId)).emit("listen:state", payload);
    res.json({ success: true, room: payload });
});

app.post("/api/listen-together/rooms/:roomId/leave", requireAuth, (req, res) => {
    const room = database.listenRooms.find(item => item.id === req.params.roomId);
    if (!room) return res.status(404).json({ message: "Listen room not found." });
    room.members = room.members.filter(id => id !== req.user.id);
    const closed = room.members.length === 0;
    if (closed) database.listenRooms = database.listenRooms.filter(item => item.id !== room.id);
    if (!persistOrFail(res)) return;
    io.to(groupChannel(room.groupId)).emit("listen:updated", closed ? { roomId: room.id, closed: true } : publicRoom(room));
    res.json({ success: true });
});

io.use((socket, next) => {
    const user = findUserById(socket.request.session?.userId);
    if (!user) return next(new Error("unauthorized"));
    socket.userId = user.id;
    next();
});

io.on("connection", socket => {
    const userId = socket.userId;
    socket.join(userChannel(userId));
    for (const group of database.groups.filter(item => isGroupMember(item, userId))) socket.join(groupChannel(group.id));
    const sockets = userSocketSet(userId);
    const wasOffline = sockets.size === 0;
    sockets.add(socket.id);
    if (wasOffline) setPresence(userId, true);
    socket.on("disconnect", () => {
        const current = connectedUsers.get(userId);
        current?.delete(socket.id);
        if (!current?.size) { connectedUsers.delete(userId); setPresence(userId, false); }
    });
});

const sendFrontend = file => (req, res) => res.sendFile(path.join(__dirname, file));
app.get(["/", "/index.html"], sendFrontend("index.html"));
app.get("/style.css", sendFrontend("style.css"));
app.get("/script.js", sendFrontend("script.js"));
app.get("/config.js", sendFrontend("config.js"));
app.use("/music", express.static(path.join(__dirname, "music"), { fallthrough: false, index: false, maxAge: "1d" }));
app.use("/api", (req, res) => res.status(404).json({ message: "API endpoint not found." }));
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ message: "Invalid JSON body." });
    if (error.message === "CORS blocked this origin.") return res.status(403).json({ message: error.message });
    console.error("SERVER ERROR:", error);
    res.status(500).json({ message: "Internal server error." });
});

if (require.main === module) server.listen(PORT, "0.0.0.0", () => {
    console.log(`Music World 2.0.0 listening on port ${PORT}`);
    console.log(`Data directory: ${DATA_DIR}`);
    console.log(`Allowed frontends: ${FRONTEND_ORIGINS.join(", ")}`);
});

module.exports = { app, server };
