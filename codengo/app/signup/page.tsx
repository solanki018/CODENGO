'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Signuppage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      await axios.post("/api/users/signup", user);
      toast.success("Signup successful");
      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Error signing up");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isFilled = user.name && user.email && user.password;
    setButtonDisabled(!isFilled);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4">
      <div className="max-w-md w-full space-y-8 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{loading ? "Creating Account..." : "Sign Up to CodeNgo"}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join the community of collaborative coders 🚀</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={onSignup}
          disabled={buttonDisabled}
          className={`w-full py-2 text-white rounded-md font-semibold transition-colors ${
            buttonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signuppage;
