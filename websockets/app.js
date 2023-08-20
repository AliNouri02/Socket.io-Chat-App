const http = require("http");

const express = require("express");
const { Server } = require("socket.io");

const app = express(); //? Request Handler Valid createServer()
const server = http.createServer(app);
const io = new Server(server);

// Static folder
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Setup websocket

const users = {};

io.on("connection", (socket) => {
    // console.log(`User connected. ${socket.id}`);

    // Listening

    socket.on("login", (nickname) => {
        console.log(`${nickname} Connected.`);
        users[socket.id] = nickname;
        io.sockets.emit("online", users);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected.`);
        delete users[socket.id];
        io.sockets.emit("online", users);
    });

    socket.on("chat message", (data) => {
        io.sockets.emit("chat message", data);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });
});
