"use client";

import { useState, useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <Authenticator hideSignUp={true}>
                {({ signOut, user }) => (
                    <main className="fixed inset-0 min-h-screen bg-[#020617] text-slate-200 font-sans z-50 overflow-y-auto">
                        {/* Navigation */}
                        <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between h-16 items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                            KeyForge Admin
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-slate-400 hidden sm:block">
                                            {user?.signInDetails?.loginId}
                                        </span>
                                        <button
                                            onClick={signOut}
                                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full border border-slate-700"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                            <DashboardContent />
                        </div>
                    </main>
                )}
            </Authenticator>

            <style jsx global>{`
                [data-amplify-authenticator] {
                    --amplify-colors-background-primary: transparent;
                    --amplify-colors-font-primary: white;
                    --amplify-colors-font-secondary: #94a3b8;
                    --amplify-colors-brand-primary-80: #6366f1;
                    --amplify-colors-brand-primary-90: #4f46e5;
                    --amplify-colors-brand-primary-100: #4338ca;
                    --amplify-colors-border-primary: #1e293b;
                    --amplify-colors-border-focus: #6366f1;
                    --amplify-components-fieldcontrol-border-color: #1e293b;
                    --amplify-components-fieldcontrol-background-color: #0f172a;
                    --amplify-components-fieldcontrol-color: white;
                    --amplify-components-button-primary-background-color: #6366f1;
                    --amplify-components-button-primary-hover-background-color: #4f46e5;
                    --amplify-components-button-link-color: #818cf8;
                    --amplify-components-card-background-color: #0f172a;
                    --amplify-components-card-border-color: #1e293b;
                    --amplify-components-card-border-radius: 1.5rem;
                    --amplify-components-card-box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .amplify-button[data-variation='primary'] {
                    background: linear-gradient(to right, #4f46e5, #7c3aed);
                    border: none;
                    font-weight: bold;
                    border-radius: 0.75rem;
                    padding: 0.75rem;
                }
                .amplify-field-group__control input {
                    border-radius: 0.75rem !important;
                }
                .amplify-heading {
                    color: white;
                }
                .amplify-label {
                    color: #94a3b8;
                }
            `}</style>
        </div>
    );
}

function DashboardContent() {
    const [passwords, setPasswords] = useState<Schema["TemporaryPassword"]["type"][]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState({
        description: "",
        days: "1"
    });

    useEffect(() => {
        fetchPasswords();
    }, []);

    const fetchPasswords = async () => {
        setLoading(true);
        try {
            const { data } = await client.models.TemporaryPassword.list();
            // Sort by creation date or expiration
            const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPasswords(sorted);
        } catch (error) {
            console.error("Error fetching passwords:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No O, 0, I, 1 to avoid confusion
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleAddPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = generateCode();
        const now = new Date();
        const expiresAt = new Date(now);

        const daysMap: Record<string, number> = {
            "1": 1,
            "3": 3,
            "14": 14,
            "30": 30
        };

        expiresAt.setDate(now.getDate() + daysMap[newPassword.days]);

        try {
            await client.models.TemporaryPassword.create({
                code,
                expiresAt: expiresAt.toISOString(),
                description: newPassword.description || "Untitled Key"
            });
            setIsModalOpen(false);
            setNewPassword({ description: "", days: "1" });
            fetchPasswords();
        } catch (error) {
            console.error("Error creating password:", error);
            alert("Failed to create password");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this password? Access will be revoked immediately.")) return;

        try {
            await client.models.TemporaryPassword.delete({ id });
            fetchPasswords();
        } catch (error) {
            console.error("Error deleting password:", error);
        }
    };

    const isExpired = (dateStr: string) => {
        return new Date(dateStr) < new Date();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Temporary Passwords</h2>
                    <p className="text-slate-400 mt-1">Manage access keys for your portfolio.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Generate New Key
                </button>
            </div>

            {/* Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Label / Description</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Access Code</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Expires At</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : passwords.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                        No temporary passwords generated yet.
                                    </td>
                                </tr>
                            ) : (
                                passwords.map((pw) => (
                                    <tr key={pw.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-200">{pw.description || "—"}</td>
                                        <td className="px-6 py-4">
                                            <code className="bg-slate-800 text-indigo-400 px-3 py-1.5 rounded-lg font-mono text-sm border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                                                {pw.code}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {new Date(pw.expiresAt).toLocaleDateString()} {new Date(pw.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isExpired(pw.expiresAt) ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    Expired
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(pw.id)}
                                                className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
                                                title="Delete Key"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1e293b] border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl scale-in-center animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Generate Code</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Label (e.g., Client Name)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Portfolio Viewer"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                                    value={newPassword.description}
                                    onChange={(e) => setNewPassword({ ...newPassword, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-4">Duration</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "1 Day", val: "1" },
                                        { label: "3 Days", val: "3" },
                                        { label: "2 Weeks", val: "14" },
                                        { label: "1 Month", val: "30" }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            type="button"
                                            onClick={() => setNewPassword({ ...newPassword, days: opt.val })}
                                            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${newPassword.days === opt.val
                                                ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                                                : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
                            >
                                Create Access Key
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
