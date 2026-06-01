import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import "../Styles/ChatWindow.css";

const QUICK_REPLIES = [
    "Schedule a meeting tomorrow at 2pm",
    "What's on my calendar today?",
    "Reschedule my 3pm appointment",
    "Cancel my meeting on Friday",
];

const BotIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
    </svg>
);

const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
);

const TypingIndicator = () => (
    <div className="typing-row" aria-label="Assistant is typing">
        <div className="typing-row__avatar">
            <BotIcon />
        </div>
        <div className="typing-dots">
            <span />
            <span />
            <span />
        </div>
    </div>
);

const ChatWindow = ({ messages, isTyping, isStreaming, isConnected, onSend }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, isStreaming]);

    const isEmpty = messages.length === 0;
    const threadClass = isEmpty && !isTyping && !isStreaming ? "thread thread--empty" : "thread thread--chat";

    return (
        <main className="chat-window" aria-label="Chat messages">
            <div className={threadClass}>
                {isEmpty && !isTyping && !isStreaming && (
                    <div className="welcome">
                        <div className="welcome__icon">
                            <CalendarIcon />
                        </div>
                        <h2>How can I help you schedule today?</h2>
                        <p>
                            Book meetings, check your calendar, or update events. Choose a suggestion below or type your own message.
                        </p>
                        <div className="quick-replies" role="group" aria-label="Suggested messages">
                            {QUICK_REPLIES.map((text) => (
                                <button
                                    key={text}
                                    type="button"
                                    className="quick-reply"
                                    onClick={() => onSend(text)}
                                    disabled={!isConnected}
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="messages-list">
                    {messages.map((msg, index) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            showLabel={
                                index === 0 ||
                                messages[index - 1].sender !== msg.sender
                            }
                        />
                    ))}
                    {isTyping && !isStreaming && <TypingIndicator />}
                </div>
                <div ref={bottomRef} className="scroll-anchor" />
            </div>
        </main>
    );
};

export default ChatWindow;
