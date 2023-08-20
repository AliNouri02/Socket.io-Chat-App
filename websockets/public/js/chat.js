const socket = io();

//Query DOM
const messageInput = document.getElementById("messageInput"),
    chatForm = document.getElementById("chatForm"),
    chatBox = document.getElementById("chat-box"),
    feedback = document.getElementById("feedback"),
    onlineUsers = document.getElementById("online-users-list"),
    chatContainer = document.getElementById("chatContainer");

const nickname = localStorage.getItem("nickname");
// Emit Events
socket.emit("login", nickname);

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit("chat message", {
            message: messageInput.value,
            name: nickname,
        });
        messageInput.value = "";
    }
});

messageInput.addEventListener("keypress", () => {
    socket.emit("typing", { name: nickname });
});

// Listening

socket.on("online", (data) => {
    onlineUsers.innerHTML = "";
    Object.values(data).forEach((value) => {
        onlineUsers.innerHTML += `
            <li class="alert alert-light p-1 mx-2">
                ${value}
                <span class="badge badge-success">آنلاین</span>
            </li>
        `;
    });
});

socket.on("chat message", (data) => {
    feedback.innerHTML = "";
    chatBox.innerHTML += `
                        <li class="alert alert-light">
                            <span
                                class="text-dark font-weight-normal"
                                style="font-size: 13pt"
                                >${data.name}</span
                            >
                            <span
                                class="
                                    text-muted
                                    font-italic font-weight-light
                                    m-2
                                "
                                style="font-size: 9pt"
                                >ساعت 12:00</span
                            >
                            <p
                                class="alert alert-info mt-2"
                                style="font-family: persian01"
                            >
                            ${data.message}
                            </p>
                        </li>`;
    chatContainer.scrollTop =
        chatContainer.scrollHeight - chatContainer.clientHeight;
});

socket.on("typing", (data) => {
    feedback.innerHTML = `<p class="alert alert-warning w-25"><em>${data.name} در حال نوشتن است ... </em></p>`;
});
