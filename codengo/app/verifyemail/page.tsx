'use client'
import axios from "axios";
import React, { use } from "react";
import { useEffect } from "react";

function VerifyEmailPage() {
    const [token, setToken] = React.useState("");
    const[verified, setVerified] = React.useState(false);
    const [error, setError] = React.useState(false);

    const verifyUserEmail = async () => {
        try {
            await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
            setError(false);
        } catch (error) {
            console.error("Error verifying email:", error);
            setError(true);
        }
    };
    useEffect(() => {
        setError(false);
        const urlToken = window.location.search.split("=")[1];
        
            setToken(urlToken || "");
        
    }, []);

    useEffect(() => {
        setError(false);
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div>
            <h1>Verify Email</h1>
            {verified && <p>Email verified successfully!</p>}
            {error && <p>Error verifying email. Please try again.</p>}
            {!verified && !error && <p>Verifying...</p>}
        </div>
    );
}

export default VerifyEmailPage;
