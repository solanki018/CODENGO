"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await axios.post("/api/users/login", user);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isValid = user.email.trim() && user.password.trim();
    setButtonDisabled(!isValid);
  }, [user]);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl md:w-[600px] p-10 rounded-2xl backdrop-blur-md bg-white/5 border border-white/20 shadow-2xl text-white">
        <h1 className="text-4xl font-semibold text-center mb-10">
          {loading ? "Logging in..." : "Log in"}
        </h1>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email ID"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white py-2"
          />

          <button
            onClick={onLogin}
            disabled={buttonDisabled}
            className={`w-full py-3 mt-6 rounded-full text-md font-medium transition duration-300 ${
              buttonDisabled
                ? "bg-white/20 text-white/50 cursor-not-allowed"
                : "bg-white text-black hover:scale-105"
            }`}
          >
            Login
          </button>
        </div>

        <p className="text-sm text-center mt-8 text-white/50">
          Don’t have an account?{" "}
          <Link href="/signup" className="underline hover:text-white">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
