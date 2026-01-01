const axios = require('axios');
const cheerio = require('cheerio');

async function checkPagination() {
    try {
        const { data } = await axios.get('https://beyondchats.com/blogs/');
        const $ = cheerio.load(data);

        console.log('Pagination HTML:');
        // Guessing standard class names like .pagination, .page-numbers, etc.
        const pagination = $('.pagination, .page-numbers, .nav-links').html();
        console.log(pagination || "No pagination found with standard classes");

        console.log('Article Count on Page 1:', $('article').length);
    } catch (error) {
        console.error(error.message);
    }
}

checkPagination();
