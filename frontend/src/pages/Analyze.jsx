import React, { useState } from 'react';
import '../styles/Analyze.css';

function Analyze() {
    const [repoUrl, setRepoUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [repoData, setRepoData] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();

        if (!repoUrl.trim()) return;

        setIsAnalyzing(true);
        setError('');

        try {
            const response = await fetch(
                'http://127.0.0.1:8000/analyze',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        repo_url: repoUrl
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to analyze repository');
            }

            const data = await response.json();

            setRepoData(data);
        } catch (err) {
            setError('Failed to analyze repository.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="analyze-container">
            {/* Brand Header */}
            <header className="ci-brand-header">
                <div className="ci-brand-title">
                    <span className="ci-brand-icon">⚡</span>
                    CodeInsight AI
                </div>
                <div className="ci-brand-subtitle">
                    AI-Powered Codebase Understanding Assistant
                </div>
            </header>

            {/* Hero Section */}
            <section className="ci-hero">
                <div className="ci-hero-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Next-Gen Code Intelligence
                </div>

                <h1 className="ci-hero-title">
                    Understand Any Codebase <span>with AI</span>
                </h1>

                <p className="ci-hero-subtitle">
                    Analyze repositories, explore architecture, trace impact,
                    and chat with your code in real time.
                </p>
            </section>

            {/* Repository Analysis Card */}
            <section className="ci-card">
                <form className="ci-search-form" onSubmit={handleAnalyze}>
                    <div className="ci-input-wrapper">
                        <span className="ci-input-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                        </span>

                        <input
                            type="text"
                            className="ci-input"
                            placeholder="Enter GitHub Repository URL (e.g., https://github.com/facebook/react)"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="ci-btn"
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? (
                            <span>Indexing Repository...</span>
                        ) : (
                            <>
                                <span>Analyze Repository</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div
                        style={{
                            color: '#ef4444',
                            marginTop: '12px',
                            fontSize: '0.9rem'
                        }}
                    >
                        {error}
                    </div>
                )}
            </section>

            {/* Repository Status */}
            <section className="ci-card ci-status-card">
                <div className="ci-status-header">
                    <span className="ci-status-title">
                        Repository Status
                    </span>

                    <span className="ci-status-badge ci-status-badge-inactive">
                        <span className="ci-status-dot ci-status-dot-inactive"></span>
                        {repoData ? 'Analyzed' : 'Not Analyzed'}
                    </span>
                </div>
            </section>

            {/* Metrics */}
            <div className="ci-section-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                Repository Index Overview
            </div>

            <section className="ci-metrics-grid">
                <div className="ci-metric-card">
                    <div className="ci-metric-header">
                        <span>Files</span>
                    </div>
                    <div className="ci-metric-value">
                        {repoData ? repoData.files : '--'}
                    </div>
                </div>

                <div className="ci-metric-card">
                    <div className="ci-metric-header">
                        <span>Chunks</span>
                    </div>
                    <div className="ci-metric-value">
                        {repoData ? repoData.chunks : '--'}
                    </div>
                </div>

                <div className="ci-metric-card">
                    <div className="ci-metric-header">
                        <span>Graph Nodes</span>
                    </div>
                    <div className="ci-metric-value">
                        {repoData ? repoData.graph_nodes : '--'}
                    </div>
                </div>

                <div className="ci-metric-card">
                    <div className="ci-metric-header">
                        <span>Graph Edges</span>
                    </div>
                    <div className="ci-metric-value">
                        {repoData ? repoData.graph_edges : '--'}
                    </div>
                </div>
            </section>

            {/* Empty State */}
            <div className="ci-empty-state">
                {repoData ? (
                    <>
                        Repository successfully indexed.
                        <br />
                        You can now use Chat, Impact Analysis and Architecture Explorer.
                    </>
                ) : (
                    <>
                        No repository analyzed yet.
                        <br />
                        Paste a GitHub repository URL and click Analyze Repository.
                    </>
                )}
            </div>

            {/* Current Repository */}
            <div className="ci-section-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Current Repository
            </div>

            <section className="ci-panel">
                <div className="ci-panel-header">
                    <span className="ci-panel-title">
                        Active Target
                    </span>

                    <span className="ci-badge-status ci-badge-waiting">
                        {repoData ? 'Ready' : 'Waiting for Analysis'}
                    </span>
                </div>

                <div className="ci-info-grid">
                    <div className="ci-info-item">
                        <span className="ci-info-label">
                            Repository
                        </span>
                        <span className="ci-info-value">
                            {repoData ? 'Repository Indexed' : 'Not Analyzed'}
                        </span>
                    </div>

                    <div className="ci-info-item">
                        <span className="ci-info-label">
                            Status
                        </span>
                        <span className="ci-info-value">
                            {repoData ? repoData.status : 'Waiting'}
                        </span>
                    </div>

                    <div className="ci-info-item">
                        <span className="ci-info-label">
                            Files
                        </span>
                        <span className="ci-info-value">
                            {repoData ? repoData.files : '--'}
                        </span>
                    </div>

                    <div className="ci-info-item">
                        <span className="ci-info-label">
                            Graph Nodes
                        </span>
                        <span className="ci-info-value">
                            {repoData ? repoData.graph_nodes : '--'}
                        </span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="ci-footer">
                <div className="ci-footer-title">
                    CodeInsight AI
                </div>

                <div className="ci-footer-subtitle">
                    AI-Powered Codebase Understanding Assistant
                </div>
            </footer>
        </div>
    );
}

export default Analyze;