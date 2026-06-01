import { useCallback, useEffect, useRef, useState } from "react";
import "../Styles/ChatInput.css";

const SendIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.4 20.6 21 12 3.4 3.4l-.9 7.3 9.8 1.3-9.8 1.3.9 7.3z" />
    </svg>
);

const MIN_ROWS = 1;
const MAX_ROWS = 5;
const LINE_HEIGHT = 22;
const MAX_MESSAGE_LENGTH = 500;

const ChatInput = ({ onSend, disabled, isStreaming }) => {
    const [input, setInput] = useState("");
    const fieldRef = useRef(null);

    const resizeField = useCallback(() => {
        const el = fieldRef.current;
        if (!el) return;
        el.style.height = "auto";
        const maxHeight = LINE_HEIGHT * MAX_ROWS + 22;
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }, []);

    useEffect(() => {
        resizeField();
    }, [input, resizeField]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;
        onSend(input);
        setInput("");
        requestAnimationFrame(resizeField);
        fieldRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="chat-input">
            <form className="chat-input__form" onSubmit={handleSubmit}>
                <textarea
                    ref={fieldRef}
                    className="chat-input__field"
                    rows={MIN_ROWS}
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                    maxLength={MAX_MESSAGE_LENGTH}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        isStreaming
                            ? "Assistant is responding…"
                            : disabled
                              ? "Waiting for connection…"
                              : "Ask about your schedule…"
                    }
                    disabled={disabled}
                    aria-label="Message input"
                    enterKeyHint="send"
                />
                <button
                    type="submit"
                    className="chat-input__send"
                    disabled={disabled || !input.trim()}
                    aria-label="Send message"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
