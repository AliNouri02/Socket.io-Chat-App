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


// Setup websocket

let onlineUsers = {}

//simple example of middelware

// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     const id = 11021102
//     if (token == undefined) {
//         console.log("client is not conneting");
//     } else if (token != id) {
//         console.log("you cant login");
//     }
//     if (token === id)
//         next()
// })

const chatNamespace = io.of("/chat");


chatNamespace.on("connection", (socket) => {
    // console.log(`User connected. ${socket.id}`);

    // Listening

    socket.on("login", (data) => {
        console.log(`${data.nickname} Connected.`);
        socket.join(data.roomNumber);

        onlineUsers[socket.id] = {
            nickname: data.nickname,
            roomNumber: data.roomNumber,
        };
        chatNamespace.emit("online", onlineUsers);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected.`);
        delete onlineUsers[socket.id];
        chatNamespace.emit("online", onlineUsers);
    });

    socket.on("chat message", (data) => {
        chatNamespace.to(data.roomNumber).emit("chat message", data);
    });

    socket.on("typing", (data) => {
        socket.broadcast.in(data.roomNumber).emit("typing", data);
    });

    socket.on("pvChat", (data) => {
        console.log(`Private Chat Data: ${data}`);
        console.log(data.to);
        chatNamespace.to(data.to).emit("pvChat", data);
    });
});
