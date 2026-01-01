const enrichmentService = require('./src/services/enrichment');
const googleIt = require('google-it');

async function test() {
    console.log("--- Testing Existing DDG Search ---");
    const res1 = await enrichmentService.searchGoogle("Chatbots Magic: Beginner’s Guidebook");
    console.log("DDG Results:", res1);

    console.log("\n--- Testing google-it ---");
    try {
        const res2 = await googleIt({ query: "chatbots", limit: 2 });
        console.log("Google-it Results:", res2);
    } catch (e) {
        console.error("Google-it error:", e.message);
    }
}
test();
