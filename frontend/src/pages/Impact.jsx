import React, { useState } from 'react';
import '../styles/Impact.css';

function Impact() {
    const [functionName, setFunctionName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyzeImpact = (e) => {
        e.preventDefault();
        if (!functionName.trim()) return;

        setIsLoading(true);

        // Simulated backend payload matching the endpoint schema
        setTimeout(() => {
            setAnalysisResult({
                changed_function: functionName.trim(),
                found: true,
                dependencies: [
                    'generate_token_embeddings()',
                    'vector_similarity_search()',
                    'build_context_window()',
                    'cache_lookup_middleware()'
                ],
                affected_files: [
                    'utils.py',
                    'embedding_service.py',
                    'search_pipeline.py',
                    'api/routes/query.py'
                ],
                risk_level: 'HIGH'
            });
            setIsLoading(false);
        }, 600);
    };

    const getRiskBadgeClass = (risk) => {
        switch (risk?.toUpperCase()) {
            case 'HIGH':
                return 'risk-high';
            case 'MEDIUM':
                return 'risk-medium';
            case 'LOW':
            default:
                return 'risk-low';
        }
    };

    return (
        <div className="impact-page-container">
            {/* 1. Page Header */}
            <header className="impact-header">
                <h1 className="impact-title">Impact Analysis</h1>
                <p className="impact-subtitle">
                    Analyze how changes in a function affect the repository.
                </p>
            </header>

            {/* 2. Impact Input Card */}
            <section className="ci-card impact-input-card">
                <form className="impact-form" onSubmit={handleAnalyzeImpact}>
                    <div className="impact-input-wrapper">
                        <span className="impact-input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            className="impact-input"
                            placeholder="Enter function name (e.g., calculate_embeddings)"
                            value={functionName}
                            onChange={(e) => setFunctionName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="impact-btn" disabled={isLoading || !functionName.trim()}>
                        {isLoading ? (
                            <span>Analyzing...</span>
                        ) : (
                            <>
                                <span>Analyze Impact</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            </section>

            {/* Conditional Output: Empty State vs Results */}
            {!analysisResult ? (
                /* 6. Empty State */
                <div className="impact-empty-state">
                    <div className="impact-empty-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h3 className="impact-empty-title">No impact analysis executed.</h3>
                    <p className="impact-empty-desc">
                        Enter a function name and run impact analysis.
                    </p>
                </div>
            ) : (
                <div className="impact-results-wrapper">
                    {/* 3. Result Summary Cards */}
                    <section className="impact-summary-grid">
                        <div className="impact-summary-card">
                            <span className="summary-label">Changed Function</span>
                            <span className="summary-value code-font">
                                {analysisResult.changed_function}
                            </span>
                        </div>

                        <div className="impact-summary-card">
                            <span className="summary-label">Found Status</span>
                            <span className="summary-value">
                                {analysisResult.found ? (
                                    <span className="status-found-tag">Found</span>
                                ) : (
                                    <span className="status-notfound-tag">Not Found</span>
                                )}
                            </span>
                        </div>

                        <div className="impact-summary-card">
                            <span className="summary-label">Risk Level</span>
                            <span className="summary-value">
                                <span className={`risk-badge ${getRiskBadgeClass(analysisResult.risk_level)}`}>
                                    {analysisResult.risk_level}
                                </span>
                            </span>
                        </div>

                        <div className="impact-summary-card">
                            <span className="summary-label">Dependencies Count</span>
                            <span className="summary-value">
                                {analysisResult.dependencies.length}
                            </span>
                        </div>

                        <div className="impact-summary-card">
                            <span className="summary-label">Affected Files Count</span>
                            <span className="summary-value">
                                {analysisResult.affected_files.length}
                            </span>
                        </div>
                    </section>

                    {/* Dual Panel Layout for Lists */}
                    <div className="impact-panels-grid">
                        {/* 4. Dependencies Panel */}
                        <section className="ci-card impact-panel">
                            <div className="impact-panel-header">
                                <h2 className="impact-panel-title">Dependencies</h2>
                                <span className="impact-panel-count">{analysisResult.dependencies.length}</span>
                            </div>
                            <ul className="impact-list">
                                {analysisResult.dependencies.length > 0 ? (
                                    analysisResult.dependencies.map((dep, index) => (
                                        <li key={index} className="impact-list-item code-font">
                                            <span className="list-icon">ƒ</span>
                                            {dep}
                                        </li>
                                    ))
                                ) : (
                                    <li className="impact-list-empty">No direct dependencies found.</li>
                                )}
                            </ul>
                        </section>

                        {/* 5. Affected Files Panel */}
                        <section className="ci-card impact-panel">
                            <div className="impact-panel-header">
                                <h2 className="impact-panel-title">Affected Files</h2>
                                <span className="impact-panel-count">{analysisResult.affected_files.length}</span>
                            </div>
                            <ul className="impact-list">
                                {analysisResult.affected_files.length > 0 ? (
                                    analysisResult.affected_files.map((file, index) => (
                                        <li key={index} className="impact-list-item code-font">
                                            <span className="list-icon">📄</span>
                                            {file}
                                        </li>
                                    ))
                                ) : (
                                    <li className="impact-list-empty">No affected files identified.</li>
                                )}
                            </ul>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Impact;