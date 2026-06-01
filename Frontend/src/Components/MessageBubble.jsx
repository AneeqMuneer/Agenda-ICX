import { formatMessageText } from "../utils/formatMessage";
import "../Styles/MessageBubble.css";

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const BotIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
    </svg>
);

const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const MessageBubble = ({ message, showLabel = true }) => {
    const isUser = message.sender === "user";
    const isError = message.isError;
    const streaming = message.isStreaming;

    const displayText = isUser
        ? message.text
        : streaming
          ? message.text
          : formatMessageText(message.text);

    const time = new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const AvatarIcon = isUser ? UserIcon : isError ? AlertIcon : BotIcon;
    const label = isUser ? "You" : isError ? "Error" : "Agenda";

    return (
        <article
            className={`message ${isUser ? "message--user" : "message--bot"} ${isError ? "message--error" : ""} ${streaming ? "message--streaming" : ""} ${!showLabel ? "message--compact" : ""}`}
            aria-label={isUser ? "Your message" : streaming ? "Assistant is responding" : "Assistant message"}
            aria-busy={streaming || undefined}
        >
            <div className="message__inner">
                <div className="message__avatar" aria-hidden="true">
                    <AvatarIcon />
                </div>
                <div className="message__content">
                    {showLabel && <span className="message__label">{label}</span>}
                    <div className="message__bubble">
                        <div className="message__text">
                            {displayText || (streaming ? "\u00A0" : "")}
                            {streaming && <span className="message__cursor" aria-hidden="true" />}
                        </div>
                    </div>
                    {!streaming && (
                        <div className="message__meta">
                            <time className="message__time" dateTime={message.timestamp}>
                                {time}
                            </time>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default MessageBubble;
