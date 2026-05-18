// pages/Profile/Profile.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { IoPencilOutline, IoAddOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import Post from "../../components/Post/Post";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./Profile.css";

const TABS = ["Overview", "Posts", "Comments", "Upvoted", "Downvoted"];

function Profile() {
    const { id } = useParams();
    const { currentUser, refreshUser, isAdmin } = useAuth();
    const isOwn = !id || id === currentUser?._id;

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("Posts");
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState("");

    const postsWithComments = useMemo(() => posts.filter(p => (p.commentCount ?? 0) > 0), [posts]);

    useEffect(() => {
        const uid = id || currentUser?._id;
        if (!uid) return;

        Promise.all([
            api.get(`/users/${uid}`),
            api.get(`/users/${uid}/posts`),
        ]).then(([uRes, pRes]) => {
            setUser(uRes.data.user);
            setEditName(uRes.data.user?.profile?.displayName || "");
            setPosts(pRes.data.posts || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [id, currentUser]);

    const handleVote = async (postId, type) => {
        try {
            const res = await api.post(`/posts/${postId}/vote`, { type });
            setPosts((prev) =>
                prev.map((p) => (p._id === postId ? { ...p, ...res.data.post } : p))
            );
        } catch { }
    };

    const handleDelete = (postId) => setPosts((prev) => prev.filter((p) => p._id !== postId));

    const handleSaveName = async () => {
        try {
            await api.put("/users/me", { displayName: editName });
            await refreshUser();
            setEditMode(false);
            toast.success("Display name updated!");
        } catch {
            toast.error("Could not update name");
        }
    };

    if (loading) {
        return <div className="profile-loading"><div className="spinner" /></div>;
    }
    if (!user) {
        return <div className="profile-notfound">User not found.</div>;
    }

    const profile = user.profile ?? {};
    const isStudent = user.role === "student";
    const initials = (profile.displayName || "A").slice(0, 2).toUpperCase();

    return (
        <div className="profile-page">
            {/* Profile card */}
            <div className="profile-card">
                <div className="profile-top">
                    <div className="avatar avatar-xl profile-avatar">
                        {profile.photoURL
                            ? <img src={profile.photoURL} alt="avatar" />
                            : initials}
                    </div>

                    <div className="profile-info">
                        {editMode ? (
                            <div className="profile-edit-row">
                                <input
                                    className="profile-edit-input"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    autoFocus
                                />
                                <button className="btn btn-sm" onClick={handleSaveName}>Save</button>
                                <button className="btn btn-outline btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
                            </div>
                        ) : (
                            <div className="profile-name-row">
                                <h2 className="profile-name">
                                    {isStudent && !isAdmin
                                        ? profile.anonymousDisplayName ?? "Anonymous"
                                        : profile.displayName ?? "User"}
                                </h2>
                                {isOwn && (
                                    <button className="profile-edit-btn" onClick={() => setEditMode(true)}>
                                        <IoPencilOutline />
                                    </button>
                                )}
                            </div>
                        )}

                        <span className={`profile-role-badge ${user.role}`}>
                            {user.role === "admin" ? "🛡️ Administrator" : "🎓 Student"}
                        </span>

                        {isAdmin && isOwn && isStudent && profile.course && (
                            <p className="profile-detail">{profile.course} · Sem {profile.semester}</p>
                        )}
                    </div>

                    {isOwn && (
                        <Link to="/settings" className="profile-settings-link"><IoPencilOutline /> Edit profile</Link>
                    )}
                </div>

                {/* Stats */}
                <div className="profile-stats">
                    <div className="profile-stat">
                        <span className="stat-value">{posts.length}</span>
                        <span className="stat-label">Posts</span>
                    </div>
                    <div className="profile-stat">
                        <span className="stat-value">
                            {posts.reduce((acc, p) => acc + (p.commentCount ?? 0), 0)}
                        </span>
                        <span className="stat-label">Comments</span>
                    </div>
                    <div className="profile-stat">
                        <span className="stat-value">
                            {posts.reduce((acc, p) => acc + (p.upvotes?.length ?? 0), 0)}
                        </span>
                        <span className="stat-label">Upvotes</span>
                    </div>
                </div>

                {isOwn && !isAdmin && (
                    <button
                        className="btn profile-create-btn"
                        onClick={() => document.dispatchEvent(new CustomEvent("open-create-post"))}
                    >
                        <IoAddOutline /> Create post
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={`profile-tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="profile-content">
                {activeTab === "Posts" && (
                    posts.length === 0
                        ? <p className="profile-empty">No posts yet.</p>
                        : posts.map((p) => (
                            <Post key={p._id} post={p} onVote={handleVote} onDelete={handleDelete} />
                        ))
                )}
                {activeTab === "Overview" && (
                    <div className="profile-overview">
                        <h4>About</h4>
                        <p className="profile-overview-text">
                            {user.role === "admin"
                                ? `${profile.displayName} is a ${profile.designation ?? "staff member"} in the ${profile.department ?? "college"} department.`
                                : "This student uses Silent Help to share concerns anonymously with the administration."}
                        </p>
                    </div>
                )}
                {activeTab === "Comments" && (
                    postsWithComments.length === 0
                        ? <p className="profile-empty">No posts with comments yet.</p>
                        : postsWithComments.map((p) => (
                            <Post key={p._id} post={p} onVote={handleVote} onDelete={handleDelete} />
                        ))
                )}
                {(activeTab === "Upvoted" || activeTab === "Downvoted") && (
                    <p className="profile-empty">Nothing to show here yet.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;

