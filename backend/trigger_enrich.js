const axios = require('axios');

async function trigger() {
    try {
        console.log("Triggering enrichment...");
        const res = await axios.post('http://localhost:3000/api/enrich');
        console.log("Enrichment started:", res.data);
    } catch (e) {
        console.error("Enrichment failed:", e.message);
    }
}
trigger();
