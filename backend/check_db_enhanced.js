const axios = require('axios');

async function check() {
    try {
        const res = await axios.get('http://localhost:3000/api/articles');
        console.log("Articles in DB:", res.data.length);
        res.data.forEach(a => {
            const isEnhanced = a.content_enhanced ? "YES" : "NO";
            console.log(`- ${a.title} [Enhanced: ${isEnhanced}]`);
        });
    } catch (e) {
        console.error(e.message);
    }
}
check();
