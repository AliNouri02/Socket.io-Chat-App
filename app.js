const http = require("http");

const express = require("express");
const { Server } = require("socket.io");

const app = express(); //? Request Handler Valid createServer()
const server = http.createServer(app);
const io = new Server(server);

// Static folder
app.use(express.static("public"));

const PORT = process.env.PORT || 3030;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

let onlineUsers = {}

// Setup websocket

io.on("connection", (socket) => {

    // Listening
    socket.on("login", nickname => {
        console.log(`${nickname} Connected.`);
        onlineUsers[socket.id] = nickname
        io.sockets.emit("online", onlineUsers)
    })

    socket.on("disconnect",() => {
        const disconnectedUser = onlineUsers[socket.id];
        if (disconnectedUser) {
            console.log(`User '${disconnectedUser}' disconnected. ${socket.id}`);
            delete onlineUsers[socket.id];
            io.sockets.emit("online", onlineUsers);
        }
    });

    socket.on("chat_message", data => {
        io.sockets.emit("chat_message", data)
    })

    socket.on("typing", data => {
        socket.broadcast.emit("typing", data)
    })
});
