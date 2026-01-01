const axios = require('axios');
const cheerio = require('cheerio');

async function checkLastPage() {
    const url = 'https://beyondchats.com/blogs/page/15/'; // Assuming 15 as found
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const articles = $('article'); // Standard WordPress tag
        console.log(`Articles found on page 15: ${articles.length}`);

        articles.each((i, el) => {
            const title = $(el).find('h2').text().trim();
            const link = $(el).find('a').attr('href');
            const date = $(el).find('time').attr('datetime') || $(el).find('.published').text();
            console.log(`Article ${i + 1}: ${title} - ${link} - ${date}`);
        });
    } catch (e) {
        console.error(e.message);
    }
}

checkLastPage();
