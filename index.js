const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = "https://api.internal.temp-mail.io/api/v3/email";

app.use(express.json());
app.use(cors());

// Generate a new temp email
app.get("/generate", async (req, res) => {
    try {
        const response = await axios.post(`${API_BASE}/new`, {
            min_name_length: 10,
            max_name_length: 10
        }, {
            headers: {
                "Content-Type": "application/json",
                "application-name": "web",
                "application-version": "4.0.0",
                "x-cors-header": "iaWg3pchvFx48fY",
                "user-agent": "Mozilla/5.0"
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

// Fetch 6-digit or 8-digit code from the message body
app.get("/info", async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Email parameter is required" });
    }

    try {
        const response = await axios.get(`${API_BASE}/${email}/messages`, {
            headers: {
                "application-name": "web",
                "application-version": "4.0.0",
                "x-cors-header": "iaWg3pchvFx48fY",
                "user-agent": "Mozilla/5.0"
            }
        });

        // Extract 6-digit or 8-digit code from the body_text
        const messages = response.data;
        if (messages.length > 0) {
            const bodyText = messages[0].body_text;
            const code = bodyText.match(/\d{6}|\d{8}/); // Match 6-digit or 8-digit code
            if (code) {
                return res.json({ code: code[0] }); // Send matched code
            }
        }

        res.json({ code: "" }); // Return empty string if no messages or codes are found
    } catch (error) {
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
