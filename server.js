const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { openai } = require('./config/open-ai.js');
const axios = require('axios');
const pdf = require('pdf-parse');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002


app.use(cors());
app.use(bodyParser.json());

// test pdf url
const pdfURL = "https://arxiv.org/pdf/2003.00001.pdf";



// endpoint to get answers to user-inputted questions
app.post('/get-completions', async (req, res) => {
    
    try {
        const { userMessage } = req.body;

        // fetch PDF data from URL
        const response = await axios.get("https://arxiv.org/pdf/2003.00001.pdf", { responseType: 'arraybuffer' });
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
        
        const chunkSize = 10000; 
        const textChunks = splitTextIntoChunks(textContent, chunkSize);
        
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
    } catch (error) {
        // log and handle errors
        console.error('Server Error:', error); // Log the actual error to the console
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// endpoint to get summary of selected research paper
app.post('/get-summary', async (req, res) => {
    
    try {
        const { userMessage } = req.body;

        const response = await axios.get("https://arxiv.org/pdf/2003.00001.pdf", { responseType: 'arraybuffer' });
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

        const chunkSize = 10000; 
        const textChunks = splitTextIntoChunks(textContent, chunkSize);

        const textSummary = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                ...textChunks.map(chunk => ({ role: 'system', content: chunk })),
                { role: 'system', content: `Summarize the provided text.` }
            ]
        });
        
        res.json({ content: textSummary.choices[0].message.content });
    } catch (error) {
        console.error('Server Error:', error); // Log the actual error to the console
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
