// components/Slidebar/Slidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IoFlameOutline, IoBookOutline, IoSchoolOutline,
  IoPeopleOutline, IoHelpCircleOutline,
  IoBriefcaseOutline, IoListOutline,
  IoChatbubbleEllipsesOutline, IoSettingsOutline, IoAddCircleOutline,
} from "react-icons/io5";
import { MdOutlineQuestionMark, MdOutlineEmojiEmotions } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import "./Slidebar.css";

const NAV_ITEMS = [
  { label: "Popular", icon: <IoFlameOutline />, path: "/", category: "" },
  { label: "Courses", icon: <IoBookOutline />, path: "/", category: "courses" },
  { label: "Professors", icon: <IoSchoolOutline />, path: "/", category: "professors" },
  { label: "Students", icon: <IoPeopleOutline />, path: "/", category: "students" },
  { label: "Unrelated", icon: <MdOutlineQuestionMark />, path: "/", category: "unrelated" },
  { label: "Memes", icon: <MdOutlineEmojiEmotions />, path: "/", category: "memes" },
  { label: "Jobs", icon: <IoBriefcaseOutline />, path: "/", category: "jobs" },
  { label: "Rules", icon: <IoListOutline />, path: "/", category: "rules" },
  { label: "Help", icon: <IoHelpCircleOutline />, path: "/", category: "help" },
  { label: "Support", icon: <IoChatbubbleEllipsesOutline />, path: "/chat", category: null },
  { label: "Settings", icon: <IoSettingsOutline />, path: "/settings", category: null },
];

function Slidebar({ activeCategory, onCategoryChange, onCreatePost }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleNav = (item, e) => {
    e.preventDefault();
    if (item.category !== null && onCategoryChange) {
      onCategoryChange(item.category);
    }
    navigate(item.path);
  };

  const isActive = (item) => {
    if (item.category !== null) {
      return activeCategory === item.category;
    }
    return false;
  };

  return (
    <aside className="slidebar">
      <nav className="slidebar-nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className={`slidebar-item ${isActive(item) ? "active" : ""}`}
            onClick={(e) => handleNav(item, e)}
          >
            <span className="slidebar-icon">{item.icon}</span>
            <span className="slidebar-label">{item.label}</span>
          </a>
        ))}
      </nav>

      {!isAdmin && (
        <button className="btn slidebar-create-btn" onClick={onCreatePost}>
          <IoAddCircleOutline />
          Create Post
        </button>
      )}
    </aside>
  );
}

export default Slidebar;
