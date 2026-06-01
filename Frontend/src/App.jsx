import ChatWindow from "./Components/ChatWindow";
import ChatInput from "./Components/ChatInput";
import { useSocket } from "./Hooks/useSocket";
import "./Styles/App.css";

const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const App = () => {
    const { messages, isConnected, isTyping, isStreaming, connectionError, sendMessage } = useSocket();

    return (
        <div className="app-shell">

            <header className="chat-header">
                <div className="chat-header__inner">
                    <div className="chat-header__brand">
                        <div className="chat-header__avatar">
                            <CalendarIcon />
                        </div>
                        <div className="chat-header__text">
                            <div className="chat-header__title-row">
                                <h1>Agenda</h1>
                                <span
                                    className={`status-indicator ${isConnected ? "status-indicator--online" : "status-indicator--offline"}`}
                                    title={isConnected ? "Connected" : "Disconnected"}
                                    aria-label={isConnected ? "Connected" : "Disconnected"}
                                >
                                    <span className="status-indicator__dot" aria-hidden="true" />
                                </span>
                            </div>
                            <p className="chat-header__tagline">Event scheduling assistant</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="chat-main">
                <ChatWindow
                    messages={messages}
                    isTyping={isTyping}
                    isStreaming={isStreaming}
                    isConnected={isConnected}
                    onSend={sendMessage}
                />
            </div>

            <div className="input-dock">
                <div className="input-dock__inner">
                    <ChatInput
                        onSend={sendMessage}
                        disabled={!isConnected || isStreaming}
                        isStreaming={isStreaming}
                    />
                    <p className="chat-disclaimer">
                        Agenda can make mistakes. Verify important schedule details.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
