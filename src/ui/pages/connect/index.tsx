import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "../../../lib/peer";
import globals from "../../../lib/globals";

const Connect = () => {
    globals.peer = new Peer();
    console.log(globals.peer);

    const navigate = useNavigate();
    // const location = useLocation();
    const [targetID, setTargetID] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!targetID) return;
        globals.peer!.connect(Number(targetID)); // remember to remove null assertion
        console.log(globals.peer!.remoteStream);
        navigate("/remote");
    };

    return (
        <form id="connect-form" onSubmit={handleSubmit}>
            <input
                value={targetID}
                onChange={(e) => setTargetID(e.target.value)}
                id="connect-input"
                type="text"
            />
            <button id="connect-button" type="submit">
                Connect
            </button>
            <p id="connect-id">{globals.peer.connectionId}</p>
        </form>
    );
};

export default Connect;
