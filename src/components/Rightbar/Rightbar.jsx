// components/Rightbar/Rightbar.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Rightbar.css";

function Rightbar() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get("/posts?limit=5&sort=popular")
      .then((res) => setNews(res.data.posts || []))
      .catch(() => { });
  }, []);

  return (
    <aside className="rightbar">
      <div className="rightbar-section">
        <h3 className="rightbar-title">Trending</h3>
        {news.length === 0 ? (
          <p className="rightbar-empty">No trending posts yet.</p>
        ) : (
          <ul className="rightbar-news">
            {news.map((post) => (
              <li key={post._id} className="rightbar-news-item">
                <a href={`/post/${post._id}`} className="rightbar-news-link">
                  <div className="rightbar-news-meta">
                    <span className="rightbar-news-cat">{post.category || "general"}</span>
                    <span className="rightbar-news-votes">
                      👍 {post.upvotes?.length ?? 0}
                    </span>
                  </div>
                  <p className="rightbar-news-title">
                    {post.title || post.body?.slice(0, 60) + "…"}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rightbar-section">
        <h3 className="rightbar-title">About</h3>
        <p className="rightbar-about">
          Silent Help is an anonymous platform where students can safely share
          their concerns with college administration.
        </p>
        <div className="rightbar-links">
          <a href="/settings">Settings</a> ·{" "}
          <a href="/?cat=rules">Rules</a> ·{" "}
          <a href="/chat">Support</a>
        </div>
        <p className="rightbar-copy">© {new Date().getFullYear()} Silent Help</p>
      </div>
    </aside>
  );
}

export default Rightbar;
