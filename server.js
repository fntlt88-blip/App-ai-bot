const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/whatsapp", async (req, res) => {
    const userMessage = req.body.Body;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: userMessage }]
                    }
                ]
            }
        );

        const reply =
            response.data.candidates[0].content.parts[0].text;

        res.set("Content-Type", "text/xml");
        res.send(`
<Response>
<Message>${reply}</Message>
</Response>
        `);

    } catch (err) {
        res.send(`
<Response>
<Message>Error. Try again.</Message>
</Response>
        `);
    }
});

app.listen(3000);
