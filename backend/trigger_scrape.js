const axios = require('axios');

async function trigger() {
    try {
        console.log("Triggering scrape...");
        const res = await axios.post('http://localhost:3000/api/scrape');
        console.log("Scrape successful:", res.data);
    } catch (e) {
        console.error("Scrape failed:", e.message);
    }
}
trigger();
