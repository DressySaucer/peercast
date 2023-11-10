import React, { useEffect } from "react";
import globals from "../../../lib/globals";

const Remote = () => {
    useEffect(() => {
        console.log(globals.peer!.remoteStream);
        let viewscreen = document.getElementById(
            "video-player",
        ) as HTMLMediaElement;
        viewscreen.srcObject = globals.peer!.remoteStream;
    }, []);
    return (
        <div id="videos">
            <video id="video-player" autoPlay></video>
        </div>
    );
};

export default Remote;
