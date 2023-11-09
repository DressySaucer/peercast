import React, { useEffect } from "react";
import Peer from "../../../lib/peer";

const Remote = () => {
    useEffect(() => {
        console.log(Peer.remoteStream);
        let viewscreen = document.getElementById(
            "video-player",
        ) as HTMLMediaElement;
        viewscreen.srcObject = Peer.remoteStream;
    }, []);
    return (
        <div id="videos">
            <video id="video-player" autoPlay></video>
        </div>
    );
};

export default Remote;
