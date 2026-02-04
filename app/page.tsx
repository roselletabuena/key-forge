"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";

const client = generateClient<Schema>();

export default function Home() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await client.models.TemporaryPassword.list({
        filter: { code: { eq: code.toUpperCase() } }
      });

      if (data.length === 0) {
        setError("Invalid access code. Please try again.");
      } else {
        const password = data[0];
        const now = new Date();
        const expiresAt = new Date(password.expiresAt);

        if (now > expiresAt) {
          setError("This access code has expired.");
        } else {
          localStorage.setItem("portfolio_access", JSON.stringify({
            code: password.code,
            expiresAt: password.expiresAt
          }));
          router.push("/portfolio");
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
            Secure Access
          </h1>
          <p className="text-slate-400 text-lg">
            Enter your private key to view the portfolio
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 border border-indigo-500/10 rounded-[2rem] group-hover:border-indigo-500/30 transition-colors"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <input
                type="text"
                placeholder="8-Character Key"
                className={`w-full bg-slate-950/50 border ${error ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-4 text-center text-xl font-mono tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all uppercase`}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={8}
                required
              />
              {error && (
                <p className="text-red-400 text-sm mt-3 text-center animate-in fade-in duration-300">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Grant Access"
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/admin"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            Admin Portal
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 left-0 w-full text-center text-slate-600 text-xs tracking-widest uppercase">
        &copy; {new Date().getFullYear()} KeyForge Security
      </footer>
    </main>
  );
}
