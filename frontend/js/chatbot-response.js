// get DOM elements
const chatInput = document.querySelector("#chatbot-input #user-input");
const sendChatBtn = document.querySelector("#chatbot-input #send");
const chatbox = document.querySelector(".chatbox");
const chatmessages = document.querySelector("#chat-messages");
const summarizeBtn = document.querySelector("#summarization");
const citationBtn = document.querySelector('#citation');
const similarPapersBtn = document.querySelector("#similar-papers");

// Navigation Search Bar 
var inputElement = document.getElementById("search-bar");

if (inputElement) {
    inputElement.addEventListener("keydown", function (event) {
        // Check if the pressed key is Enter 
        if (event.keyCode === 13) {
            var search = document.getElementById("search-bar").value;
            if (search !== null && search.trim() !== "") {
                localStorage.setItem("searchValue", search);
            }

            // Construct the URL for the destination HTML file
            var destinationURL = "../public/searchresults.html";

            // Redirect to the destination HTML file first
            window.location.href = destinationURL;

            event.preventDefault();
        }
    });
}

// API endpoints
const COMPLETION_API_URL = '/get-completions'; 
const SUMMARY_API_URL = '/get-summary';
const CITATION_API_URL = '/get-citation';
const SIMILAR_PAPERS_API_URL = '/get-similar-papers';

let userMessage;

// Retrieve arXiv PDF URL from URL 
const urlParams = new URLSearchParams(window.location.search);
const pdfURL = urlParams.get('pdfURL');

// Embed the PDF using the retrieved URL
if (pdfURL) {
    const pdfEmbed = document.getElementById('pdf-embed');
    pdfEmbed.src = decodeURIComponent(pdfURL);
}

// Create Chat List Items
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = `<p>${message.replace(/\n/g, '<br>')}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

// Generate Response for User-Inputted Question
const generateResponse = async (userMessage) => {
    try {
        displayBubbles(); 

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userMessage, pdfURL }),
        };

        // send POST request to API endpoint
        const response = await fetch(COMPLETION_API_URL, requestOptions);
        const responseData = await response.json(); 

        if (response.ok) {
            // Update the chatbox div with AI response
            const generatedMessage = responseData.content;
            chatbox.appendChild(createChatLi(generatedMessage, "incoming"));
            chatmessages.scrollTo(0, chatbox.scrollHeight);
        } else {
            console.error('Error:', response.status, response.statusText);
        }

        hideBubbles(); 
    } catch (error) {
        console.error('Error:', error);
    }
};

// Display loading bubbles 
function displayBubbles() {
    document.querySelector("#loading-container").style.display="block";
}

// Hide loading bubbles 
function hideBubbles() {
    document.querySelector("#loading-container").style.display="none";
}

// Displays user message and generates response
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Add user message to chatbox div
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatmessages.scrollTo(0, chatbox.scrollHeight);

    chatInput.value = '';

    requestAnimationFrame(() => {
        generateResponse(userMessage);
        chatmessages.scrollTo(0, chatbox.scrollHeight);
    });
};

const summarize = async () => {
    try {
        displayBubbles(); 

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfURL }),
        };

        // Send POST request to API endpoint
        const response = await fetch(SUMMARY_API_URL, requestOptions);
        const responseData = await response.json(); 

        if (response.ok) {
            // Update chatbox with the generated message
            const generatedMessage = responseData.content;
            chatbox.appendChild(createChatLi(generatedMessage, "incoming"));
            chatmessages.scrollTo(0, chatbox.scrollHeight);
        } else {
            console.error('Error:', response.status, response.statusText);
        }

        hideBubbles(); 
    } catch (error) {
        console.error('Error:', error);
    }
}

function addNewLinesAfterCitations(text) {
    // Define the pattern for identifying the citation styles
    const pattern = /(MLA|IEEE|Chicago)\sCitation:\s.*?\d{4}\./g;
    
    // Replace the citation styles with the same style preceded by '\n'
    const formattedText = text.replace(pattern, '\n\n$&');
    
    return formattedText;
}


const cite = async () => {
    try {
        displayBubbles();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfURL }),
        };

        // Send POST request to API endpoint
        const response = await fetch(CITATION_API_URL, requestOptions);
        const responseData = await response.json(); // parse the response as JSON

        if (response.ok) {
            // Update the chatbox with the generated message
            const generatedMessage = responseData.content;
            const formattedCitations = addNewLinesAfterCitations(generatedMessage);
            chatbox.appendChild(createChatLi(formattedCitations, "incoming"));
            chatmessages.scrollTo(0, chatbox.scrollHeight);
        } else {
            console.error('Error:', response.status, response.statusText);
        }
        hideBubbles();
    } catch (error) {
        console.error('Error:', error);
    }
}

const similarPapers = async () => {
    try {
        displayBubbles();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfURL }), 
        };

        // Send POST request to API endpoint
        const response = await fetch(SIMILAR_PAPERS_API_URL, requestOptions);
        const responseData = await response.json(); 
        
        if (response.ok) {
            const generatedMessage = responseData.content;
            if (generatedMessage === "We apologize for the inconvenience, but it seems the research paper you provided is too lengthy for our current processing capabilities. We kindly recommend considering a shorter paper or consulting alternative sources. Thank you for your understanding.") {
                chatbox.appendChild(createChatLi(generatedMessage, "incoming"));
                chatmessages.scrollTo(0, chatbox.scrollHeight);
                hideBubbles();
            } else {
                localStorage.setItem("searchValue", generatedMessage);
    
                // Construct the URL for the destination HTML file
                const destinationURL = "../public/searchresults.html";
    
                // Redirect to the destination HTML file
                window.location.href = destinationURL;
            }
        } else {
            console.error('Error:', response.status, response.statusText);
        }
        hideBubbles();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Event listeners
if (sendChatBtn) {
    sendChatBtn.addEventListener("click", handleChat);
}

if (chatInput) {
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleChat();
        }
    });
}

if (summarizeBtn) {
    summarizeBtn.addEventListener("click", summarize);
}

if (citationBtn) {
    citationBtn.addEventListener("click", cite);
}

if (similarPapersBtn) {
    similarPapersBtn.addEventListener("click", similarPapers);
}

module.exports = {
    generateResponse,
    cite,
    summarize,
    similarPapers,
    addNewLinesAfterCitations,
    displayBubbles,
    hideBubbles,
    createChatLi,
    generateResponse
};
