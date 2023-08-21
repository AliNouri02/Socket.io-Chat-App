"use strict";

var socket = io();
var chatNamespace = io("/chat"); //Query DOM

var messageInput = document.getElementById("messageInput"),
    chatForm = document.getElementById("chatForm"),
    chatBox = document.getElementById("chat-box"),
    feedback = document.getElementById("feedback"),
    onlineUsers = document.getElementById("online-users-list"),
    chatContainer = document.getElementById("chatContainer"),
    pvChatForm = document.getElementById("pvChatForm"),
    pvMessageInput = document.getElementById("pvMessageInput"),
    modalTitle = document.getElementById("modalTitle"),
    pvChatMessage = document.getElementById("pvChatMessage");
var nickname = localStorage.getItem("nickname"),
    roomNumber = localStorage.getItem("chatroom");
var socketId; // Emit Events

chatNamespace.emit("login", {
    nickname: nickname,
    roomNumber: roomNumber,
});
chatForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (messageInput.value) {
        chatNamespace.emit("chat message", {
            message: messageInput.value,
            name: nickname,
            roomNumber: roomNumber,
        });
        messageInput.value = "";
    }
});
messageInput.addEventListener("keypress", function () {
    chatNamespace.emit("typing", {
        name: nickname,
        roomNumber: roomNumber,
    });
});
pvChatForm.addEventListener("submit", function (e) {
    e.preventDefault();
    chatNamespace.emit("pvChat", {
        message: pvMessageInput.value,
        name: nickname,
        to: socketId,
        from: chatNamespace.id,
    });
    $("#pvChat").modal("hide");
    pvMessageInput.value = "";
}); // Listening

chatNamespace.on("online", function (users) {
    onlineUsers.innerHTML = "";

    for (var _socketId in users) {
        if (roomNumber === users[_socketId].roomNumber) {
            onlineUsers.innerHTML +=
                '\n            <li >\n                <button type="button" class="btn btn-light mx-2 p-2" data-toggle="modal" data-target="#pvChat" data-id='
                    .concat(_socketId, " data-client=")
                    .concat(users[_socketId].nickname, "\n                ")
                    .concat(
                        users[_socketId].nickname === nickname
                            ? "disabled"
                            : "",
                        ">\n                "
                    )
                    .concat(
                        users[_socketId].nickname,
                        '\n                    <span class="badge badge-success"> </span>\n                </button>\n            </li>\n        '
                    );
        }
    }
});
chatNamespace.on("chat message", function (data) {
    feedback.innerHTML = "";
    chatBox.innerHTML +=
        '\n                        <li class="alert alert-light">\n                            <span\n                                class="text-dark font-weight-normal"\n                                style="font-size: 13pt"\n                                >'
            .concat(
                data.name,
                '</span\n                            >\n                            <span\n                                class="\n                                    text-muted\n                                    font-italic font-weight-light\n                                    m-2\n                                "\n                                style="font-size: 9pt"\n                                >\u0633\u0627\u0639\u062A 12:00</span\n                            >\n                            <p\n                                class="alert alert-info mt-2"\n                                style="font-family: persian01"\n                            >\n                            '
            )
            .concat(
                data.message,
                "\n                            </p>\n                        </li>"
            );
    chatContainer.scrollTop =
        chatContainer.scrollHeight - chatContainer.clientHeight;
});
chatNamespace.on("typing", function (data) {
    if (roomNumber === data.roomNumber)
        feedback.innerHTML = '<p class="alert alert-warning w-25"><em>'.concat(
            data.name,
            " \u062F\u0631 \u062D\u0627\u0644 \u0646\u0648\u0634\u062A\u0646 \u0627\u0633\u062A ... </em></p>"
        );
});
chatNamespace.on("pvChat", function (data) {
    $("#pvChat").modal("show");
    socketId = data.from;
    modalTitle.innerHTML = "دریافت پیام از طرف : " + data.name;
    pvChatMessage.style.display = "block";
    pvChatMessage.innerHTML = data.name + " : " + data.message;
}); //JQuery

$("#pvChat").on("show.bs.modal", function (e) {
    var button = $(e.relatedTarget);
    var user = button.data("client");
    socketId = button.data("id");
    modalTitle.innerHTML = "ارسال پیام شخصی به :" + user;
    pvChatMessage.style.display = "none";
});
