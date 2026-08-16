import React, { useState, useEffect } from 'react';
import '../styles/Architecture.css';

function Architecture({ hasRepo = true }) {
    const [activeTab, setActiveTab] = useState('repo');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [architectureData, setArchitectureData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [overviewStats, setOverviewStats] = useState({
        files: 0,
        functions: 0,
        classes: 0,
        relationships: 0
    });

    const [graphStats, setGraphStats] = useState({
        nodes: 0,
        edges: 0
    });

    const [repositoryStats, setRepositoryStats] = useState({
        nodeDistribution: [],
        relationshipDistribution: []
    });

    useEffect(() => {
        const fetchArchitecture = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    'http://127.0.0.1:8000/architecture'
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to load architecture (${response.status})`
                    );
                }

                const data = await response.json();

                setArchitectureData(data);

                /*
                 * Backend currently returns:
                 * {
                 *   folder_diagram: string,
                 *   dependency_diagram: string,
                 *   service_diagram: string
                 * }
                 *
                 * These diagrams are displayed directly below.
                 *
                 * Statistics remain 0 until the backend provides
                 * actual graph metadata.
                 */
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (hasRepo) {
            fetchArchitecture();
        } else {
            setLoading(false);
        }
    }, [hasRepo]);

    const tabs = [
        {
            id: 'repo',
            label: 'Repository Graph',
            icon: (
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="5" r="3" />
                    <circle cx="5" cy="19" r="3" />
                    <circle cx="19" cy="19" r="3" />
                    <line x1="10" y1="7.2" x2="6.8" y2="16.8" />
                    <line x1="14" y1="7.2" x2="17.2" y2="16.8" />
                </svg>
            )
        },
        {
            id: 'dep',
            label: 'Dependency Graph',
            icon: (
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <path d="M10 6.5h4M17.5 10v4" />
                </svg>
            )
        },
        {
            id: 'func',
            label: 'Function Call Graph',
            icon: (
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M18 16V8h-5.5a4 4 0 0 0-4 4v8" />
                    <polyline points="14 13 17 16 14 19" />
                    <circle cx="6" cy="12" r="2" />
                </svg>
            )
        }
    ];

    const getActiveDiagram = () => {
        if (!architectureData) return '';

        switch (activeTab) {
            case 'dep':
                return architectureData.dependency_diagram || '';

            case 'func':
                return architectureData.service_diagram || '';

            case 'repo':
            default:
                return architectureData.folder_diagram || '';
        }
    };

    const getActiveTabLabel = () => {
        const tab = tabs.find((item) => item.id === activeTab);
        return tab ? tab.label : 'Repository Graph';
    };

    const getDiagramTitle = () => {
        switch (activeTab) {
            case 'dep':
                return 'Dependency Architecture';

            case 'func':
                return 'Service Architecture';

            case 'repo':
            default:
                return 'Repository Structure';
        }
    };

    const getDiagramDescription = () => {
        switch (activeTab) {
            case 'dep':
                return 'Module and package relationships extracted from the analyzed repository.';

            case 'func':
                return 'Service and component relationships identified from the repository structure.';

            case 'repo':
            default:
                return 'Folder and file hierarchy generated from the analyzed repository.';
        }
    };

    const renderDiagram = () => {
        const diagram = getActiveDiagram();

        if (!diagram) {
            return (
                <div className="arch-placeholder-content">
                    <div className="arch-placeholder-badge">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line
                                x1="8.59"
                                y1="13.51"
                                x2="15.42"
                                y2="17.49"
                            />
                            <line
                                x1="15.41"
                                y1="6.51"
                                x2="8.59"
                                y2="10.49"
                            />
                        </svg>
                    </div>

                    <h3 className="arch-placeholder-title">
                        No Architecture Data
                    </h3>

                    <p className="arch-placeholder-subtitle">
                        No diagram was returned for this architecture view.
                    </p>
                </div>
            );
        }

        return (
            <div className="arch-diagram-wrapper">
                <div className="arch-diagram-heading">
                    <div>
                        <h3 className="arch-diagram-title">
                            {getDiagramTitle()}
                        </h3>

                        <p className="arch-diagram-description">
                            {getDiagramDescription()}
                        </p>
                    </div>

                    <span className="meta-badge graph-type-badge">
                        {getActiveTabLabel()}
                    </span>
                </div>

                <pre className="arch-diagram-content">
                    {diagram}
                </pre>
            </div>
        );
    };

    if (!hasRepo) {
        return (
            <div className="arch-page-container">
                <header className="arch-header">
                    <h1 className="arch-title">
                        Architecture Explorer
                    </h1>

                    <p className="arch-subtitle">
                        Visualize repository structure, dependencies, and
                        function relationships.
                    </p>
                </header>

                <div className="arch-empty-state-card">
                    <div className="arch-empty-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                        </svg>
                    </div>

                    <h3 className="arch-empty-title">
                        No Repository Loaded
                    </h3>

                    <p className="arch-empty-desc">
                        Analyze a repository first to view architecture
                        information.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="arch-page-container">
                <header className="arch-header">
                    <h1 className="arch-title">
                        Architecture Explorer
                    </h1>

                    <p className="arch-subtitle">
                        Loading repository architecture...
                    </p>
                </header>

                <div className="arch-loading-card">
                    <div className="arch-loading-spinner"></div>

                    <h3>Loading Architecture</h3>

                    <p>
                        Fetching repository architecture from the backend.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="arch-page-container">
                <header className="arch-header">
                    <h1 className="arch-title">
                        Architecture Explorer
                    </h1>

                    <p className="arch-subtitle">
                        Visualize repository structure, dependencies, and
                        function relationships.
                    </p>
                </header>

                <div className="arch-error-card">
                    <div className="arch-error-icon">
                        !
                    </div>

                    <h3>Unable to Load Architecture</h3>

                    <p>{error}</p>

                    <button
                        className="arch-retry-btn"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="arch-page-container">

            {/* Page Header */}
            <header className="arch-header">
                <h1 className="arch-title">
                    Architecture Explorer
                </h1>

                <p className="arch-subtitle">
                    Visualize repository structure, dependencies, and
                    function relationships.
                </p>
            </header>

            {/* Architecture Overview */}
            <section className="arch-overview-grid">

                <div className="arch-overview-card">
                    <span className="overview-label">
                        Files
                    </span>

                    <span className="overview-value">
                        {overviewStats.files.toLocaleString()}
                    </span>

                    <span className="overview-desc">
                        Indexed source files
                    </span>
                </div>

                <div className="arch-overview-card">
                    <span className="overview-label">
                        Functions
                    </span>

                    <span className="overview-value">
                        {overviewStats.functions.toLocaleString()}
                    </span>

                    <span className="overview-desc">
                        Identified definitions
                    </span>
                </div>

                <div className="arch-overview-card">
                    <span className="overview-label">
                        Classes
                    </span>

                    <span className="overview-value">
                        {overviewStats.classes.toLocaleString()}
                    </span>

                    <span className="overview-desc">
                        Object models & components
                    </span>
                </div>

                <div className="arch-overview-card">
                    <span className="overview-label">
                        Relationships
                    </span>

                    <span className="overview-value">
                        {overviewStats.relationships.toLocaleString()}
                    </span>

                    <span className="overview-desc">
                        Structural connections
                    </span>
                </div>

            </section>

            {/* Graph Tabs */}
            <section className="arch-tabs-container">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`arch-tab-btn ${activeTab === tab.id ? 'active' : ''
                            }`}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setSelectedNode(null);
                        }}
                    >
                        <span className="tab-icon">
                            {tab.icon}
                        </span>

                        <span>
                            {tab.label}
                        </span>
                    </button>
                ))}
            </section>

            {/* Architecture Viewer */}
            <section className="arch-card arch-viewer-card">

                <div className="arch-viewer-toolbar">

                    <div className="arch-viewer-meta">
                        <span className="meta-badge graph-type-badge">
                            {getActiveTabLabel()}
                        </span>

                        <span className="meta-badge-stat">
                            Nodes:{' '}
                            <strong>
                                {graphStats.nodes.toLocaleString()}
                            </strong>
                        </span>

                        <span className="meta-badge-stat">
                            Edges:{' '}
                            <strong>
                                {graphStats.edges.toLocaleString()}
                            </strong>
                        </span>
                    </div>

                    <div className="arch-viewer-controls">

                        <div className="arch-search-wrapper">

                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="8"
                                />

                                <line
                                    x1="21"
                                    y1="21"
                                    x2="16.65"
                                    y2="16.65"
                                />
                            </svg>

                            <input
                                type="text"
                                className="arch-search-input"
                                placeholder="Search node..."
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                            />
                        </div>

                        <div className="arch-zoom-group">

                            <button
                                className="control-btn"
                                title="Zoom In"
                            >
                                +
                            </button>

                            <button
                                className="control-btn"
                                title="Zoom Out"
                            >
                                −
                            </button>

                            <button
                                className="control-btn text-btn"
                                title="Fit to Screen"
                            >
                                Fit Screen
                            </button>

                            <button
                                className="control-btn text-btn"
                                title="Reset View"
                            >
                                Reset
                            </button>

                        </div>

                    </div>
                </div>

                <div className="arch-graph-canvas">
                    <div className="arch-canvas-grid-bg" />

                    {renderDiagram()}
                </div>

            </section>

            {/* Selected Node Details */}
            <section className="arch-card arch-node-panel">

                <div className="arch-panel-header">

                    <h2 className="arch-panel-title">
                        Selected Node Details
                    </h2>

                    {selectedNode && (
                        <button
                            className="arch-clear-btn"
                            onClick={() => setSelectedNode(null)}
                        >
                            Clear Selection
                        </button>
                    )}

                </div>

                {!selectedNode ? (
                    <div className="arch-node-empty">

                        <svg
                            width="20"
                            height="20"
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

                        <span className="arch-node-empty-text">
                            No node selected.
                        </span>

                        <span className="arch-node-empty-subtext">
                            Node selection will become available when the
                            interactive graph renderer is connected.
                        </span>

                    </div>
                ) : (
                    <div className="arch-node-grid">

                        <div className="arch-node-field">
                            <span className="field-label">
                                Node Name
                            </span>

                            <span className="field-value code-font">
                                {selectedNode.name || '—'}
                            </span>
                        </div>

                        <div className="arch-node-field">
                            <span className="field-label">
                                Node Type
                            </span>

                            <span className="field-value">
                                {selectedNode.type || '—'}
                            </span>
                        </div>

                        <div className="arch-node-field full-width">
                            <span className="field-label">
                                File Path
                            </span>

                            <span className="field-value code-font">
                                {selectedNode.filePath || '—'}
                            </span>
                        </div>

                        <div className="arch-node-field full-width">
                            <span className="field-label">
                                Function Signature
                            </span>

                            <span className="field-value code-font">
                                {selectedNode.signature || '—'}
                            </span>
                        </div>

                        <div className="arch-node-field">
                            <span className="field-label">
                                Outgoing Connections
                            </span>

                            <span className="field-value code-font">
                                {selectedNode.outgoingCount ?? 0}
                            </span>
                        </div>

                        <div className="arch-node-field">
                            <span className="field-label">
                                Incoming Connections
                            </span>

                            <span className="field-value code-font">
                                {selectedNode.incomingCount ?? 0}
                            </span>
                        </div>

                    </div>
                )}

            </section>

            {/* Repository Statistics */}
            <section className="arch-stats-grid">

                <div className="arch-card arch-stat-card">

                    <h2 className="arch-panel-title">
                        Node Distribution
                    </h2>

                    <div className="arch-stat-rows">

                        {repositoryStats.nodeDistribution.map(
                            (item, idx) => (
                                <div
                                    key={idx}
                                    className="arch-stat-row"
                                >
                                    <span className="stat-name">
                                        {item.label}
                                    </span>

                                    <span className="stat-dots" />

                                    <span className="stat-value code-font">
                                        {item.count.toLocaleString()}
                                    </span>
                                </div>
                            )
                        )}

                    </div>
                </div>

                <div className="arch-card arch-stat-card">

                    <h2 className="arch-panel-title">
                        Relationship Distribution
                    </h2>

                    <div className="arch-stat-rows">

                        {repositoryStats.relationshipDistribution.map(
                            (item, idx) => (
                                <div
                                    key={idx}
                                    className="arch-stat-row"
                                >
                                    <span className="stat-name">
                                        {item.label}
                                    </span>

                                    <span className="stat-dots" />

                                    <span className="stat-value code-font">
                                        {item.count.toLocaleString()}
                                    </span>
                                </div>
                            )
                        )}

                    </div>
                </div>

            </section>

        </div>
    );
}

export default Architecture;