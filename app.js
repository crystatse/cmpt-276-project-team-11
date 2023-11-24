const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { openai } = require('./config/open-ai.js');
const axios = require('axios');
const pdf = require('pdf-parse');
const path = require('path');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002


app.use(cors());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'frontend', 'public')));

app.get('index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
  });

// Serve about.html when /about is accessed
app.get('about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'about.html'));
  });

app.get('/public/searchresults.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'searchresults.html'));
  });
// css pages routing

app.get('/css/homepage.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'css', 'homepage.css'));
});

app.get('/css/about.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'css', 'about.css'));
});

app.get('/css/searchresults.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'css', 'searchresults.css'));
});

app.get('/css/chatbot.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'css', 'chatbot.css'));
});

//images routing

app.get('/images/article_icon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'images', 'article_icon.png'));
});

app.get('/images/chat-icon-white.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'images', 'chat-icon-white.png'));
});

app.get('/images/home-icon-purple.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'images', 'home-icon-purple.png'));
});

app.get('/images/paper-icon-white.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'images', 'paper-icon-white.png'));
});

app.get('/images/pencil-icon-white.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'images', 'pencil-icon-white.png'));
});

// js files

app.get('/js/homepage.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'js', 'homepage.js'));
});

app.get('/js/about.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'js', 'about.js'));
});

app.get('/js/chatbot-response.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'js', 'chatbot-response.js'));
});

app.get('/js/searchresults.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'js', 'searchresults.js'));
});




// endpoint to get answers to user-inputted questions
app.post('/get-completions', async (req, res) => {
    
    try {
        const { userMessage, pdfURL } = req.body;

        // fetch PDF data from URL
        const response = await axios.get(pdfURL, { responseType: 'arraybuffer' });
        const data = response.data;

        // parse PDF text
        const pdfText = await pdf(data);
        const textContent = pdfText.text;

        // splits text into chunks
        function splitTextIntoChunks(text, chunkSize) {
            const chunks = [];
            for (let i = 0; i < text.length; i += chunkSize) {
                chunks.push(text.slice(i, i + chunkSize));
            }
            return chunks;
        }
        
        const chunkSize = 1000; 
        const textChunks = splitTextIntoChunks(textContent, chunkSize);

        // returns error message if text exceeds token limit
        if (textChunks.length > 40) { 
            res.json({content: "We apologize for the inconvenience, but it seems the research paper you provided is too lengthy for our current processing capabilities. We kindly recommend considering a shorter paper or consulting alternative sources. Thank you for your understanding."});
        } 

        else {
            // generates chatbot response using GPT 3.5 turbo model (16k max tokens)
            const chatCompletion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo-16k',
                messages: [
                    ...textChunks.map(chunk => ({ role: 'system', content: chunk })),
                    { role: 'system', content: `Your goal is to answer user inquiries related to the content of the previous segments of text. \nPlease provide informative and relevant responses. If a user asks an unrelated question, gently encourage them to ask about the text. Assume the user is interested in learning more about the information in the text or gaining a better understanding of the text itself.` },
                    { role: 'user', content: userMessage } 
                ]
            });
            // send answer as JSON response
            res.json({ content: chatCompletion.choices[0].message.content });
        }
    } catch (error) {
        // log and handle errors
        console.error('Server Error:', error); // Log the actual error to the console
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// endpoint to get summary of selected research paper
app.post('/get-summary', async (req, res) => {
    try {
        console.log("got to api route");
        const { pdfURL } = req.body;

        const response = await axios.get(pdfURL, { responseType: 'arraybuffer' });
        const data = response.data;

        const pdfText = await pdf(data);
        const textContent = pdfText.text;

        function splitTextIntoChunks(text, chunkSize) {
            const chunks = [];
            for (let i = 0; i < text.length; i += chunkSize) {
                chunks.push(text.slice(i, i + chunkSize));
            }
            return chunks;
        }

        const chunkSize = 1000; 
        const textChunks = splitTextIntoChunks(textContent, chunkSize);

        // returns error message if text exceeds token limit
        console.log(textChunks.length);

        if (textChunks.length > 40) { 
            
            res.json({content: "We apologize for the inconvenience, but it seems the research paper you provided is too lengthy for our current processing capabilities. We kindly recommend considering a shorter paper or consulting alternative sources. Thank you for your understanding."});
        } else {
            const textSummary = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo-16k',
                messages: [
                    ...textChunks.map(chunk => ({ role: 'system', content: chunk })),
                    { role: 'system', content: `Summarize the provided text.` }
                ]
            });
            
            res.json({ content: textSummary.choices[0].message.content });
        }
    } catch (error) {
        console.error('Server Error:', error); // Log the actual error to the console
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// endpoint to get citations for selected research paper
app.post('/get-citation', async (req, res) => {
    console.log("got to citation api route");
    try {
        const { pdfURL } = req.body;

        const response = await axios.get(pdfURL, { responseType: 'arraybuffer' });
        const data = response.data;

        const pdfText = await pdf(data);
        const textContent = pdfText.text;

        function splitTextIntoChunks(text, chunkSize) {
            const chunks = [];
            for (let i = 0; i < text.length; i += chunkSize) {
                chunks.push(text.slice(i, i + chunkSize));
            }
            return chunks;
        }

        const chunkSize = 1000; 
        const textChunks = splitTextIntoChunks(textContent, chunkSize);

        // returns error message if text exceeds token limit
        if (textChunks.length > 40) { 
            res.json({content: "We apologize for the inconvenience, but it seems the research paper you provided is too lengthy for our current processing capabilities. We kindly recommend considering a shorter paper or consulting alternative sources. Thank you for your understanding."});
        } 

        else {
            const citationResponse = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo-16k',
                messages: [
                    ...textChunks.map(chunk => ({ role: 'system', content: chunk })),
                    { role: 'system', content: 'Based on the provided text, generate citations in the styles of APA, MLA, Chicago, and IEEE.' }
                ]
            });
            
            res.json({ content: citationResponse.choices[0].message.content });
        }
    } catch (error) {
        console.error('Server Error:', error); // Log the actual error to the console
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// endpoint to get query for similar papers
app.post('/get-similar-papers', async (req, res) => {
    
    try {
        console.log("got to api route");
        const { pdfURL } = req.body;

        const response = await axios.get(pdfURL, { responseType: 'arraybuffer' });
        const data = response.data;

        const pdfText = await pdf(data);
        const textContent = pdfText.text;

        function splitTextIntoChunks(text, chunkSize) {
            const chunks = [];
            for (let i = 0; i < text.length; i += chunkSize) {
                chunks.push(text.slice(i, i + chunkSize));
            }
            return chunks;
        }

        const chunkSize = 1000; 
        const textChunks = splitTextIntoChunks(textContent, chunkSize);

        if (textChunks.length > 40) { 
            res.json({content: "We apologize for the inconvenience, but it seems the research paper you provided is too lengthy for our current processing capabilities. We kindly recommend considering a shorter paper or consulting alternative sources. Thank you for your understanding."});
        } 

        else {
            const textSummary = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo-16k',
                messages: [
                    ...textChunks.map(chunk => ({ role: 'system', content: chunk })),
                    { role: 'system', content: `Generate a 1-5 word search query that would help in finding research papers similar to this text.` }
                ]
            });
            
            res.json({ content: textSummary.choices[0].message.content });
        }
    } catch (error) {
        console.error('Server Error:', error); // Log the actual error to the console
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 
