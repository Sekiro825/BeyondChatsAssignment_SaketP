const axios = require('axios');
const cheerio = require('cheerio');

async function analyzePage() {
    try {
        const { data } = await axios.get('https://beyondchats.com/blogs/');
        const $ = cheerio.load(data);

        // Look for links with "Last" or numbers
        const links = $('a').map((i, el) => {
            return {
                text: $(el).text().trim(),
                href: $(el).attr('href'),
                class: $(el).attr('class')
            };
        }).get();

        const pageLinks = links.filter(l => l.href && l.href.includes('/page/'));
        console.log("Page links found:", pageLinks.slice(0, 10)); // Show search results

        // Try to find max page number
        let maxPage = 1;
        pageLinks.forEach(l => {
            const match = l.href.match(/\/page\/(\d+)\/?/);
            if (match) {
                const num = parseInt(match[1]);
                if (num > maxPage) maxPage = num;
            }
        });
        console.log("Max page found via links:", maxPage);
    } catch (error) {
        console.error(error);
    }
}

analyzePage();
