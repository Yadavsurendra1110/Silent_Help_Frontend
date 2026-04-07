// components/CreatePost/CreatePost.jsx
import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./CreatePost.css";

const CATEGORIES = [
    "courses", "professors", "students", "unrelated",
    "memes", "jobs", "rules", "help",
];

function CreatePost({ onClose, onCreated }) {
    const { currentUser } = useAuth();
    const [form, setForm] = useState({
        title: "",
        body: "",
        category: "",
        tags: "",
    });
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.body.trim()) return toast.error("Post content cannot be empty");

        setLoading(true);
        try {
            const payload = {
                title: form.title.trim(),
                body: form.body.trim(),
                category: form.category,
                tags: form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };
            const res = await api.post("/posts", payload);
            toast.success("Post published anonymously!");
            onCreated?.(res.data.post);
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to publish post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-user">
                        <div className="avatar avatar-sm">
                            {currentUser?.profile?.displayName?.[0]?.toUpperCase() ?? "A"}
                        </div>
                        <div>
                            <p className="modal-anonname">
                                {currentUser?.profile?.anonymousDisplayName ?? "Anonymous"}
                            </p>
                            <p className="modal-privacy">🔒 Post will be anonymous</p>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <input
                        className="modal-input"
                        name="title"
                        value={form.title}
                        onChange={handle}
                        placeholder="Title (optional)"
                    />

                    <textarea
                        className="modal-textarea"
                        name="body"
                        value={form.body}
                        onChange={handle}
                        placeholder="What's on your mind? Share anonymously…"
                        rows={5}
                        required
                    />

                    <div className="modal-row">
                        <select
                            className="modal-select"
                            name="category"
                            value={form.category}
                            onChange={handle}
                        >
                            <option value="">Select category</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>

                        <input
                            className="modal-input"
                            name="tags"
                            value={form.tags}
                            onChange={handle}
                            placeholder="Tags: topic1, topic2, …"
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Posting…" : "Post Anonymously"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
