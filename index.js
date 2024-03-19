import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from 'dotenv';
import OpenAI from 'openai';
env.config();
const app = express();
app.use(bodyParser.json());

app.use(cors());

//configure OPENAI
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

//POST ROUTE FOR MAKING REQUESTS
app.post('/',async(req,resp)=>{
    // console.log(req.body?.message,"req.body");
    try{
        const messages = req.body?.message?.map(message => ({
            role: message.sender === 'ai' ? 'assistant' : 'user',
            content: message.message
        }));
        const response = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
          });
        resp.json({ message: response?.choices[0].message.content });
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
})


app.listen('3080', () => {
    console.log("listening On port 3080");
})