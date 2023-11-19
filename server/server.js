import express from 'express';
import cors from 'cors';
import OpenAi from 'openai'
import dotenv from "dotenv";

dotenv.config();

const port =5005;
const apiKey = process.env.API_KEY

const openai = new OpenAi({apiKey: apiKey})

const token = process.env.API_KEY
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('API running'));
app.use(cors({
    origin: '*', // Replace with your frontend's domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
    credentials: true, // Allow sending cookies and credentials with requests, // Respond with 204 No Content for OPTIONS requests
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization', // Specify allowed headers
}))
app.post('/questions', async(req, res) => {
    const {message,role}=req.body
    console.log(role);
    const options={
        method:"POST",
        headers:{
            "Authorization":`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            model:"gpt-3.5-turbo",
            messages:[{role:"system",content:`I want you to act as an interviewer. I will be the candidate and you will ask me the interview questions for the position of ReactJS Developer. I want you to only reply as the interviewer.Do not write all the conservation at once. I want you to only do the interview with me. Ask me the questions and wait for my answers. Do not write explanations. Ask me the questions one by one like an interviewer does and wait for my answers. My first sentence is Hi`},{role:"user",content: message,  }],
            max_tokens:100,
        })
    }
 try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", options)
    const data=await resp.json()
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: "Today is a wonderful day to build something people love!",
    });
    res.send(data)
 } catch (error) {
    console.log(error);
 }
    });

app.listen(port, () => console.log(`Server started on port ${port}`));