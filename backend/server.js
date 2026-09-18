const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

/* =========================================================
   MUSIC WORLD BACKEND
   Production-ready Render configuration
   ========================================================= */

const app = express();
const server = http.createServer(app);

/* =========================================================
   CONFIG
   ========================================================= */

const PORT = Number(process.env.PORT) || 3000;

const FRONTEND_ORIGIN =
    process.env.FRONTEND_ORIGIN ||
    "https://tahabahman826.github.io";

const SESSION_SECRET =
    process.env.SESSION_SECRET ||
    "music-world-development-secret-change-this";

/* =========================================================
   DATABASE
   ========================================================= */

const databaseFolder = path.join(__dirname, "database");
const databaseFile = path.join(
    databaseFolder,
    "data.json"
);

const EMPTY_DATABASE = {
    users: [],
    favorites: [],
    friendRequests: [],
    friendships: [],
    messages: [],
    groups: [],
    groupMessages: [],
    listenRooms: []
};

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder, {
        recursive: true
    });
}

if (!fs.existsSync(databaseFile)) {
    fs.writeFileSync(
        databaseFile,
        JSON.stringify(
            EMPTY_DATABASE,
            null,
            2
        ),
        "utf8"
    );
}

function loadDatabase() {
    try {
        const raw =
            fs.readFileSync(
                databaseFile,
                "utf8"
            );

        const parsed =
            JSON.parse(raw);

        return {
            ...EMPTY_DATABASE,
            ...parsed
        };
    } catch (error) {
        console.error(
            "DATABASE LOAD ERROR:",
            error
        );

        return {
            ...EMPTY_DATABASE
        };
    }
}

let database = loadDatabase();

function saveDatabase() {
    try {
        fs.writeFileSync(
            databaseFile,
            JSON.stringify(
                database,
                null,
                2
            ),
            "utf8"
        );

        return true;
    } catch (error) {
        console.error(
            "DATABASE SAVE ERROR:",
            error
        );

        return false;
    }
}

/* =========================================================
   HELPERS
   ========================================================= */

function generateId(prefix = "id") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );
}

function now() {
    return new Date().toISOString();
}

function findUserById(id) {
    return database.users.find(
        user => user.id === id
    );
}

function findUserByEmail(email) {
    return database.users.find(
        user =>
            String(user.email)
                .toLowerCase() ===
            String(email)
                .toLowerCase()
    );
}

function publicUser(user) {
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        online: Boolean(user.online),
        lastActive:
            user.lastActive || null,
        nowPlaying:
            user.nowPlaying || null,
        createdAt:
            user.createdAt
    };
}

function isFriend(userA, userB) {
    return database.friendships.some(
        friendship =>
            (
                friendship.userA === userA &&
                friendship.userB === userB
            ) ||
            (
                friendship.userA === userB &&
                friendship.userB === userA
            )
    );
}

function isGroupMember(group, userId) {
    return Boolean(
        group &&
        Array.isArray(group.members) &&
        group.members.includes(userId)
    );
}

function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            message:
                "You must be logged in."
        });
    }

    const user =
        findUserById(
            req.session.userId
        );

    if (!user) {
        return req.session.destroy(() => {
            res.status(401).json({
                message:
                    "Session is invalid."
            });
        });
    }

    user.online = true;
    user.lastActive = now();

    req.user = user;

    next();
}

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.disable("x-powered-by");

app.set(
    "trust proxy",
    1
);

app.use(
    cors({
        origin: FRONTEND_ORIGIN,
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);

/* =========================================================
   SESSION
   ========================================================= */

app.use(
    session({
        name: "musicworld.sid",

        secret: SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        rolling: true,

        cookie: {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                "production"
                    ? "none"
                    : "lax",

            maxAge:
                1000 *
                60 *
                60 *
                24 *
                30
        }
    })
);

/* =========================================================
   SOCKET.IO
   ========================================================= */

const io = new Server(
    server,
    {
        cors: {
            origin:
                FRONTEND_ORIGIN,

            credentials: true,

            methods: [
                "GET",
                "POST"
            ]
        }
    }
);

const connectedSockets =
    new Map();

/* =========================================================
   HEALTH
   ========================================================= */

app.get(
    "/api/health",
    (req, res) => {
        res.json({
            ok: true,
            service:
                "Music World Backend",
            environment:
                process.env.NODE_ENV ||
                "development",
            time: now()
        });
    }
);

/* =========================================================
   AUTH - REGISTER
   ========================================================= */

app.post(
    "/api/auth/register",
    async (req, res) => {
        try {
            const username =
                String(
                    req.body.username || ""
                ).trim();

            const email =
                String(
                    req.body.email || ""
                )
                    .trim()
                    .toLowerCase();

            const password =
                String(
                    req.body.password || ""
                );

            if (
                !username ||
                !email ||
                !password
            ) {
                return res.status(400).json({
                    message:
                        "All fields are required."
                });
            }

            if (username.length < 3) {
                return res.status(400).json({
                    message:
                        "Username must contain at least 3 characters."
                });
            }

            if (username.length > 30) {
                return res.status(400).json({
                    message:
                        "Username is too long."
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    message:
                        "Password must contain at least 8 characters."
                });
            }

            if (email.length > 150) {
                return res.status(400).json({
                    message:
                        "Email is too long."
                });
            }

            if (findUserByEmail(email)) {
                return res.status(409).json({
                    message:
                        "This email is already registered."
                });
            }

            const usernameExists =
                database.users.some(
                    user =>
                        user.username
                            .toLowerCase() ===
                        username.toLowerCase()
                );

            if (usernameExists) {
                return res.status(409).json({
                    message:
                        "This username is already taken."
                });
            }

            const passwordHash =
                await bcrypt.hash(
                    password,
                    12
                );

            const timestamp =
                now();

            const user = {
                id:
                    generateId("user"),

                username,

                email,

                passwordHash,

                online: true,

                lastActive:
                    timestamp,

                nowPlaying:
                    null,

                createdAt:
                    timestamp
            };

            database.users.push(
                user
            );

            if (!saveDatabase()) {
                return res.status(500).json({
                    message:
                        "Database could not be saved."
                });
            }

            req.session.userId =
                user.id;

            req.session.save(
                error => {
                    if (error) {
                        console.error(
                            "SESSION SAVE ERROR:",
                            error
                        );

                        return res.status(500).json({
                            message:
                                "Session could not be saved."
                        });
                    }

                    res.json({
                        success: true,
                        user:
                            publicUser(user)
                    });

                    broadcastOnlineCount();
                }
            );
        } catch (error) {
            console.error(
                "REGISTER ERROR:",
                error
            );

            res.status(500).json({
                message:
                    "Registration failed."
            });
        }
    }
);

/* =========================================================
   AUTH - LOGIN
   ========================================================= */

app.post(
    "/api/auth/login",
    async (req, res) => {
        try {
            const email =
                String(
                    req.body.email || ""
                )
                    .trim()
                    .toLowerCase();

            const password =
                String(
                    req.body.password || ""
                );

            if (!email || !password) {
                return res.status(400).json({
                    message:
                        "Email and password are required."
                });
            }

            const user =
                findUserByEmail(email);

            if (!user) {
                return res.status(401).json({
                    message:
                        "Invalid email or password."
                });
            }

            const valid =
                await bcrypt.compare(
                    password,
                    user.passwordHash
                );

            if (!valid) {
                return res.status(401).json({
                    message:
                        "Invalid email or password."
                });
            }

            user.online = true;
            user.lastActive = now();

            saveDatabase();

            req.session.userId =
                user.id;

            req.session.save(
                error => {
                    if (error) {
                        console.error(
                            "SESSION SAVE ERROR:",
                            error
                        );

                        return res.status(500).json({
                            message:
                                "Session could not be saved."
                        });
                    }

                    res.json({
                        success: true,
                        user:
                            publicUser(user)
                    });

                    broadcastOnlineCount();
                }
            );
        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error
            );

            res.status(500).json({
                message:
                    "Login failed."
            });
        }
    }
);

/* =========================================================
   AUTH - CURRENT USER
   ========================================================= */

app.get(
    "/api/auth/me",
    requireAuth,
    (req, res) => {
        saveDatabase();

        res.json({
            user:
                publicUser(
                    req.user
                )
        });
    }
);

/* =========================================================
   AUTH - LOGOUT
   ========================================================= */

app.post(
    "/api/auth/logout",
    requireAuth,
    (req, res) => {
        const user =
            req.user;

        const userId =
            user.id;

        user.online = false;
        user.lastActive = now();
        user.nowPlaying = null;

        const lastActive =
            user.lastActive;

        saveDatabase();

        req.session.destroy(
            error => {
                if (error) {
                    console.error(
                        "LOGOUT SESSION ERROR:",
                        error
                    );

                    return res.status(500).json({
                        message:
                            "Logout failed."
                    });
                }

                io.emit(
                    "user_status",
                    {
                        userId,
                        status:
                            "offline",
                        lastActive
                    }
                );

                broadcastOnlineCount();

                res.json({
                    success: true
                });
            }
        );
    }
);

/* =========================================================
   USER SEARCH
   ========================================================= */

app.get(
    "/api/users/search",
    requireAuth,
    (req, res) => {
        const query =
            String(
                req.query.q || ""
            )
                .trim()
                .toLowerCase();

        if (!query) {
            return res.json({
                users: []
            });
        }

        const users =
            database.users
                .filter(
                    user =>
                        user.id !==
                        req.user.id
                )
                .filter(
                    user =>
                        user.username
                            .toLowerCase()
                            .includes(query)
                )
                .slice(0, 30)
                .map(publicUser);

        res.json({
            users
        });
    }
);

/* =========================================================
   ONLINE COUNT
   ========================================================= */

app.get(
    "/api/users/online/count",
    (req, res) => {
        const count =
            database.users.filter(
                user =>
                    user.online === true
            ).length;

        res.json({
            count
        });
    }
);

/* =========================================================
   NOW PLAYING
   ========================================================= */

app.post(
    "/api/users/me/now-playing",
    requireAuth,
    (req, res) => {
        const songId =
            req.body.songId
                ? String(
                      req.body.songId
                  )
                : null;

        const playing =
            Boolean(
                req.body.playing
            );

        req.user.nowPlaying =
            songId && playing
                ? songId
                : null;

        req.user.lastActive =
            now();

        saveDatabase();

        io.emit(
            "now_playing_update",
            {
                userId:
                    req.user.id,

                song:
                    req.user.nowPlaying
            }
        );

        res.json({
            success: true
        });
    }
);

/* =========================================================
   FAVORITES - GET
   ========================================================= */

app.get(
    "/api/favorites",
    requireAuth,
    (req, res) => {
        const favorites =
            database.favorites.filter(
                item =>
                    item.userId ===
                    req.user.id
            );

        res.json({
            favorites
        });
    }
);

/* =========================================================
   FAVORITES - ADD
   ========================================================= */

app.post(
    "/api/favorites",
    requireAuth,
    (req, res) => {
        const songId =
            String(
                req.body.songId || ""
            ).trim();

        if (!songId) {
            return res.status(400).json({
                message:
                    "songId is required."
            });
        }

        const exists =
            database.favorites.some(
                item =>
                    item.userId ===
                        req.user.id &&
                    item.songId ===
                        songId
            );

        if (!exists) {
            database.favorites.push({
                id:
                    generateId(
                        "favorite"
                    ),

                userId:
                    req.user.id,

                songId,

                createdAt:
                    now()
            });

            saveDatabase();
        }

        res.json({
            success: true
        });
    }
);

/* =========================================================
   FAVORITES - REMOVE
   ========================================================= */

app.delete(
    "/api/favorites/:songId",
    requireAuth,
    (req, res) => {
        database.favorites =
            database.favorites.filter(
                item =>
                    !(
                        item.userId ===
                            req.user.id &&
                        item.songId ===
                            req.params.songId
                    )
            );

        saveDatabase();

        res.json({
            success: true
        });
    }
);

/* =========================================================
   FRIEND REQUESTS - GET
   ========================================================= */

app.get(
    "/api/friends/requests",
    requireAuth,
    (req, res) => {
        const requests =
            database.friendRequests
                .filter(
                    request =>
                        request.toUserId ===
                        req.user.id
                )
                .map(request => {
                    const sender =
                        findUserById(
                            request.fromUserId
                        );

                    return {
                        ...request,

                        username:
                            sender?.username ||
                            "User",

                        user:
                            publicUser(
                                sender
                            )
                    };
                });

        res.json({
            requests
        });
    }
);

/* =========================================================
   FRIEND REQUEST - SEND
   ========================================================= */

app.post(
    "/api/friends/requests/:userId",
    requireAuth,
    (req, res) => {
        const target =
            findUserById(
                req.params.userId
            );

        if (!target) {
            return res.status(404).json({
                message:
                    "User not found."
            });
        }

        if (
            target.id ===
            req.user.id
        ) {
            return res.status(400).json({
                message:
                    "You cannot add yourself."
            });
        }

        if (
            isFriend(
                req.user.id,
                target.id
            )
        ) {
            return res.status(409).json({
                message:
                    "You are already friends."
            });
        }

        const existing =
            database.friendRequests.find(
                request =>
                    (
                        request.fromUserId ===
                            req.user.id &&
                        request.toUserId ===
                            target.id
                    ) ||
                    (
                        request.fromUserId ===
                            target.id &&
                        request.toUserId ===
                            req.user.id
                    )
            );

        if (existing) {
            return res.status(409).json({
                message:
                    "A friend request already exists."
            });
        }

        const request = {
            id:
                generateId(
                    "request"
                ),

            fromUserId:
                req.user.id,

            toUserId:
                target.id,

            createdAt:
                now()
        };

        database.friendRequests.push(
            request
        );

        saveDatabase();

        io.emit(
            "friend_request",
            {
                request
            }
        );

        res.json({
            success: true,
            request
        });
    }
);

/* =========================================================
   FRIEND REQUEST - ACCEPT
   ========================================================= */

app.post(
    "/api/friends/requests/:requestId/accept",
    requireAuth,
    (req, res) => {
        const request =
            database.friendRequests.find(
                item =>
                    item.id ===
                        req.params.requestId &&
                    item.toUserId ===
                        req.user.id
            );

        if (!request) {
            return res.status(404).json({
                message:
                    "Friend request not found."
            });
        }

        database.friendRequests =
            database.friendRequests.filter(
                item =>
                    item.id !==
                    request.id
            );

        if (
            !isFriend(
                request.fromUserId,
                request.toUserId
            )
        ) {
            database.friendships.push({
                id:
                    generateId(
                        "friendship"
                    ),

                userA:
                    request.fromUserId,

                userB:
                    request.toUserId,

                createdAt:
                    now()
            });
        }

        saveDatabase();

        io.emit(
            "friends:updated"
        );

        res.json({
            success: true
        });
    }
);

/* =========================================================
   FRIEND LIST
   ========================================================= */

app.get(
    "/api/friends",
    requireAuth,
    (req, res) => {
        const friendships =
            database.friendships.filter(
                friendship =>
                    friendship.userA ===
                        req.user.id ||
                    friendship.userB ===
                        req.user.id
            );

        const friends =
            friendships
                .map(friendship => {
                    const friendId =
                        friendship.userA ===
                            req.user.id
                            ? friendship.userB
                            : friendship.userA;

                    return findUserById(
                        friendId
                    );
                })
                .filter(Boolean)
                .map(publicUser);

        res.json({
            friends
        });
    }
);

/* =========================================================
   GLOBAL CHAT - GET
   ========================================================= */

app.get(
    "/api/chat/global/messages",
    requireAuth,
    (req, res) => {
        const messages =
            database.messages.slice(
                -100
            );

        res.json({
            messages
        });
    }
);

/* =========================================================
   GLOBAL CHAT - SEND
   ========================================================= */

app.post(
    "/api/chat/global/messages",
    requireAuth,
    (req, res) => {
        const text =
            String(
                req.body.text || ""
            ).trim();

        if (!text) {
            return res.status(400).json({
                message:
                    "Message cannot be empty."
            });
        }

        if (text.length > 1000) {
            return res.status(400).json({
                message:
                    "Message is too long."
            });
        }

        const message = {
            id:
                generateId(
                    "message"
                ),

            userId:
                req.user.id,

            username:
                req.user.username,

            text,

            createdAt:
                now()
        };

        database.messages.push(
            message
        );

        saveDatabase();

        io.emit(
            "global:message",
            message
        );

        res.json({
            success: true,
            message
        });
    }
);

/* =========================================================
   USER PROFILE
   ========================================================= */

app.get(
    "/api/users/:userId",
    requireAuth,
    (req, res) => {
        const user =
            findUserById(
                req.params.userId
            );

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found."
            });
        }

        const favorites =
            database.favorites
                .filter(
                    item =>
                        item.userId ===
                        user.id
                )
                .map(
                    item => ({
                        songId:
                            item.songId
                    })
                );

        const friendship =
            isFriend(
                req.user.id,
                user.id
            );

        res.json({
            user: {
                ...publicUser(user),

                favorites,

                friendship
            }
        });
    }
);

/* =========================================================
   GROUPS - LIST
   ========================================================= */

app.get(
    "/api/groups",
    requireAuth,
    (req, res) => {
        const groups =
            database.groups.filter(
                group =>
                    isGroupMember(
                        group,
                        req.user.id
                    )
            );

        res.json({
            groups
        });
    }
);

/* =========================================================
   GROUPS - CREATE
   ========================================================= */

app.post(
    "/api/groups",
    requireAuth,
    (req, res) => {
        const name =
            String(
                req.body.name || ""
            ).trim();

        const description =
            String(
                req.body.description || ""
            ).trim();

        if (!name) {
            return res.status(400).json({
                message:
                    "Group name is required."
            });
        }

        if (name.length > 80) {
            return res.status(400).json({
                message:
                    "Group name is too long."
            });
        }

        if (description.length > 500) {
            return res.status(400).json({
                message:
                    "Group description is too long."
            });
        }

        const group = {
            id:
                generateId(
                    "group"
                ),

            name,

            description,

            ownerId:
                req.user.id,

            members: [
                req.user.id
            ],

            createdAt:
                now()
        };

        database.groups.push(
            group
        );

        saveDatabase();

        io.emit(
            "groups:updated"
        );

        res.json({
            success: true,
            group
        });
    }
);

/* =========================================================
   GROUP MEMBERS
   ========================================================= */

app.get(
    "/api/groups/:groupId/members",
    requireAuth,
    (req, res) => {
        const group =
            database.groups.find(
                item =>
                    item.id ===
                    req.params.groupId
            );

        if (!group) {
            return res.status(404).json({
                message:
                    "Group not found."
            });
        }

        if (
            !isGroupMember(
                group,
                req.user.id
            )
        ) {
            return res.status(403).json({
                message:
                    "You are not a member of this group."
            });
        }

        const members =
            group.members
                .map(findUserById)
                .filter(Boolean)
                .map(publicUser);

        res.json({
            members
        });
    }
);

/* =========================================================
   GROUP INVITE
   ========================================================= */

app.post(
    "/api/groups/:groupId/invite",
    requireAuth,
    (req, res) => {
        const group =
            database.groups.find(
                item =>
                    item.id ===
                    req.params.groupId
            );

        if (!group) {
            return res.status(404).json({
                message:
                    "Group not found."
            });
        }

        if (
            !isGroupMember(
                group,
                req.user.id
            )
        ) {
            return res.status(403).json({
                message:
                    "You are not a member of this group."
            });
        }

        const user =
            findUserById(
                req.body.userId
            );

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found."
            });
        }

        if (
            group.members.includes(
                user.id
            )
        ) {
            return res.status(409).json({
                message:
                    "User is already a member."
            });
        }

        if (
            !isFriend(
                req.user.id,
                user.id
            )
        ) {
            return res.status(403).json({
                message:
                    "You can only invite friends."
            });
        }

        group.members.push(
            user.id
        );

        saveDatabase();

        io.emit(
            "group:updated",
            {
                groupId:
                    group.id
            }
        );

        res.json({
            success: true
        });
    }
);

/* =========================================================
   GROUP CHAT - GET
   ========================================================= */

app.get(
    "/api/groups/:groupId/messages",
    requireAuth,
    (req, res) => {
        const group =
            database.groups.find(
                item =>
                    item.id ===
                    req.params.groupId
            );

        if (!group) {
            return res.status(404).json({
                message:
                    "Group not found."
            });
        }

        if (
            !isGroupMember(
                group,
                req.user.id
            )
        ) {
            return res.status(403).json({
                message:
                    "You are not a member of this group."
            });
        }

        const messages =
            database.groupMessages
                .filter(
                    message =>
                        message.groupId ===
                        group.id
                )
                .slice(-100);

        res.json({
            messages
        });
    }
);

/* =========================================================
   GROUP CHAT - SEND
   ========================================================= */

app.post(
    "/api/groups/:groupId/messages",
    requireAuth,
    (req, res) => {
        const group =
            database.groups.find(
                item =>
                    item.id ===
                    req.params.groupId
            );

        if (!group) {
            return res.status(404).json({
                message:
                    "Group not found."
            });
        }

        if (
            !isGroupMember(
                group,
                req.user.id
            )
        ) {
            return res.status(403).json({
                message:
                    "You are not a member of this group."
            });
        }

        const text =
            String(
                req.body.text || ""
            ).trim();

        if (!text) {
            return res.status(400).json({
                message:
                    "Message cannot be empty."
            });
        }

        if (text.length > 1000) {
            return res.status(400).json({
                message:
                    "Message is too long."
            });
        }

        const message = {
            id:
                generateId(
                    "groupmsg"
                ),

            groupId:
                group.id,

            userId:
                req.user.id,

            username:
                req.user.username,

            text,

            createdAt:
                now()
        };

        database.groupMessages.push(
            message
        );

        saveDatabase();

        io.emit(
            "group:message",
            message
        );

        res.json({
            success: true,
            message
        });
    }
);

/* =========================================================
   LISTEN TOGETHER - CREATE / GET ROOM
   ========================================================= */

app.post(
    "/api/listen-together/rooms",
    requireAuth,
    (req, res) => {
        const group =
            database.groups.find(
                item =>
                    item.id ===
                    req.body.groupId
            );

        if (!group) {
            return res.status(404).json({
                message:
                    "Group not found."
            });
        }

        if (
            !isGroupMember(
                group,
                req.user.id
            )
        ) {
            return res.status(403).json({
                message:
                    "You are not a member of this group."
            });
        }

        let room =
            database.listenRooms.find(
                item =>
                    item.groupId ===
                    group.id
            );

        if (!room) {
            room = {
                id:
                    generateId(
                        "listen"
                    ),

                name:
                    `${group.name} — Listen Together`,

                groupId:
                    group.id,

                songId:
                    req.body.songId ||
                    null,

                position: 0,

                playing: false,

                members:
                    [...group.members],

                createdAt:
                    now()
            };

            database.listenRooms.push(
                room
            );
        } else {
            room.members =
                [...group.members];

            if (
                req.body.songId
            ) {
                room.songId =
                    String(
                        req.body.songId
                    );
            }
        }

        saveDatabase();

        io.emit(
            "listen:room",
            room
        );

        res.json({
            success: true,
            room
        });
    }
);

/* =========================================================
   LISTEN TOGETHER - STATE
   ========================================================= */

app.post(
    "/api/listen-together/rooms/:roomId/state",
    requireAuth,
    (req, res) => {
        const room =
            database.listenRooms.find(
                item =>
                    item.id ===
                    req.params.roomId
            );

        if (!room) {
            return res.status(404).json({
                message:
                    "Listen room not found."
            });
        }

        const group =
            database.groups.find(
                item =>
                    item.id ===
                    room.groupId
            );

        if (
            !group ||
            !isGroupMember(
                group,
                req.user.id
            )
        ) {
            return res.status(403).json({
                message:
                    "You cannot control this room."
            });
        }

        if (
            req.body.songId
        ) {
            room.songId =
                String(
                    req.body.songId
                );
        }

        if (
            req.body.position !==
            undefined
        ) {
            room.position =
                Number(
                    req.body.position
                ) || 0;
        }

        if (
            req.body.playing !==
            undefined
        ) {
            room.playing =
                Boolean(
                    req.body.playing
                );
        }

        saveDatabase();

        const payload = {
            roomId:
                room.id,

            action:
                req.body.action ||
                null,

            songId:
                room.songId,

            position:
                room.position,

            playing:
                room.playing,

            userId:
                req.user.id
        };

        io.emit(
            "listen:state",
            payload
        );

        res.json({
            success: true,
            room
        });
    }
);

/* =========================================================
   LISTEN TOGETHER - LEAVE
   ========================================================= */

app.post(
    "/api/listen-together/rooms/:roomId/leave",
    requireAuth,
    (req, res) => {
        const room =
            database.listenRooms.find(
                item =>
                    item.id ===
                    req.params.roomId
            );

        if (!room) {
            return res.status(404).json({
                message:
                    "Listen room not found."
            });
        }

        room.members =
            room.members.filter(
                id =>
                    id !==
                    req.user.id
            );

        if (
            room.members.length ===
            0
        ) {
            database.listenRooms =
                database.listenRooms.filter(
                    item =>
                        item.id !==
                        room.id
                );
        }

        saveDatabase();

        io.emit(
            "listen:updated",
            {
                roomId:
                    room.id,
                members:
                    room.members
            }
        );

        res.json({
            success: true
        });
    }
);

/* =========================================================
   SOCKET HELPERS
   ========================================================= */

function broadcastOnlineCount() {
    const count =
        database.users.filter(
            user =>
                user.online === true
        ).length;

    io.emit(
        "online:count",
        count
    );
}

function setUserOffline(
    userId
) {
    const user =
        findUserById(userId);

    if (!user) {
        return;
    }

    user.online = false;
    user.lastActive = now();
    user.nowPlaying = null;

    saveDatabase();

    io.emit(
        "user_status",
        {
            userId:
                user.id,

            status:
                "offline",

            lastActive:
                user.lastActive
        }
    );

    broadcastOnlineCount();
}

/* =========================================================
   SOCKET.IO CONNECTION
   ========================================================= */

io.on(
    "connection",
    socket => {
        console.log(
            "Socket connected:",
            socket.id
        );

        socket.on(
            "user_online",
            userId => {
                const user =
                    findUserById(
                        userId
                    );

                if (!user) {
                    return;
                }

                user.online = true;
                user.lastActive =
                    now();

                connectedSockets.set(
                    socket.id,
                    user.id
                );

                saveDatabase();

                io.emit(
                    "user_status",
                    {
                        userId:
                            user.id,

                        status:
                            "online",

                        lastActive:
                            user.lastActive
                    }
                );

                broadcastOnlineCount();
            }
        );

        socket.on(
            "user_offline",
            userId => {
                const user =
                    findUserById(
                        userId
                    );

                if (!user) {
                    return;
                }

                setUserOffline(
                    user.id
                );

                connectedSockets.delete(
                    socket.id
                );
            }
        );

        socket.on(
            "disconnect",
            () => {
                const userId =
                    connectedSockets.get(
                        socket.id
                    );

                if (userId) {
                    setUserOffline(
                        userId
                    );

                    connectedSockets.delete(
                        socket.id
                    );
                }

                console.log(
                    "Socket disconnected:",
                    socket.id
                );
            }
        );
    }
);

/* =========================================================
   404
   ========================================================= */

app.use(
    "/api",
    (req, res) => {
        res.status(404).json({
            message:
                "API endpoint not found."
        });
    }
);

/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use(
    (error, req, res, next) => {
        console.error(
            "SERVER ERROR:",
            error
        );

        if (
            res.headersSent
        ) {
            return next(error);
        }

        res.status(500).json({
            message:
                "Internal server error."
        });
    }
);

/* =========================================================
   START SERVER
   ========================================================= */

server.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "        MUSIC WORLD BACKEND"
        );
        console.log(
            "========================================"
        );
        console.log(
            `Environment: ${
                process.env.NODE_ENV ||
                "development"
            }`
        );
        console.log(
            `Port: ${PORT}`
        );
        console.log(
            `Frontend: ${FRONTEND_ORIGIN}`
        );
        console.log(
            `Health: /api/health`
        );
        console.log(
            "========================================"
        );
        console.log("");
    }
);