import React, { useState } from "react";
import globals from "../../../lib/globals";

export function ConnectContainer() {
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
                <div>
                    <input
                        value={targetID}
                        onChange={(e) => setTargetID(e.target.value)}
                        id="connect-input"
                        type="text"
                        placeholder="Session Code (e.g. 1 234 567 890)"
                    />
                    <p className="input-title">Session Code</p>
                </div>
                <div>
                    <input
                        value={targetPW}
                        onChange={(e) => setTargetPW(e.target.value)}
                        id="connect-input"
                        type="text"
                        placeholder="Session Password (e.g. abcdefgh)"
                    />
                    <p className="input-title">Session Password</p>
                </div>
                <button id="connect-button" type="submit">
                    Connect
                </button>
            </form>
            <div id="divider"></div>
            <h2>ID and Password</h2>
            <p>
                Share your ID and password with a peer to grant them access to
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
}
