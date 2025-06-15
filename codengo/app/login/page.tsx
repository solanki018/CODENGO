"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success:", response.data);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isValid = user.email.trim().length > 0 && user.password.trim().length > 0;
    setButtonDisabled(!isValid);
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white px-4">
      <div className="w-full max-w-md space-y-6 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center">
          {loading ? "Logging in..." : "Login to CodeNgo"}
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onLogin}
            disabled={buttonDisabled}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              buttonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Login
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
