import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import globals from "../../../lib/globals";

const Connect = () => {
    if (!globals.peer) return;

    const navigate = useNavigate();
    // const location = useLocation();
    const [targetID, setTargetID] = useState("");
    const [targetPW, setTargetPW] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!targetID || !globals.peer) return;
        globals.peer!.connect(Number(targetID), targetPW); // remember to remove null assertion
    };

    window.addEventListener("syn-success", () => {
        navigate("/remote");
    });
    window.addEventListener("syn-failed", () => {
        console.log("Failed to connect to peer");
    });

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
        <div id="connect">
            <div id="connect-container">
                <h2>Remote Access</h2>
                <form
                    id="connect-form"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
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
                <h2>Your ID and Password</h2>
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
        </div>
    );
};

export default Connect;
