import React, { useState } from 'react';
import '../styles/Impact.css';

function Impact() {
    const [functionName, setFunctionName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyzeImpact = async (e) => {
        e.preventDefault();

        const trimmedFunctionName = functionName.trim();

        if (!trimmedFunctionName) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const response = await fetch(
                'http://127.0.0.1:8000/impact',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        function_name: trimmedFunctionName
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail || 'Failed to analyze function impact.'
                );
            }

            setAnalysisResult(data);
        } catch (err) {
            setError(
                err.message ||
                'Unable to connect to the backend.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getRiskBadgeClass = (risk) => {
        switch (risk?.toUpperCase()) {
            case 'HIGH':
                return 'risk-high';

            case 'MEDIUM':
                return 'risk-medium';

            case 'LOW':
                return 'risk-low';

            default:
                return 'risk-low';
        }
    };

    return (
        <div className="impact-page-container">

            {/* Page Header */}
            <header className="impact-header">
                <h1 className="impact-title">
                    Impact Analysis
                </h1>

                <p className="impact-subtitle">
                    Analyze how changes in a function affect the repository.
                </p>
            </header>

            {/* Impact Input */}
            <section className="ci-card impact-input-card">

                <form
                    className="impact-form"
                    onSubmit={handleAnalyzeImpact}
                >

                    <div className="impact-input-wrapper">

                        <span className="impact-input-icon">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </span>

                        <input
                            type="text"
                            className="impact-input"
                            placeholder="Enter function name (e.g., calculate_embeddings)"
                            value={functionName}
                            onChange={(e) => {
                                setFunctionName(e.target.value);

                                if (error) {
                                    setError(null);
                                }
                            }}
                            disabled={isLoading}
                        />

                    </div>

                    <button
                        type="submit"
                        className="impact-btn"
                        disabled={
                            isLoading ||
                            !functionName.trim()
                        }
                    >

                        {isLoading ? (
                            <span>
                                Analyzing...
                            </span>
                        ) : (
                            <>
                                <span>
                                    Analyze Impact
                                </span>

                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </>
                        )}

                    </button>

                </form>

            </section>

            {/* Backend Error */}
            {error && (
                <div className="impact-error-state">

                    <div className="impact-error-icon">
                        !
                    </div>

                    <div>
                        <h3>
                            Impact Analysis Failed
                        </h3>

                        <p>
                            {error}
                        </p>
                    </div>

                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="impact-loading-state">

                    <div className="impact-loading-spinner"></div>

                    <h3>
                        Analyzing Function Impact
                    </h3>

                    <p>
                        Checking dependencies and affected files...
                    </p>

                </div>
            )}

            {/* Empty State */}
            {!analysisResult &&
                !isLoading &&
                !error && (
                    <div className="impact-empty-state">

                        <div className="impact-empty-icon">

                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                />

                                <line
                                    x1="12"
                                    y1="8"
                                    x2="12"
                                    y2="12"
                                />

                                <line
                                    x1="12"
                                    y1="16"
                                    x2="12.01"
                                    y2="16"
                                />
                            </svg>

                        </div>

                        <h3 className="impact-empty-title">
                            No impact analysis executed.
                        </h3>

                        <p className="impact-empty-desc">
                            Enter a function name and run impact analysis.
                        </p>

                    </div>
                )}

            {/* Results */}
            {analysisResult && !isLoading && (
                <div className="impact-results-wrapper">

                    {/* Result Summary */}
                    <section className="impact-summary-grid">

                        <div className="impact-summary-card">

                            <span className="summary-label">
                                Changed Function
                            </span>

                            <span className="summary-value code-font">
                                {analysisResult.changed_function || '—'}
                            </span>

                        </div>

                        <div className="impact-summary-card">

                            <span className="summary-label">
                                Found Status
                            </span>

                            <span className="summary-value">

                                {analysisResult.found ? (
                                    <span className="status-found-tag">
                                        Found
                                    </span>
                                ) : (
                                    <span className="status-notfound-tag">
                                        Not Found
                                    </span>
                                )}

                            </span>

                        </div>

                        <div className="impact-summary-card">

                            <span className="summary-label">
                                Risk Level
                            </span>

                            <span className="summary-value">

                                <span
                                    className={`risk-badge ${getRiskBadgeClass(
                                        analysisResult.risk_level
                                    )}`}
                                >
                                    {analysisResult.risk_level || 'UNKNOWN'}
                                </span>

                            </span>

                        </div>

                        <div className="impact-summary-card">

                            <span className="summary-label">
                                Dependencies Count
                            </span>

                            <span className="summary-value">
                                {Array.isArray(
                                    analysisResult.dependencies
                                )
                                    ? analysisResult.dependencies.length
                                    : 0}
                            </span>

                        </div>

                        <div className="impact-summary-card">

                            <span className="summary-label">
                                Affected Files Count
                            </span>

                            <span className="summary-value">
                                {Array.isArray(
                                    analysisResult.affected_files
                                )
                                    ? analysisResult.affected_files.length
                                    : 0}
                            </span>

                        </div>

                    </section>

                    {/* Dependency + Affected Files */}
                    <div className="impact-panels-grid">

                        {/* Dependencies */}
                        <section className="ci-card impact-panel">

                            <div className="impact-panel-header">

                                <h2 className="impact-panel-title">
                                    Dependencies
                                </h2>

                                <span className="impact-panel-count">
                                    {Array.isArray(
                                        analysisResult.dependencies
                                    )
                                        ? analysisResult.dependencies.length
                                        : 0}
                                </span>

                            </div>

                            <ul className="impact-list">

                                {Array.isArray(
                                    analysisResult.dependencies
                                ) &&
                                    analysisResult.dependencies.length > 0 ? (
                                    analysisResult.dependencies.map(
                                        (dependency, index) => (
                                            <li
                                                key={`${dependency}-${index}`}
                                                className="impact-list-item code-font"
                                            >
                                                <span className="list-icon">
                                                    ƒ
                                                </span>

                                                {dependency}
                                            </li>
                                        )
                                    )
                                ) : (
                                    <li className="impact-list-empty">
                                        No direct dependencies found.
                                    </li>
                                )}

                            </ul>

                        </section>

                        {/* Affected Files */}
                        <section className="ci-card impact-panel">

                            <div className="impact-panel-header">

                                <h2 className="impact-panel-title">
                                    Affected Files
                                </h2>

                                <span className="impact-panel-count">
                                    {Array.isArray(
                                        analysisResult.affected_files
                                    )
                                        ? analysisResult.affected_files.length
                                        : 0}
                                </span>

                            </div>

                            <ul className="impact-list">

                                {Array.isArray(
                                    analysisResult.affected_files
                                ) &&
                                    analysisResult.affected_files.length > 0 ? (
                                    analysisResult.affected_files.map(
                                        (file, index) => (
                                            <li
                                                key={`${file}-${index}`}
                                                className="impact-list-item code-font"
                                            >
                                                <span className="list-icon">
                                                    📄
                                                </span>

                                                {file}
                                            </li>
                                        )
                                    )
                                ) : (
                                    <li className="impact-list-empty">
                                        No affected files identified.
                                    </li>
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