const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const scraperService = require('../services/scraper');
const enrichmentService = require('../services/enrichment');

// Trigger Enrichment
router.post('/enrich', async (req, res) => {
    try {
        const count = await enrichmentService.processAll();
        res.json({ message: 'Enrichment process started/completed', processed: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Trigger Scraper
router.post('/scrape', async (req, res) => {
    try {
        const articles = await scraperService.scrapeAndSave();
        res.json({ message: 'Scraping completed', count: articles.length, articles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all articles
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.findAll({ order: [['published_date', 'ASC']] });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET article by ID
router.get('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create article
router.post('/articles', async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update article
router.put('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        await article.update(req.body);
        res.json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE article
router.delete('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        await article.destroy();
        res.json({ message: 'Article deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
