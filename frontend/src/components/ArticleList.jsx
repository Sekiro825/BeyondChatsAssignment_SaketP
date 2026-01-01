import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/articles')
            .then(res => {
                setArticles(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading">Loading articles...</div>;

    return (
        <div className="container">
            <header className="hero">
                <h1>BeyondChats Blog (Enhanced)</h1>
                <p>Curated articles enriched with AI.</p>
            </header>

            <div className="article-grid">
                {articles.map(article => (
                    <article key={article.id} className="card">
                        <div className="card-content">
                            <h2>{article.title}</h2>
                            <div className="meta">
                                <Calendar size={16} />
                                <span>{new Date(article.published_date || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <p className="excerpt">
                                {article.description ? article.description.substring(0, 120) + '...' : 'No description available.'}
                            </p>
                            <Link to={`/article/${article.id}`} className="read-more">
                                Read Article <ArrowRight size={16} />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default ArticleList;
