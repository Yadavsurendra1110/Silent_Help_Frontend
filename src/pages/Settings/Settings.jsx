// pages/Settings/Settings.jsx
import React, { useState } from "react";
import {
    IoPersonOutline, IoNotificationsOutline, IoLockClosedOutline,
    IoHelpCircleOutline, IoChatbubbleEllipsesOutline, IoLanguageOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./Settings.css";

const MENU = [
    { key: "account", label: "Account", icon: <IoPersonOutline /> },
    { key: "notifications", label: "Notifications", icon: <IoNotificationsOutline /> },
    { key: "privacy", label: "Privacy", icon: <IoLockClosedOutline /> },
    { key: "help", label: "Help", icon: <IoHelpCircleOutline /> },
    { key: "support", label: "Support", icon: <IoChatbubbleEllipsesOutline /> },
    { key: "languages", label: "Languages", icon: <IoLanguageOutline /> },
];

const DEFAULT_NOTIF = {
    privateMessages: true,
    mentions: true,
    commentsOnPosts: true,
    updatesOnPosts: false,
    reactsOnComments: false,
    repliesOnComments: true,
};

function Settings() {
    const { currentUser, refreshUser } = useAuth();
    const [activeMenu, setActiveMenu] = useState("account");
    const [saving, setSaving] = useState(false);

    // Account form
    const [accForm, setAccForm] = useState({
        displayName: currentUser?.profile?.displayName ?? "",
        phone: currentUser?.profile?.phone ?? "",
    });

    // Notification settings
    const [notif, setNotif] = useState(
        currentUser?.settings?.notifications ?? DEFAULT_NOTIF
    );

    const handleAccSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/users/me", accForm);
            await refreshUser();
            toast.success("Account updated!");
        } catch {
            toast.error("Could not save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleNotifSave = async () => {
        setSaving(true);
        try {
            await api.put("/users/me/settings", { notifications: notif });
            await refreshUser();
            toast.success("Notification preferences saved!");
        } catch {
            toast.error("Could not save notification settings");
        } finally {
            setSaving(false);
        }
    };

    const toggleNotif = (key) =>
        setNotif((prev) => ({ ...prev, [key]: !prev[key] }));

    // ── Sections ──────────────────────────────────────────────────────────────
    const renderContent = () => {
        switch (activeMenu) {
            case "account":
                return (
                    <form className="settings-section" onSubmit={handleAccSave}>
                        <h3 className="settings-section-title">Account Settings</h3>

                        <div className="settings-field">
                            <label>Display Name</label>
                            <input
                                value={accForm.displayName}
                                onChange={(e) => setAccForm((p) => ({ ...p, displayName: e.target.value }))}
                                placeholder="How you appear to others"
                            />
                        </div>

                        <div className="settings-field">
                            <label>Email</label>
                            <input value={currentUser?.email ?? ""} disabled />
                            <p className="settings-hint">Your college email cannot be changed.</p>
                        </div>

                        <div className="settings-field">
                            <label>Phone</label>
                            <input
                                value={accForm.phone}
                                onChange={(e) => setAccForm((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="10-digit phone number"
                                maxLength={10}
                            />
                        </div>

                        <div className="settings-field">
                            <label>Anonymous Display Name</label>
                            <input value={currentUser?.profile?.anonymousDisplayName ?? "—"} disabled />
                            <p className="settings-hint">Auto-generated. Other users see this name.</p>
                        </div>

                        <button className="btn settings-save-btn" type="submit" disabled={saving}>
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </form>
                );

            case "notifications":
                return (
                    <div className="settings-section">
                        <h3 className="settings-section-title">Notification Settings</h3>
                        {Object.entries({
                            privateMessages: "Private messages",
                            mentions: "Mentions of you / username",
                            commentsOnPosts: "Comments on your posts",
                            updatesOnPosts: "Updates on your posts",
                            reactsOnComments: "Reacts on your comments",
                            repliesOnComments: "Replies on your comments",
                        }).map(([key, label]) => (
                            <div className="settings-toggle-row" key={key}>
                                <span className="settings-toggle-label">{label}</span>
                                <button
                                    className={`settings-toggle ${notif[key] ? "on" : "off"}`}
                                    onClick={() => toggleNotif(key)}
                                    type="button"
                                >
                                    <span className="settings-toggle-knob" />
                                </button>
                            </div>
                        ))}
                        <button className="btn settings-save-btn" onClick={handleNotifSave} disabled={saving}>
                            {saving ? "Saving…" : "Save Preferences"}
                        </button>
                    </div>
                );

            case "privacy":
                return (
                    <div className="settings-section">
                        <h3 className="settings-section-title">Privacy</h3>
                        <p className="settings-info">
                            Your real identity is <strong>never</strong> shared with other users or
                            administrators on this platform. Only your anonymous display name is visible.
                        </p>
                        <ul className="settings-privacy-list">
                            <li>✅ Posts are automatically anonymous</li>
                            <li>✅ Your enrollment number is never shown</li>
                            <li>✅ Your phone number is private</li>
                            <li>✅ Your real name is not visible on the platform</li>
                        </ul>
                    </div>
                );

            case "help":
                return (
                    <div className="settings-section">
                        <h3 className="settings-section-title">Help</h3>
                        <p className="settings-info">
                            Silent Help is a platform for college students to raise their concerns
                            anonymously. Posts are visible to the administration, who can respond.
                        </p>
                        <h4 className="settings-help-q">How to post?</h4>
                        <p className="settings-info">Click the "Create Post" button in the sidebar. Select a category and write your concern.</p>
                        <h4 className="settings-help-q">Is my identity safe?</h4>
                        <p className="settings-info">Yes. Your real name and enrollment number are stored securely and are never shown on the platform.</p>
                    </div>
                );

            case "support":
                return (
                    <div className="settings-section">
                        <h3 className="settings-section-title">Support</h3>
                        <p className="settings-info">
                            Need to talk to someone? Use the chat section to directly message an administrator.
                        </p>
                        <a href="/chat" className="btn" style={{ display: "inline-flex" }}>Go to Chat</a>
                    </div>
                );

            case "languages":
                return (
                    <div className="settings-section">
                        <h3 className="settings-section-title">Language</h3>
                        <p className="settings-info">Currently the platform is available in English. More languages coming soon.</p>
                        <select className="settings-select" defaultValue="en">
                            <option value="en">English</option>
                            <option value="hi" disabled>हिन्दी (coming soon)</option>
                            <option value="gu" disabled>ગુજરાતી (coming soon)</option>
                        </select>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-layout">
                {/* Left menu */}
                <aside className="settings-menu">
                    <h2 className="settings-menu-title">Settings</h2>
                    {MENU.map((item) => (
                        <button
                            key={item.key}
                            className={`settings-menu-item ${activeMenu === item.key ? "active" : ""}`}
                            onClick={() => setActiveMenu(item.key)}
                        >
                            <span className="settings-menu-icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <div className="settings-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Settings;
