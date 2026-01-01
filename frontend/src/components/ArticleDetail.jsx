import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showOriginal, setShowOriginal] = useState(false);

    useEffect(() => {
        axios.get(`/api/articles/${id}`)
            .then(res => {
                setArticle(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading">Loading article...</div>;
    if (!article) return <div className="error">Article not found.</div>;

    return (
        <div className="container detail-view">
            <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to Articles</Link>

            <header className="article-header">
                <h1>{article.title}</h1>
                <div className="article-meta">
                    <span>Published: {new Date(article.published_date || Date.now()).toLocaleDateString()}</span>
                    {article.content_enhanced && <span className="badge"><CheckCircle size={14} /> AI Enhanced</span>}
                </div>
            </header>

            <div className="controls">
                <button
                    className={!showOriginal ? 'active' : ''}
                    onClick={() => setShowOriginal(false)}
                >
                    Enhanced Version
                </button>
                <button
                    className={showOriginal ? 'active' : ''}
                    onClick={() => setShowOriginal(true)}
                >
                    Original Version
                </button>
            </div>

            <main className="article-body">
                {showOriginal ? (
                    <div className="content original">
                        <div className="warning-banner">
                            <AlertCircle size={16} /> Showing original scraped content
                        </div>
                        {article.content_original}
                    </div>
                ) : (
                    <div className="content enhanced">
                        <ReactMarkdown>{article.content_enhanced || article.content_original || "No content."}</ReactMarkdown>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ArticleDetail;
