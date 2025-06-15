"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa";

export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="min-h-screen w-full font-sans bg-white dark:bg-black text-black dark:text-white">
      {/* HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center px-4 text-center relative">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">Welcome to CodeNgo 🚀</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl">
          Your collaborative coding platform. Code smarter, together.
        </p>

        {/* Button to navigate to login route */}
        <Link
          href="/login"
          className="mt-10 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300"
        >
          Get Started
        </Link>

        {/* Scroll down button */}
        <a href="#info" className="absolute bottom-8 animate-bounce text-gray-500 dark:text-gray-400">
          <FaArrowDown size={24} />
        </a>
      </section>

      {/* INFO SECTION (styled like next page) */}
      <section
        id="info"
        className="min-h-screen w-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Why CodeNgo?</h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            CodeNgo is a powerful collaborative coding platform designed for developers who want to work together
            efficiently. Share code in real-time, run snippets, and build projects with your team—whether you're sitting
            together or across the globe.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} CodeNgo. All rights reserved.
      </footer>
    </div>
  );
}
