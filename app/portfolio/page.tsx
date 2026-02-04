"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortfolioPage() {
    const [access, setAccess] = useState<{ code: string; expiresAt: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedAccess = localStorage.getItem("portfolio_access");
        if (storedAccess) {
            const parsed = JSON.parse(storedAccess);
            const now = new Date();
            const expiresAt = new Date(parsed.expiresAt);

            if (now > expiresAt) {
                localStorage.removeItem("portfolio_access");
                router.push("/");
            } else {
                setAccess(parsed);
                setIsLoading(false);
            }
        } else {
            router.push("/");
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] text-slate-200">
            {/* Navigation */}
            <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-black text-white italic text-xl">R</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Roselle Portfolio</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                            <a href="#" className="hover:text-white transition-colors">Projects</a>
                            <a href="#" className="hover:text-white transition-colors">Experience</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem("portfolio_access");
                                router.push("/");
                            }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold border border-red-500/20 transition-all"
                        >
                            End Session
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Project Preview
                        </div>
                        <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
                            Crafting Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">Experiences.</span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-10">
                            Welcome! You have been granted temporary access to this private portfolio.
                            Explore the curated selection of projects and design case studies below.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all shadow-xl shadow-white/5">
                                View Full Resume
                            </button>
                            <button className="bg-slate-900 border border-slate-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                                Let's Talk
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Grid Placeholder */}
            <section className="py-20 bg-slate-950/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="group relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2">
                                <div className="aspect-[16/10] bg-slate-800 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold text-4xl group-hover:scale-110 transition-transform duration-700">
                                        Project {i}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">Web Application</div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Project Title Header</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                        A sophisticated solution built with React and AWS, focusing on performance and user experience.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300">Next.js</span>
                                        <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300">Tailwind</span>
                                        <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300">AWS</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Roselle. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-slate-400">
                        <a href="#" className="hover:text-indigo-400 transition-colors">GitHub</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
