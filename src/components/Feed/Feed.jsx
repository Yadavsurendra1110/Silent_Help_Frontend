// components/Feed/Feed.jsx
import React, { useState, useEffect, useCallback } from "react";
import Post from "../Post/Post";
import api from "../../services/api";
import { IoRefreshOutline } from "react-icons/io5";
import "./Feed.css";

const CATEGORY_LABELS = {
  "": "Popular",
  courses: "Courses",
  professors: "Professors",
  students: "Students",
  unrelated: "Unrelated",
  memes: "Memes",
  jobs: "Jobs",
  rules: "Rules",
  help: "Help",
};

function Feed({ activeCategory = "", searchQuery = "" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.set("category", activeCategory);
      if (searchQuery) params.set("search", searchQuery);
      params.set("page", reset ? 1 : page);
      params.set("limit", 10);

      const res = await api.get(`/posts?${params.toString()}`);
      const { posts: newPosts, totalPages, currentPage } = res.data;

      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      setHasMore(currentPage < totalPages);
      setPage((reset ? 1 : page) + 1);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, page]);

  // Re-fetch when category or search changes
  useEffect(() => {
    setPage(1);
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery]);

  const handleRate = async (postId, rating) => {
    try {
      const res = await api.post(`/posts/${postId}/rate`, { rating });
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, averageRating: res.data.averageRating, ratingCount: res.data.ratingCount } : p))
      );
    } catch { }
  };


  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const title = CATEGORY_LABELS[activeCategory] ?? activeCategory;

  return (
    <section className="feed">
      <div className="feed-header">
        <h2 className="feed-title">
          {searchQuery ? `Results for "${searchQuery}"` : title}
        </h2>
        <button className="btn-ghost feed-refresh" onClick={() => fetchPosts(true)}>
          <IoRefreshOutline />
        </button>
      </div>

      {error && (
        <div className="feed-error">
          {error}
          <button onClick={() => fetchPosts(true)}>Retry</button>
        </div>
      )}

      {!loading && posts.length === 0 && !error && (
        <div className="feed-empty">
          <span>🤐</span>
          <p>No posts yet{activeCategory ? ` in "${title}"` : ""}.</p>
          {!activeCategory && <p>Be the first to speak up — anonymously!</p>}
        </div>
      )}

      <div className="feed-list">
        {posts.map((post) => (
        <Post key={post._id} post={post} onRate={handleRate} onDelete={handleDelete} />

        ))}
      </div>

      {loading && (
        <div className="feed-loading">
          {[1, 2, 3].map((n) => <div key={n} className="post-skeleton" />)}
        </div>
      )}

      {!loading && hasMore && (
        <button className="btn btn-outline feed-load-more" onClick={() => fetchPosts(false)}>
          Load more
        </button>
      )}
    </section>
  );
}

export default Feed;
