import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';

function Chat({ repoInfo = { name: 'Repository Name', language: 'Language', status: 'Index Status' } }) {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const starterPrompts = [
        {
            title: "Architecture Overview",
            prompt: "Explain the core architecture and key entry points of this repository."
        },
        {
            title: "State & Control Flow",
            prompt: "How is data state managed and passed across key modules?"
        },
        {
            title: "Dependencies & Impact",
            prompt: "What are the primary external dependencies and critical modules?"
        }
    ];

    const handleSendMessage = (textToSend) => {
        const query = textToSend || inputText;
        if (!query.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInputText('');

        // Simulated AI response with file references, code blocks, and citations
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: 'Based on the codebase analysis, here is the structural overview for your request:',
                fileReferences: ['src/core/bootstrap.ts', 'src/services/dataEngine.ts'],
                codeSnippet: {
                    language: 'typescript',
                    code: `// Key initialization routine\nexport async function initializeModule(config: ModuleConfig) {\n  const engine = new DataEngine(config);\n  await engine.bootstrap();\n  return engine;\n}`
                },
                citations: ['AST Node #104', 'RAG Context Chunk #42'],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, aiMsg]);
        }, 600);
    };

    return (
        <div className="chat-page-container">
            {/* Top Header & Repository Status Badge */}
            <header className="chat-top-bar">
                <div className="chat-header-info">
                    <h1 className="chat-title">Chat With Repository</h1>
                    <p className="chat-subtitle">Ask questions about the analyzed codebase.</p>
                </div>

                <div className="chat-repo-badge-card">
                    <div className="chat-repo-details">
                        <span className="chat-repo-name">{repoInfo.name}</span>
                        <span className="chat-repo-language">{repoInfo.language}</span>
                    </div>
                    <span className="chat-status-badge">
                        <span className="chat-status-dot"></span>
                        {repoInfo.status}
                    </span>
                </div>
            </header>

            {/* Main Conversation Stream */}
            <main className="chat-stream-container">
                <div className="chat-stream-content">
                    {messages.length === 0 ? (
                        /* Empty State */
                        <div className="chat-empty-state">
                            <div className="chat-empty-icon">⚡</div>
                            <h2 className="chat-empty-title">Ask questions about the repository</h2>
                            <p className="chat-empty-desc">
                                Select a starter prompt below or type a query to explore module relationships and codebase structure.
                            </p>
                            <div className="chat-prompts-grid">
                                {starterPrompts.map((item, idx) => (
                                    <button
                                        key={idx}
                                        className="chat-prompt-card"
                                        onClick={() => handleSendMessage(item.prompt)}
                                    >
                                        <span className="prompt-card-title">{item.title}</span>
                                        <span className="prompt-card-text">{item.prompt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Message Stream */
                        <div className="chat-messages-stream">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`chat-row ${msg.sender}`}>
                                    <div className="chat-row-inner">
                                        <div className="chat-avatar">
                                            {msg.sender === 'ai' ? '⚡' : 'U'}
                                        </div>
                                        <div className="chat-message-content">
                                            <div className="chat-sender-header">
                                                <span className="chat-sender-name">
                                                    {msg.sender === 'ai' ? 'CodeInsight AI' : 'You'}
                                                </span>
                                                <span className="chat-timestamp">{msg.timestamp}</span>
                                            </div>

                                            <div className="chat-text-body">{msg.text}</div>

                                            {/* File References */}
                                            {msg.fileReferences && msg.fileReferences.length > 0 && (
                                                <div className="chat-references-block">
                                                    <span className="chat-block-label">Referenced Files</span>
                                                    <div className="chat-files-list">
                                                        {msg.fileReferences.map((file, i) => (
                                                            <span key={i} className="chat-file-chip">
                                                                📄 {file}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Code Block */}
                                            {msg.codeSnippet && (
                                                <div className="chat-code-block">
                                                    <div className="chat-code-header">
                                                        <span>{msg.codeSnippet.language}</span>
                                                    </div>
                                                    <pre className="chat-code-content">
                                                        <code>{msg.codeSnippet.code}</code>
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Citations */}
                                            {msg.citations && msg.citations.length > 0 && (
                                                <div className="chat-citations-block">
                                                    {msg.citations.map((cite, i) => (
                                                        <span key={i} className="chat-citation-chip">
                                                            📌 {cite}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </main>

            {/* Fixed Bottom Input Bar */}
            <div className="chat-fixed-input-bar">
                <div className="chat-input-wrapper-inner">
                    <form
                        className="chat-input-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                    >
                        <textarea
                            className="chat-textarea"
                            placeholder="Ask a question about the repository..."
                            value={inputText}
                            rows={1}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className="chat-send-btn"
                            disabled={!inputText.trim()}
                            title="Send Message"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                        </button>
                    </form>
                    <div className="chat-disclaimer">
                        CodeInsight AI provides codebase analysis based on indexed AST and RAG context.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;