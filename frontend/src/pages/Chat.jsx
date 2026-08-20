import React, { useState, useRef, useEffect } from 'react';
import '../styles/Chat.css';

function Chat({
    repoInfo = {
        name: 'Repository Name',
        language: 'Language',
        status: 'Index Status'
    }
}) {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('codeinsight_chat_messages');

        return savedMessages
            ? JSON.parse(savedMessages)
            : [];
    });
    useEffect(() => {
        localStorage.setItem(
            'codeinsight_chat_messages',
            JSON.stringify(messages)
        );
    }, [messages]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const starterPrompts = [
        {
            title: 'Architecture Overview',
            prompt: 'Explain the core architecture and key entry points of this repository.'
        },
        {
            title: 'State & Control Flow',
            prompt: 'How is data state managed and passed across key modules?'
        },
        {
            title: 'Dependencies & Impact',
            prompt: 'What are the primary external dependencies and critical modules?'
        }
    ];

    const handleSendMessage = async (textToSend = null) => {
        const query = textToSend !== null ? textToSend : inputText;

        if (!query.trim() || isLoading) {
            return;
        }

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: query.trim(),
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(
                'http://127.0.0.1:8000/chat',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        question: query.trim()
                    })
                }
            );

            if (!response.ok) {
                let errorMessage = 'Failed to get response from the backend.';

                try {
                    const errorData = await response.json();

                    if (errorData.detail) {
                        errorMessage =
                            typeof errorData.detail === 'string'
                                ? errorData.detail
                                : 'Backend rejected the request.';
                    }
                } catch {
                    // Keep default error message.
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();

            const aiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                text: data.answer || 'The backend returned an empty answer.',
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error('Chat API error:', err);

            setError(
                err.message ||
                'Unable to connect to the CodeInsight backend.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-page-container">

            {/* Header */}
            <header className="chat-top-bar">
                <div className="chat-header-info">
                    <h1 className="chat-title">
                        Chat With Repository
                    </h1>

                    <p className="chat-subtitle">
                        Ask questions about the analyzed codebase.
                    </p>
                </div>

                <div className="chat-repo-badge-card">
                    <div className="chat-repo-details">
                        <span className="chat-repo-name">
                            {repoInfo.name}
                        </span>

                        <span className="chat-repo-language">
                            {repoInfo.language}
                        </span>
                    </div>

                    <span className="chat-status-badge">
                        <span className="chat-status-dot"></span>
                        {repoInfo.status}
                    </span>
                </div>
            </header>

            {/* Main Conversation */}
            <main className="chat-stream-container">
                <div className="chat-stream-content">

                    {messages.length === 0 ? (

                        /* Empty State */
                        <div className="chat-empty-state">

                            <div className="chat-empty-icon">
                                ⚡
                            </div>

                            <h2 className="chat-empty-title">
                                Ask questions about the repository
                            </h2>

                            <p className="chat-empty-desc">
                                Select a starter prompt below or type a
                                query to explore module relationships and
                                codebase structure.
                            </p>

                            <div className="chat-prompts-grid">

                                {starterPrompts.map((item, idx) => (
                                    <button
                                        key={idx}
                                        className="chat-prompt-card"
                                        onClick={() =>
                                            handleSendMessage(item.prompt)
                                        }
                                        disabled={isLoading}
                                    >
                                        <span className="prompt-card-title">
                                            {item.title}
                                        </span>

                                        <span className="prompt-card-text">
                                            {item.prompt}
                                        </span>
                                    </button>
                                ))}

                            </div>

                        </div>

                    ) : (

                        /* Message Stream */
                        <div className="chat-messages-stream">

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`chat-row ${msg.sender}`}
                                >
                                    <div className="chat-row-inner">

                                        <div className="chat-avatar">
                                            {msg.sender === 'ai'
                                                ? '⚡'
                                                : 'U'}
                                        </div>

                                        <div className="chat-message-content">

                                            <div className="chat-sender-header">

                                                <span className="chat-sender-name">
                                                    {msg.sender === 'ai'
                                                        ? 'CodeInsight AI'
                                                        : 'You'}
                                                </span>

                                                <span className="chat-timestamp">
                                                    {msg.timestamp}
                                                </span>

                                            </div>

                                            <div className="chat-text-body">
                                                {msg.text}
                                            </div>

                                            {/* File References */}
                                            {msg.fileReferences &&
                                                msg.fileReferences.length > 0 && (
                                                    <div className="chat-references-block">

                                                        <span className="chat-block-label">
                                                            Referenced Files
                                                        </span>

                                                        <div className="chat-files-list">

                                                            {msg.fileReferences.map(
                                                                (file, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="chat-file-chip"
                                                                    >
                                                                        📄 {file}
                                                                    </span>
                                                                )
                                                            )}

                                                        </div>

                                                    </div>
                                                )}

                                            {/* Code Block */}
                                            {msg.codeSnippet && (
                                                <div className="chat-code-block">

                                                    <div className="chat-code-header">
                                                        <span>
                                                            {msg.codeSnippet.language}
                                                        </span>
                                                    </div>

                                                    <pre className="chat-code-content">
                                                        <code>
                                                            {msg.codeSnippet.code}
                                                        </code>
                                                    </pre>

                                                </div>
                                            )}

                                            {/* Citations */}
                                            {msg.citations &&
                                                msg.citations.length > 0 && (
                                                    <div className="chat-citations-block">

                                                        {msg.citations.map(
                                                            (cite, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="chat-citation-chip"
                                                                >
                                                                    📌 {cite}
                                                                </span>
                                                            )
                                                        )}

                                                    </div>
                                                )}

                                        </div>

                                    </div>
                                </div>
                            ))}

                            {/* Loading message */}
                            {isLoading && (
                                <div className="chat-row ai">

                                    <div className="chat-row-inner">

                                        <div className="chat-avatar">
                                            ⚡
                                        </div>

                                        <div className="chat-message-content">

                                            <div className="chat-sender-header">

                                                <span className="chat-sender-name">
                                                    CodeInsight AI
                                                </span>

                                            </div>

                                            <div className="chat-text-body">
                                                Analyzing the repository...
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )}

                            <div ref={messagesEndRef} />

                        </div>
                    )}

                    {/* API Error */}
                    {error && (
                        <div className="chat-api-error">
                            {error}
                        </div>
                    )}

                </div>
            </main>

            {/* Bottom Input */}
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
                            disabled={isLoading}
                            onChange={(e) =>
                                setInputText(e.target.value)
                            }
                            onKeyDown={(e) => {

                                if (
                                    e.key === 'Enter' &&
                                    !e.shiftKey
                                ) {
                                    e.preventDefault();

                                    handleSendMessage();
                                }

                            }}
                        />

                        <button
                            type="submit"
                            className="chat-send-btn"
                            disabled={
                                !inputText.trim() ||
                                isLoading
                            }
                            title="Send Message"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <line
                                    x1="12"
                                    y1="19"
                                    x2="12"
                                    y2="5"
                                />

                                <polyline
                                    points="5 12 12 5 19 12"
                                />
                            </svg>
                        </button>

                    </form>

                    <div className="chat-disclaimer">
                        CodeInsight AI provides codebase analysis based
                        on indexed AST and RAG context.
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Chat;