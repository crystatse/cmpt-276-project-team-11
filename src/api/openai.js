const chatInput = document.querySelector("#chatbot-input #user-input");
const sendChatBtn = document.querySelector("#chatbot-input #send");
const chatbox = document.querySelector(".chatbox");
const chatmessages = document.querySelector("#chat-messages");

const API_URL = 'http://localhost:3002/get-completions'; // Update with your server URL

let userMessage;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

// openai.js

const generateResponse = async (userMessage) => {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userMessage }),
        };

        const response = await fetch(API_URL, requestOptions);
        const responseData = await response.json(); // Parse the response as JSON

        if (response.ok) {
            console.log('Response from server:', responseData.content);

            // Update the chatbox with the generated message
            const generatedMessage = responseData.content;
            chatbox.appendChild(createChatLi(generatedMessage, "incoming"));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        } else {
            console.error('Error:', response.status, response.statusText);
            console.log('Error response body:', responseData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};




export default { generateResponse };



const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(userMessage);
// Pass the user message content only

    }, 600);
};


sendChatBtn.addEventListener("click", handleChat);
