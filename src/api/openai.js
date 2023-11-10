import('dotenv').config();

const chatInput = document.querySelector("#chatbot-input #user-input");
const sendChatBtn = document.querySelector("#chatbot-input #send");
const chatbox = document.querySelector(".chatbox");
const chatmessages = document.querySelector("#chat-messages");

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

const generateResponse = (IncomingChatLI) => {
    const API_URL = "/api/openai"; // Assuming your server is running on the same domain

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        }),
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const messageElement = IncomingChatLI.querySelector("p");
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            const messageElement = IncomingChatLI.querySelector("p");
            messageElement.textContent = "Something went wrong! Please try again.";
            console.log(error);
        }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const IncomingChatLI = createChatLi("...", "incoming");
        chatbox.appendChild(IncomingChatLI);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(IncomingChatLI);
    }, 600);
};

sendChatBtn.addEventListener("click", handleChat);


sendChatBtn.addEventListener("click", handleChat);
