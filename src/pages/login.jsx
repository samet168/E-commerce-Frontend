import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  ShieldCheck,
  Lock,
  Mail,
  Sun,
  Moon,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://e-commerce-backend-153p.onrender.com/api/v1";
const GOOGLE_CLIENT_ID = "643600505402-qfbt52mg2j51v9jmnam1cso3mslpnhhi.apps.googleusercontent.com";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@omni.com");
  const [password, setPassword] = useState("AdminPassword123!");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Init theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("omni_theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check if already logged in with valid token
    const token = localStorage.getItem("omni_admin_token");
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            router.push("/");
          } else {
            localStorage.removeItem("omni_admin_token");
            localStorage.removeItem("omni_admin_user");
          }
        })
        .catch(() => {
          localStorage.removeItem("omni_admin_token");
          localStorage.removeItem("omni_admin_user");
        });
    }
  }, [router]);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("omni_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("omni_theme", "light");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // Store token and user
      localStorage.setItem("omni_admin_token", data.access_token);
      localStorage.setItem("omni_admin_user", JSON.stringify(data.user));

      router.push("/");
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Head>
        <title>Login - Omni POS & Delivery Admin Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top Bar with Theme Toggle */}
      <div className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Omni Admin Portal</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise POS & Dispatch System</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Authorized personnel only (Admin & Cashier)
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@omni.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Fill for Reviewers / Evaluators */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-xs">
            <p className="font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Demo Quick-Fill Credentials:</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@omni.com", "AdminPassword123!")}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-blue-400 text-left transition"
              >
                <p className="font-bold text-[11px] text-blue-600 dark:text-blue-400">Super Admin</p>
                <p className="text-[10px] text-slate-400 truncate">admin@omni.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("cashier@omni.com", "Cashier123!")}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-blue-400 text-left transition"
              >
                <p className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400">Cashier</p>
                <p className="text-[10px] text-slate-400 truncate">cashier@omni.com</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Omni Delivery & Enterprise POS System • Secured with JWT & PostgreSQL</p>
      </footer>
    </div>
  );
}
