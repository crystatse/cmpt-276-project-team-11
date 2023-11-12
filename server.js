const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { openai } = require('./config/open-ai.js');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002


app.use(cors());
app.use(bodyParser.json());


app.post('/get-completions', async (req, res) => {
    try {
        const { userMessage } = req.body;
        console.log('User Message:', userMessage);

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k-0613',
            messages: [
                { role: 'user', content: userMessage } // Ensure the userMessage is correctly included in 'content'
            ]
        });
        

        console.log('Response from OpenAI:', chatCompletion.choices[0].message.content);
        res.json({ content: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error('Server Error:', error); // Log the actual error to the console
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
