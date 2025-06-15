"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signuppage() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      await axios.post("/api/users/signup", user);
      toast.success("Signup successful!");
      router.push("/login");
    } catch (error) {
      toast.error("Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isFilled = user.username && user.email && user.password;
    setButtonDisabled(!isFilled);
  }, [user]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-xl md:w-[600px] p-10 rounded-2xl bg-white/5 border border-white/20 shadow-2xl text-white backdrop-blur-lg">
        <h1 className="text-4xl font-bold text-center mb-4">
          {loading ? "Creating Account..." : "Sign Up"}
        </h1>
        <p className="text-center text-white/60 mb-8">
          Join the community of collaborative coders 🚀
        </p>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white py-2 transition-all"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white py-2 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full bg-transparent border-b border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white py-2 transition-all"
          />

          <button
            onClick={onSignup}
            disabled={buttonDisabled}
            className={`w-full py-3 mt-6 rounded-full text-md font-medium transition duration-300 ${
              buttonDisabled
                ? "bg-white/20 text-white/50 cursor-not-allowed"
                : "bg-white text-black hover:scale-105"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        <p className="text-sm text-center mt-8 text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-white">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
