import React, { useState, useEffect } from "react";

declare global {
    interface Window {
        auth: {
            login: () => void;
            isAuthenticated: () => Promise<boolean>;
        };
    }
}

export function Header() {
    const [isAuthenticated, setAuth] = useState(false);

    useEffect(() => {
        //window.auth.isAuthenticated().then((truth) => setAuth(truth));
        setAuth(false);
    }, []);

    /*
    const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } =
        useAuth0();

    useEffect(() => {
        console.log(getAccessTokenSilently());
    }, []);
        */

    if (isAuthenticated)
        return (
            <div id="header">
                <div id="account-container">
                    <button id="sign-up">logged in. hooray!</button>
                </div>
            </div>
        );

    return (
        <div id="header">
            <div id="left"></div>
            <div id="center"></div>
            <div id="right">
                <div id="auth-container">
                    <button className="auth-button" id="sign-up">
                        Sign Up
                    </button>
                    <button
                        className="auth-button"
                        id="login"
                        onClick={() => window.auth.login()}
                    >
                        Log In
                    </button>
                    <button id="account-button">
                        <div></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
