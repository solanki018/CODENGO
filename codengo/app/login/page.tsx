'use client'
import React, { use } from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";

function LoginPage() {
    const router = useRouter();
    const [user , setUser] = React.useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const onLogin = async() => {
        try {
            setLoading(true);
            // setButtonDisabled(true);
            const response = await axios.post("/api/users/login", user);
            console.log("login success");
            router.push("/dashboard");
        } catch (error) {
            console.log("login failed");
            toast.error("Error logging in");
        } 
    };

    useEffect(() => {
       if(user.email.length > 0 && user.password.length > 0){
        setButtonDisabled(false);
       } else {
           setButtonDisabled(true);
       }
    }, [user]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1>{loading ? "Loading..." : "Login"}</h1>

        <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="border border-gray-300 p-2 mb-4"
        />
        <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="border border-gray-300 p-2 mb-4"
        />
        <button onClick={onLogin} disabled={buttonDisabled} className="bg-blue-500 text-white p-2 rounded">
            Login
        </button>
         <Link href="/login" className="text-blue-500 mt-4 block">
        Already have an account? Login
      </Link>
    </div>
  );
}

export default LoginPage;