// pages/PostDetail/PostDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    IoThumbsUpOutline, IoThumbsDownOutline, IoThumbsUp, IoThumbsDown,
    IoArrowBackOutline, IoSendOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./PostDetail.css";

function Comment({ comment, postId, currentUserId }) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState(comment.replies ?? []);

    const sendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            const res = await api.post(`/posts/${postId}/comments/${comment._id}/replies`, {
                text: replyText.trim(),
            });
            setReplies((prev) => [...prev, res.data.reply]);
            setReplyText("");
            setReplyOpen(false);
        } catch {
            toast.error("Could not post reply");
        }
    };

    return (
        <div className="comment">
            <div className="comment-header">
                <div className="avatar avatar-sm">
                    {(comment.authorDisplay || "A")[0].toUpperCase()}
                </div>
                <div className="comment-meta">
                    <span className="comment-author">{comment.authorDisplay ?? "Anonymous"}</span>
                    <span className="comment-time">
                        {new Date(comment.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short",
                        })}
                    </span>
                </div>
            </div>
            <p className="comment-text">{comment.text}</p>
            <div className="comment-actions">
                <button className="comment-action" onClick={() => setReplyOpen((o) => !o)}>
                    Reply
                </button>
            </div>

            {replyOpen && (
                <form className="reply-form" onSubmit={sendReply}>
                    <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply…"
                        autoFocus
                    />
                    <button type="submit" className="btn btn-sm"><IoSendOutline /></button>
                </form>
            )}

            {replies.length > 0 && (
                <div className="replies">
                    {replies.map((r) => (
                        <div key={r._id} className="reply">
                            <div className="avatar avatar-sm">
                                {(r.authorDisplay || "?")[0].toUpperCase()}
                            </div>
                            <div>
                                <span className="comment-author">{r.authorDisplay ?? "Anonymous"}</span>
                                <p className="comment-text">{r.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function PostDetail() {
    const { id } = useParams();
    const { currentUser } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCmt, setNewCmt] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get(`/posts/${id}`),
            api.get(`/posts/${id}/comments`),
        ]).then(([pRes, cRes]) => {
            setPost(pRes.data.post);
            setComments(cRes.data.comments ?? []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    const handleVote = async (type) => {
        try {
            const res = await api.post(`/posts/${post._id}/vote`, { type });
            setPost((p) => ({ ...p, ...res.data.post }));
        } catch { }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newCmt.trim()) return;
        setSending(true);
        try {
            const res = await api.post(`/posts/${id}/comments`, { text: newCmt.trim() });
            setComments((prev) => [...prev, res.data.comment]);
            setNewCmt("");
        } catch {
            toast.error("Could not post comment");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="postdetail-loading"><div className="spinner" /></div>;
    if (!post) return <div className="postdetail-notfound">Post not found.</div>;

    const userId = currentUser?._id;
    const upvoted = post.upvotes?.includes(userId);
    const downvoted = post.downvotes?.includes(userId);

    return (
        <div className="postdetail-page">
            <Link to="/" className="postdetail-back">
                <IoArrowBackOutline /> Back to feed
            </Link>

            <article className="postdetail-card">
                <div className="postdetail-header">
                    <div className="avatar">
                        {(post.authorDisplay || "A")[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="post-author">{post.authorDisplay ?? "Anonymous"}</p>
                        <p className="post-time">
                            {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "long", year: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {post.title && <h2 className="postdetail-title">{post.title}</h2>}
                <p className="postdetail-body">{post.body}</p>

                {post.tags?.length > 0 && (
                    <div className="post-tags">
                        {post.tags.map((t) => (
                            <span key={t} className="post-tag">{t}</span>
                        ))}
                    </div>
                )}

                <div className="post-actions" style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 12 }}>
                    <button className={`post-action-btn ${upvoted ? "active" : ""}`} onClick={() => handleVote("upvote")}>
                        {upvoted ? <IoThumbsUp /> : <IoThumbsUpOutline />}
                        <span>{post.upvotes?.length ?? 0}</span>
                    </button>
                    <button className={`post-action-btn ${downvoted ? "active down" : ""}`} onClick={() => handleVote("downvote")}>
                        {downvoted ? <IoThumbsDown /> : <IoThumbsDownOutline />}
                        <span>{post.downvotes?.length ?? 0}</span>
                    </button>
                </div>
            </article>

            {/* Comments */}
            <div className="postdetail-comments">
                <h3 className="comments-title">
                    {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                </h3>

                <form className="comment-form" onSubmit={handleComment}>
                    <div className="avatar avatar-sm">
                        {(currentUser?.profile?.displayName || "A")[0].toUpperCase()}
                    </div>
                    <input
                        value={newCmt}
                        onChange={(e) => setNewCmt(e.target.value)}
                        placeholder="Add a comment…"
                        disabled={sending}
                    />
                    <button type="submit" className="btn btn-sm" disabled={!newCmt.trim() || sending}>
                        <IoSendOutline />
                    </button>
                </form>

                <div className="comments-list">
                    {comments.map((c) => (
                        <Comment
                            key={c._id}
                            comment={c}
                            postId={id}
                            currentUserId={userId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
