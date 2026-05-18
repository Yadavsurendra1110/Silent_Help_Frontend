// components/Post/Post.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoThumbsUpOutline, IoThumbsDownOutline, IoThumbsUp, IoThumbsDown,
  IoChatbubbleOutline, IoShareOutline, IoEllipsisHorizontal, IoTrashOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Post.css";

const CATEGORY_COLORS = {
  courses: "#1565C0",
  professors: "#2E7D32",
  students: "#E65100",
  unrelated: "#6A1B9A",
  memes: "#AD1457",
  jobs: "#F57F17",
  rules: "#37474F",
  help: "#00838F",
};

function Post({ post, onVote, onDelete }) {
  const { currentUser, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shareMsg, setShareMsg] = useState(false);

  const userId = currentUser?._id;
  const avgRating = post.averageRating || 0;
  const ratingCount = post.ratingCount || 0;
  const userRating = post.ratings?.find(r => r.user === userId)?.rating || 0;

  // ── Delete post ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete?.(post._id);
    } catch {
      alert("Could not delete post.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleShare = () => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg(true);
      setTimeout(() => setShareMsg(false), 2000);
    });
  };

  const canDelete = isAdmin || post.author === userId;
  const catColor = CATEGORY_COLORS[post.category] ?? "#757575";

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="avatar">
          {post.authorAvatar
            ? <img src={post.authorAvatar} alt="avatar" />
            : (post.authorDisplay || "A")[0].toUpperCase()}
        </div>

        <div className="post-meta">
          <span className="post-author">{post.authorDisplay || "Anonymous"}</span>
          <span className="post-time">
            {new Date(post.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          </span>
        </div>

        <div className="post-menu-wrapper">
          <button className="post-menu-btn" onClick={() => setMenuOpen((o) => !o)}>
            <IoEllipsisHorizontal />
          </button>
          {menuOpen && (
            <div className="post-menu-dropdown">
              {canDelete && (
                <button className="post-menu-item danger" onClick={handleDelete} disabled={deleting}>
                  <IoTrashOutline /> {deleting ? "Deleting…" : "Delete Post"}
                </button>
              )}
              <button className="post-menu-item" onClick={handleShare}>
                <IoShareOutline /> Share link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <Link to={`/post/${post._id}`} className="post-body-link">
        {post.title && <h3 className="post-title">{post.title}</h3>}
        <p className="post-body">{post.body}</p>
      </Link>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="post-tag" style={{ borderColor: catColor, color: catColor }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Category badge */}
      {post.category && (
        <span className="post-cat-badge" style={{ background: catColor + "18", color: catColor }}>
          {post.category}
        </span>
      )}

      {/* Footer actions */}
      <div className="post-actions">
        <div className="rating-stars">
{[1,2,3,4,5].map((star) => (
            <div
              key={star}
              className={`rating-star ${star <= Math.floor(avgRating) || (star <= userRating ? 'filled' : '') ? 'filled' : ''}`}
              onClick={() => onRate && onRate(post._id, star)}
              title={`${avgRating.toFixed(1)} average (${ratingCount} ratings)`}
            />
          ))}
          <span className="rating-text">{avgRating.toFixed(1)} ({ratingCount})</span>
        </div>

        <Link to={`/post/${post._id}`} className="post-action-btn">
          <IoChatbubbleOutline />
          <span>{post.commentCount ?? 0}</span>
        </Link>

        <button className="post-action-btn" onClick={handleShare}>
          <IoShareOutline />
          {shareMsg && <span className="share-copied">Copied!</span>}
        </button>
      </div>
    </article>
  );
}

export default Post;
