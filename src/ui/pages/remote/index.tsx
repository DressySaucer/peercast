import React, { useEffect } from "react";
import globals from "../../../lib/globals";

const Remote = () => {
    useEffect(() => {
        console.log(globals.peer!.remoteStream);
        const viewscreen = document.getElementById(
            "video-player",
        ) as HTMLMediaElement;
        viewscreen.srcObject = globals.peer!.remoteStream;

        document.onkeydown = (ev: KeyboardEvent) => {
            console.log(ev.code);
            globals.peer?.keyChannel?.send(ev.code);
        };
    }, []);
    return (
        <div id="videos">
            <video id="video-player" autoPlay></video>
        </div>
    );
};

export default Remote;
