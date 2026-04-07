// components/Layout/Layout.jsx
// Authenticated app shell — Navbar + Slidebar + main area + Rightbar
import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Slidebar from "../Slidebar/Slidebar";
import Rightbar from "../Rightbar/Rightbar";
import CreatePost from "../CreatePost/CreatePost";
import "./Layout.css";

function Layout({ children }) {
  const [activeCategory, setActiveCategory] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pass search + category to children via cloneElement
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeCategory, searchQuery });
    }
    return child;
  });

  return (
    <div className="app-shell">
      <Navbar onSearch={setSearchQuery} />

      <div className="app-body">
        <Slidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onCreatePost={() => setShowCreatePost(true)}
        />

        <main className="app-main">
          {childrenWithProps}
        </main>

        <Rightbar />
      </div>

      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      )}
    </div>
  );
}

export default Layout;
