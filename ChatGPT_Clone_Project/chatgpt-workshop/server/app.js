import express from 'express'
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from  'dotenv';

dotenv.config();

const app = express()
app.use(express.json())

app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send("hello World");
});

app.post('/api/chat',async(req,res) => {
    const {messages} = req.body;
    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant'
            },
        ],
    };

    
    try{
       const response = await fetch("https://api.openai.com/v1/chat/completions",{
        method : 'POST',
        headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            ...data,
            messages: [...data.messages , ...messages],
        }),
        });
        const json = await response.json();
        res.json({question: messages,answer: json.choices });
    }catch(error){
        console.log(error,"error");
    }
});

app.listen(8000, () => {
    console.log("Server is running!");
})
