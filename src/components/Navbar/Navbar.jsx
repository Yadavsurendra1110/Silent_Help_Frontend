// components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoChatbubbleEllipsesOutline, IoNotificationsOutline, IoSearchOutline, IoLogOutOutline } from "react-icons/io5";
import { RiSettings3Line } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar({ onSearch }) {
    const { currentUser, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [searchVal, setSearchVal] = useState("");
    const [dropOpen, setDropOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(searchVal.trim());
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const initials = currentUser?.profile?.displayName
        ? currentUser.profile.displayName.slice(0, 2).toUpperCase()
        : "?";

    return (
        <header className="navbar">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
                <span className="navbar-logo-icon">🔒</span>
                <span className="navbar-logo-text">Silent Help</span>
            </Link>

            {/* Search */}
            <form className="navbar-search" onSubmit={handleSearch}>
                <IoSearchOutline className="search-icon" />
                <input
                    type="text"
                    placeholder="Search posts…"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                />
            </form>

            {/* Right actions */}
            <div className="navbar-actions">
                <Link to="/chat" className="nav-icon-btn" title="Messages">
                    <IoChatbubbleEllipsesOutline />
                </Link>
                <Link to="/notifications" className="nav-icon-btn" title="Notifications">
                    <IoNotificationsOutline />
                </Link>

                {/* Profile dropdown */}
                <div className="nav-profile" onClick={() => setDropOpen((o) => !o)}>
                    <div className="avatar avatar-sm nav-avatar">
                        {currentUser?.profile?.photoURL
                            ? <img src={currentUser.profile.photoURL} alt="avatar" />
                            : initials}
                    </div>
                    {dropOpen && (
                        <div className="nav-dropdown">
                            <div className="nav-dropdown-user">
                                <div className="avatar avatar-sm">
                                    {currentUser?.profile?.photoURL
                                        ? <img src={currentUser.profile.photoURL} alt="avatar" />
                                        : initials}
                                </div>
                                <div>
                                    <p className="nav-dropdown-name">
                                        {currentUser?.profile?.displayName || "User"}
                                    </p>
                                    <p className="nav-dropdown-role">
                                        {isAdmin ? "Administrator" : currentUser?.profile?.anonymousDisplayName || "Student"}
                                    </p>
                                </div>
                            </div>
                            <div className="nav-dropdown-divider" />
                            <Link to="/profile" className="nav-dropdown-item" onClick={() => setDropOpen(false)}>
                                My Profile
                            </Link>
                            <Link to="/settings" className="nav-dropdown-item" onClick={() => setDropOpen(false)}>
                                <RiSettings3Line /> Settings
                            </Link>
                            <div className="nav-dropdown-divider" />
                            <button className="nav-dropdown-item danger" onClick={handleLogout}>
                                <IoLogOutOutline /> Log out
                            </button>
                        </div>
                    )}
                </div>

                <button className="btn btn-sm navbar-logout" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </header>
    );
}

export default Navbar;
