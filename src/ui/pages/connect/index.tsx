import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "../../../lib/peer";

const Connect = () => {
    console.log(Peer.connectionId);
    const navigate = useNavigate();
    // const location = useLocation();
    const [targetID, setTargetID] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        Peer.connect(Number(targetID));
        console.log(Peer.remoteStream);
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
            <p id="connect-id">{Peer.connectionId}</p>
        </form>
    );
};

export default Connect;
