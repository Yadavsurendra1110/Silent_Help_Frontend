import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import "./CompleteProfile.css";

const COURSES = ["B.Tech", "B.E.", "BCA", "BBA", "B.Sc", "M.Tech", "MCA", "MBA", "M.Sc", "Other"];
const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const DIVISIONS = ["A", "B", "C", "D", "E"];
const DESIGNATIONS = ["Dean", "HOD", "Principal", "Vice Principal", "Professor", "Assistant Professor", "Other"];

function CompleteProfile() {
    const { currentUser, refreshUser } = useAuth();
    const navigate = useNavigate();
    const isAdmin = currentUser?.role === "admin";

    // Student fields
    const [form, setForm] = useState({
        displayName: currentUser?.profile?.realName || "",
        enrollmentNo: "",
        batch: "",
        division: "",
        course: "",
        semester: "",
        phone: "",
        designation: "",
        department: "",
        employeeId: "",
    });
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.displayName.trim()) return toast.error("Name is required");
        if (!isAdmin) {
            if (!form.enrollmentNo.trim()) return toast.error("Enrollment number is required");
            if (!form.course) return toast.error("Please select your course");
            if (!form.semester) return toast.error("Please select your semester");
            if (!/^\d{10}$/.test(form.phone)) return toast.error("Enter a valid 10-digit phone number");
        }

        setLoading(true);
        try {
            await api.post("/auth/complete-profile", { ...form, role: currentUser.role });
            await refreshUser();
            toast.success("Profile completed! Welcome to Silent Help 🎉");
            navigate("/", { replace: true });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cp-page">
            <div className="cp-card">
                <div className="cp-header">
                    <div className="cp-logo">🔒</div>
                    <h2>Complete Your Profile</h2>
                    <p>
                        {isAdmin
                            ? "Set up your administrator account to manage the platform."
                            : "Your personal details are encrypted and never shown publicly."}
                    </p>
                    <span className={`cp-role-badge ${isAdmin ? "admin" : "student"}`}>
                        {isAdmin ? "🛡️ College Head / Administrator" : "🎓 Student"}
                    </span>
                </div>

                <form className="cp-form" onSubmit={handleSubmit} noValidate>
                    {/* Common */}
                    <div className="cp-row">
                        <div className="cp-field">
                            <label>Full Name *</label>
                            <input
                                name="displayName"
                                value={form.displayName}
                                onChange={handle}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="cp-field">
                            <label>Email</label>
                            <input value={currentUser?.email || ""} disabled />
                        </div>
                    </div>

                    {/* ── Student fields ──────────────────── */}
                    {!isAdmin && (
                        <>
                            <div className="cp-row">
                                <div className="cp-field">
                                    <label>Enrollment Number *</label>
                                    <input
                                        name="enrollmentNo"
                                        value={form.enrollmentNo}
                                        onChange={handle}
                                        placeholder="e.g. 22BTECH1001"
                                        required
                                    />
                                </div>
                                <div className="cp-field">
                                    <label>Batch *</label>
                                    <input
                                        name="batch"
                                        value={form.batch}
                                        onChange={handle}
                                        placeholder="e.g. 2022–2026"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="cp-row">
                                <div className="cp-field">
                                    <label>Course *</label>
                                    <select name="course" value={form.course} onChange={handle} required>
                                        <option value="">Select course</option>
                                        {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="cp-field">
                                    <label>Semester *</label>
                                    <select name="semester" value={form.semester} onChange={handle} required>
                                        <option value="">Select semester</option>
                                        {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="cp-row">
                                <div className="cp-field">
                                    <label>Division</label>
                                    <select name="division" value={form.division} onChange={handle}>
                                        <option value="">Select division</option>
                                        {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="cp-field">
                                    <label>Phone Number *</label>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handle}
                                        placeholder="10-digit college-linked number"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Admin fields ──────────────────── */}
                    {isAdmin && (
                        <>
                            <div className="cp-row">
                                <div className="cp-field">
                                    <label>Designation *</label>
                                    <select name="designation" value={form.designation} onChange={handle} required>
                                        <option value="">Select designation</option>
                                        {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="cp-field">
                                    <label>Department *</label>
                                    <input
                                        name="department"
                                        value={form.department}
                                        onChange={handle}
                                        placeholder="e.g. Computer Science"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="cp-row">
                                <div className="cp-field">
                                    <label>Employee ID *</label>
                                    <input
                                        name="employeeId"
                                        value={form.employeeId}
                                        onChange={handle}
                                        placeholder="Your employee / faculty ID"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="cp-notice">
                        <span>🔐</span>
                        <p>
                            {isAdmin
                                ? "Your information helps students verify that their concerns are addressed by an official."
                                : "Your real information is stored securely and is never visible to other users or administrators on the platform."}
                        </p>
                    </div>

                    <button className="btn btn-full cp-submit" type="submit" disabled={loading}>
                        {loading ? "Saving…" : "Complete Profile & Enter"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompleteProfile;
