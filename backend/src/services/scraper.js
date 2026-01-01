const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');
const { Op } = require('sequelize');

class ScraperService {
    constructor() {
        this.baseUrl = 'https://beyondchats.com/blogs/';
    }

    async getPaginationMaxPage() {
        try {
            const { data } = await axios.get(this.baseUrl);
            const $ = cheerio.load(data);
            let maxPage = 1;

            // Look for page numbers in pagination
            $('a.page-numbers').each((i, el) => {
                const href = $(el).attr('href');
                if (href) {
                    const match = href.match(/\/page\/(\d+)\/?/);
                    if (match) {
                        const num = parseInt(match[1]);
                        if (num > maxPage) maxPage = num;
                    }
                }
            });
            return maxPage;
        } catch (error) {
            console.error('Error finding pagination:', error.message);
            return 1;
        }
    }

    async getOldestArticleLinks(limit = 5) {
        let maxPage = await this.getPaginationMaxPage();
        let articleLinks = [];
        let currentPage = maxPage;

        console.log(`Max page found: ${maxPage}. Starting extraction...`);

        while (articleLinks.length < limit && currentPage >= 1) {
            const url = `${this.baseUrl}page/${currentPage}/`;
            try {
                const { data } = await axios.get(url);
                const $ = cheerio.load(data);

                // Get articles on this page
                let pageArticles = [];
                $('article').each((i, el) => {
                    const link = $(el).find('a').attr('href');
                    const dateStr = $(el).find('time').attr('datetime'); // 2023-12-05...
                    if (link) {
                        pageArticles.push({ url: link, date: dateStr });
                    }
                });

                // On the pages, articles are usually Newest -> Oldest (Top -> Bottom).
                // So on Page 15 (Oldest Page), the Bottom article is the OLDEST of the Oldest Page?
                // Or usually blogs are purely reverse chronological.
                // Page 1: Newest 10.
                // ...
                // Page 15: Oldest 10.
                // Inside Page 15: Top is Newer than Bottom.
                // So the Bottom of Page 15 is the absolute oldest.
                // I want the "5 oldest".
                // I should collect from Page 15, reverse the list (so Oldest -> Newest), then Page 14 reversed...
                // OR: Just collect ALL from Page 15, 14... then sort by Date.

                articleLinks = [...articleLinks, ...pageArticles];
                console.log(`Fetched page ${currentPage}, found ${pageArticles.length} articles.`);

            } catch (error) {
                console.error(`Error fetching page ${currentPage}:`, error.message);
            }
            currentPage--;
        }

        // Sort by date ascending (Oldest first)
        articleLinks.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Return only unique URLs
        const uniqueLinks = [...new Set(articleLinks.map(a => a.url))];
        return uniqueLinks.slice(0, limit);
    }

    async scrapeArticleContent(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            const title = $('h1').first().text().trim() || $('h1.entry-title').text().trim();
            // Remove scripts, styles
            $('script').remove();
            $('style').remove();

            // Content selector - usually .entry-content or article body
            // This needs to be robust.
            const content = $('.entry-content').first().text().trim() || $('article').text().trim();
            const description = $('meta[name="description"]').attr('content') || content.substring(0, 150) + '...';
            const published_date = $('time').attr('datetime');

            return {
                title,
                content_original: content,
                description,
                url,
                source: 'BeyondChats',
                published_date
            };
        } catch (error) {
            console.error(`Error scraping article ${url}:`, error.message);
            return null;
        }
    }

    async scrapeAndSave(limit = 5) {
        console.log("Starting scrape job...");
        const links = await this.getOldestArticleLinks(limit);
        console.log(`Found ${links.length} oldest links to process:`, links);

        const savedArticles = [];

        for (const link of links) {
            // Check if exists
            const existing = await Article.findOne({ where: { url: link } });
            if (existing) {
                console.log(`Article already exists: ${link}`);
                savedArticles.push(existing);
                continue;
            }

            const data = await this.scrapeArticleContent(link);
            if (data) {
                const article = await Article.create(data);
                savedArticles.push(article);
                console.log(`Saved article: ${data.title}`);
            }
        }
        return savedArticles;
    }
}

module.exports = new ScraperService();
