import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import globals from "../../../lib/globals";
// import { useAuth0 } from "@auth0/auth0-react";

declare global {
    interface Window {
        auth: {
            login: () => void;
            isAuthenticated: () => Promise<boolean>;
        };
    }
}

const Header = () => {
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
            <div id="center">
                <div id="banner"></div>
            </div>
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
};

const ConnectContainer = () => {
    if (!globals.peer) return;

    const [targetID, setTargetID] = useState("");
    const [targetPW, setTargetPW] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!targetID || !globals.peer) return;
        globals.peer!.connect(Number(targetID), targetPW); // remember to remove null assertion
    };

    function formatID(id: number) {
        const str = String(id);
        let formatted = "";
        for (let i = 1; i < str.length; i += 3) {
            const start = Math.max(0, i - 3);
            formatted += str.slice(start, i) + " ";
        }
        return (formatted += str.slice(7));
    }
    return (
        <div id="connect-container">
            <h2>Remote Access</h2>
            <p>
                Enter session code and password in order to open a connection
                and gain access to your peer's computer
            </p>
            <form id="connect-form" autoComplete="off" onSubmit={handleSubmit}>
                <input
                    value={targetID}
                    onChange={(e) => setTargetID(e.target.value)}
                    id="connect-input"
                    type="text"
                    placeholder="Session Code (e.g. 1 234 567 890)"
                />
                <input
                    value={targetPW}
                    onChange={(e) => setTargetPW(e.target.value)}
                    id="connect-input"
                    type="text"
                    placeholder="Session Password (e.g. abcdefgh)"
                />
                <button id="connect-button" type="submit">
                    Connect
                </button>
            </form>
            <div id="divider"></div>
            <h2>ID and Password</h2>
            <p>
                Share your id and password with a peer to grant them access to
                your machine and start receiving support
            </p>
            <div id="id-box">
                <div id="connect-id">
                    <h2>Your ID</h2>
                    <p>{formatID(globals.peer.connectionId)}</p>
                </div>
                <div id="connect-pw">
                    <h2>Your password</h2>
                    <p>{globals.peer.connectionPassword}</p>
                </div>
            </div>
        </div>
    );
};

const Connect = () => {
    const navigate = useNavigate();
    window.addEventListener("syn-success", () => {
        navigate("/remote");
    });
    window.addEventListener("syn-failed", () => {
        console.log("Failed to connect to peer");
    });

    return (
        <div id="connect">
            <Header />
            <ConnectContainer />
        </div>
    );
};

export default Connect;
