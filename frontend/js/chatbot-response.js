// get DOM elements
const chatInput = document.querySelector("#chatbot-input #user-input");
const sendChatBtn = document.querySelector("#chatbot-input #send");
const chatbox = document.querySelector(".chatbox");
const chatmessages = document.querySelector("#chat-messages");
const summarizeBtn = document.querySelector("#summarization");
const citationBtn = document.querySelector('#citation');
const similarPapersBtn = document.querySelector("#similar-papers");

// navigation search bar funtionality
var inputElement = document.getElementById("search-bar");

inputElement.addEventListener("keydown", function (event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.keyCode === 13) {
        var search = document.getElementById("search-bar").value;
        if (search !== null && search.trim() !== "") {
            localStorage.setItem("searchValue", search);
            console.log("added search value to localStorage");
        }

        // Construct the URL for the destination HTML file
        var destinationURL = "../public/searchresults.html";

        // Redirect to the destination HTML file first
        window.location.href = destinationURL;

        event.preventDefault();
    }
});

// API endpoints
const COMPLETION_API_URL = '/get-completions'; 
const SUMMARY_API_URL = '/get-summary';
const CITATION_API_URL = '/get-citation';
const SIMILAR_PAPERS_API_URL = '/get-similar-papers';

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
    // replace newlines with line breaks in html
    let chatContent = `<p>${message.replace(/\n/g, '<br>')}</p>`;
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

function addNewLinesAfterCitations(text) {
    // Define the pattern for identifying the citation styles and capturing them
    const pattern = /(MLA|IEEE|Chicago)\sCitation:\s.*?\d{4}\./g;
    
    // Replace the identified citation styles with the same style preceded by a newline character
    const formattedText = text.replace(pattern, '\n\n$&');
    
    return formattedText;
}


const cite = async () => {
    console.log("got to cite function");
    try {
        displayBubbles();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfURL }),
        };

        // send POST request to API endpoint
        const response = await fetch(CITATION_API_URL, requestOptions);
        const responseData = await response.json(); // parse the response as JSON

        if (response.ok) {
            // update the chatbox with the generated message
            const generatedMessage = responseData.content;
            const formattedCitations = addNewLinesAfterCitations(generatedMessage);
            chatbox.appendChild(createChatLi(formattedCitations, "incoming"));
            chatmessages.scrollTo(0, chatbox.scrollHeight);
        } else {
            // log error
            console.error('Error:', response.status, response.statusText);
        }
        hideBubbles();
    } catch (error) {
        console.error('Error:', error);
    }
}

const similarPapers = async () => {
    console.log("got to similar papers function");
    try {
        displayBubbles();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfURL }), // Assuming pdfURL is declared elsewhere
        };

        // send POST request to API endpoint
        const response = await fetch(SIMILAR_PAPERS_API_URL, requestOptions);
        const responseData = await response.json(); // parse the response as JSON
        
        if (response.ok) {
            // use the generated message as a query to be searched
            const generatedMessage = responseData.content;
            if (generatedMessage === "We apologize for the inconvenience, but it seems the research paper you provided is too lengthy for our current processing capabilities. We kindly recommend considering a shorter paper or consulting alternative sources. Thank you for your understanding.") {
                chatbox.appendChild(createChatLi(generatedMessage, "incoming"));
                chatmessages.scrollTo(0, chatbox.scrollHeight);
                hideBubbles();
            } else {
                localStorage.setItem("searchValue", generatedMessage);
                console.log("added search value to localStorage");
    
                // Construct the URL for the destination HTML file
                const destinationURL = "../public/searchresults.html";
    
                // Redirect to the destination HTML file
                window.location.href = destinationURL;
            }
        } else {
            // log error
            console.error('Error:', response.status, response.statusText);
        }
        hideBubbles();
    } catch (error) {
        console.error('Error:', error);
    }
};

export default { generateResponse, summarize, cite };

// event listeners
sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleChat();
    }
});

summarizeBtn.addEventListener("click", summarize);
citationBtn.addEventListener("click", cite);
similarPapersBtn.addEventListener("click", similarPapers);
