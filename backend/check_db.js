const axios = require('axios');

async function check() {
    try {
        const res = await axios.get('http://localhost:3000/api/articles');
        console.log("Articles in DB:", res.data.length);
        res.data.forEach(a => console.log(`- ${a.title} (${a.published_date})`));
    } catch (e) {
        console.error(e.message);
    }
}
check();
