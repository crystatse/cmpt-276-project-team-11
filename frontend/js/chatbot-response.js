// get DOM elements
const chatInput = document.querySelector("#chatbot-input #user-input");
const sendChatBtn = document.querySelector("#chatbot-input #send");
const chatbox = document.querySelector(".chatbox");
const chatmessages = document.querySelector("#chat-messages");
const summarizeBtn = document.querySelector("#summarization");

// API endpoints
const COMPLETION_API_URL = 'http://localhost:3002/get-completions'; 
const SUMMARY_API_URL = 'http://localhost:3002/get-summary';

// user input
let userMessage;

// arXiv pdf URL
const urlParams = new URLSearchParams(window.location.search);
const pdfURL = urlParams.get('pdfURL');

// Embed the PDF using the retrieved URL
if (pdfURL) {
    const pdfEmbed = document.getElementById('pdf-embed');
    pdfEmbed.src = decodeURIComponent(pdfURL);
}

// creates chat message list items
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

// generates response using server API
const generateResponse = async (userMessage) => {
    try {
        displayBubbles(); // display loading bubbles

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userMessage, pdfURL }),
        };

        // send POST request to API endpoint
        const response = await fetch(COMPLETION_API_URL, requestOptions);
        const responseData = await response.json(); // parse the response as JSON

        if (response.ok) {
            // update the chatbox with the generated message
            const generatedMessage = responseData.content;
            chatbox.appendChild(createChatLi(generatedMessage, "incoming"));
            chatmessages.scrollTo(0, chatbox.scrollHeight);
        } else {
            // log error
            console.error('Error:', response.status, response.statusText);
        }

        hideBubbles(); // hide loading bubbles
    } catch (error) {
        console.error('Error:', error);
    }
};

// displays loading bubbles before generating AI response
function displayBubbles() {
    document.querySelector("#loading-container").style.display="block";
}

// hides loading bubbles after AI response has been displayed
function hideBubbles() {
    document.querySelector("#loading-container").style.display="none";
}

// handles user input and initiates chat
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // add user message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatmessages.scrollTo(0, chatbox.scrollHeight);

    // clear input field
    chatInput.value = '';

    // autoscroll
    requestAnimationFrame(() => {
        generateResponse(userMessage);

        // scroll to the bottom again after receiving the incoming message
        chatmessages.scrollTo(0, chatbox.scrollHeight);
    });
};

const summarize = async () => {
    try {
        displayBubbles(); // display loading bubbles

        console.log("got to summarize function");
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfURL }),
        };

        // send POST request to API endpoint
        const response = await fetch(SUMMARY_API_URL, requestOptions);
        const responseData = await response.json(); // parse the response as JSON

        if (response.ok) {
            // update the chatbox with the generated message
            const generatedMessage = responseData.content;
            chatbox.appendChild(createChatLi(generatedMessage, "incoming"));
            chatmessages.scrollTo(0, chatbox.scrollHeight);
        } else {
            // log error
            console.error('Error:', response.status, response.statusText);
        }

        hideBubbles(); // hide loading bubbles
    } catch (error) {
        console.error('Error:', error);
    }
}

export default { generateResponse, summarize };

// event listeners
sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleChat();
    }
});

summarizeBtn.addEventListener("click", summarize);
