const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/proxy", async (req, res) => {
    try {
        const { url, proxy_country = "pl" } = req.query;

        if (!url) {
            return res.status(400).json({ error: "URL parameter is required!" });
        }

        const formData = new URLSearchParams();
        formData.append("type", "");
        formData.append("proxy_country", proxy_country);
        formData.append("url", url);

        const response = await axios.post("https://cdn.proxyium.com/proxyrequest.php", formData.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://proxyium.com",
                "Referer": "https://proxyium.com/",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            },
        });

        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
