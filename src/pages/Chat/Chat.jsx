// pages/Chat/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { IoSendOutline, IoImageOutline, IoCloseOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Chat.css";

function Chat() {
    const { currentUser, isAdmin } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [sending, setSending] = useState(false);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const messagesEndRef = useRef(null);

    // Load chat list
    useEffect(() => {
        api.get("/chats").then((res) => setChats(res.data.chats || [])).catch(() => { });
    }, []);

    // Load messages when chat changes
    useEffect(() => {
        if (!activeChat) return;
        setLoadingMsgs(true);
        api.get(`/chats/${activeChat._id}/messages`)
            .then((res) => setMessages(res.data.messages || []))
            .catch(() => { })
            .finally(() => setLoadingMsgs(false));
    }, [activeChat]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !activeChat) return;
        setSending(true);
        try {
            const res = await api.post(`/chats/${activeChat._id}/messages`, {
                text: newMsg.trim(),
            });
            setMessages((prev) => [...prev, res.data.message]);
            setNewMsg("");
        } catch {
            alert("Message failed to send.");
        } finally {
            setSending(false);
        }
    };

    const myId = currentUser?._id;

    return (
        <div className="chat-page">
            {/* Left panel — chat list */}
            <div className="chat-list-panel">
                <h3 className="chat-list-title">Chats</h3>
                {chats.length === 0 ? (
                    <p className="chat-list-empty">
                        {isAdmin
                            ? "No student conversations yet."
                            : "No messages yet. Use the post section to share your concerns."}
                    </p>
                ) : (
                    <ul className="chat-list">
                        {chats.map((chat) => {
                            const other = chat.participants?.find((p) => p._id !== myId);
                            return (
                                <li
                                    key={chat._id}
                                    className={`chat-list-item ${activeChat?._id === chat._id ? "active" : ""}`}
                                    onClick={() => setActiveChat(chat)}
                                >
                                    <div className="avatar avatar-sm">
                                        {(other?.profile?.anonymousDisplayName || other?.profile?.displayName || "?")[0].toUpperCase()}
                                    </div>
                                    <div className="chat-list-info">
                                        <span className="chat-list-name">
                                            {isAdmin
                                                ? other?.profile?.anonymousDisplayName ?? "Anonymous"
                                                : other?.profile?.displayName ?? "Admin"}
                                        </span>
                                        <span className="chat-list-last">
                                            {chat.lastMessage?.text?.slice(0, 40) ?? "No messages yet"}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* News section */}
                <div className="chat-news-section">
                    <h4 className="chat-news-title">News</h4>
                    <p className="chat-news-item">🔔 Feature updates coming soon</p>
                    <p className="chat-news-item">📢 Check the rules section</p>
                </div>
            </div>

            {/* Right panel — messages */}
            <div className="chat-messages-panel">
                {!activeChat ? (
                    <div className="chat-select-prompt">
                        <span>💬</span>
                        <p>Select a conversation to start chatting</p>
                    </div>
                ) : (
                    <>
                        {/* Chat header */}
                        <div className="chat-header">
                            <div className="avatar avatar-sm">
                                {(() => {
                                    const other = activeChat.participants?.find((p) => p._id !== myId);
                                    return (other?.profile?.anonymousDisplayName || "?")[0].toUpperCase();
                                })()}
                            </div>
                            <span className="chat-header-name">
                                {(() => {
                                    const other = activeChat.participants?.find((p) => p._id !== myId);
                                    return isAdmin
                                        ? other?.profile?.anonymousDisplayName ?? "Anonymous"
                                        : other?.profile?.displayName ?? "Admin";
                                })()}
                            </span>
                            <button className="chat-close-btn" onClick={() => setActiveChat(null)}>
                                <IoCloseOutline />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {loadingMsgs ? (
                                <p className="chat-loading">Loading messages…</p>
                            ) : messages.length === 0 ? (
                                <p className="chat-no-msgs">Start the conversation!</p>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`chat-bubble ${msg.sender === myId ? "own" : "other"}`}
                                    >
                                        <p className="bubble-text">{msg.text}</p>
                                        <span className="bubble-time">
                                            {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form className="chat-input-bar" onSubmit={sendMessage}>
                            <button type="button" className="chat-attach-btn">
                                <IoImageOutline />
                            </button>
                            <input
                                value={newMsg}
                                onChange={(e) => setNewMsg(e.target.value)}
                                placeholder="Type a message…"
                                disabled={sending}
                            />
                            <button type="submit" className="chat-send-btn" disabled={sending || !newMsg.trim()}>
                                <IoSendOutline />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Chat;
