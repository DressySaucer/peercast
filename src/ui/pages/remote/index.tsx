import React, { useEffect } from "react";
import globals from "../../../lib/globals";

const Remote = () => {
    useEffect(() => {
        console.log(globals.peer!.remoteStream);
        const viewscreen = document.getElementById(
            "video-player",
        ) as HTMLMediaElement;
        viewscreen.srcObject = globals.peer!.remoteStream;

        /**
        setInterval(() => {
            console.log(
                "Content hint: ",
                globals.peer!.remoteStream.getVideoTracks()[0].contentHint,
            );

            globals.peer!.peerConnection.getStats().then((stats) => {
                stats.forEach((stat) => console.log(stat));
            });
        }, 1000);
        */

        document.onkeydown = (ev: KeyboardEvent) => {
            console.log(ev.code);
            globals.peer?.keyChannel?.send(JSON.stringify([0, 1, ev.code]));
        };

        document.onkeyup = (ev: KeyboardEvent) => {
            console.log(ev.code);
            globals.peer?.keyChannel?.send(JSON.stringify([0, 0, ev.code]));
        };

        document.onmousedown = (ev: MouseEvent) => {
            console.log("(", ev.clientX, ", ", ev.clientY, ")");
            globals.peer?.keyChannel?.send(
                JSON.stringify([1, 1, ev.clientX, ev.clientY]),
            );
        };

        document.onmouseup = (ev: MouseEvent) => {
            console.log("(", ev.clientX, ", ", ev.clientY, ")");
            globals.peer?.keyChannel?.send(
                JSON.stringify([1, 0, ev.clientX, ev.clientY]),
            );
        };

        document.onmousemove = (ev: MouseEvent) => {
            console.log("(", ev.clientX, ", ", ev.clientY, ")");
            globals.peer?.mouseChannel?.send(
                JSON.stringify([0, ev.clientX, ev.clientY]),
            );
        };

        document.onwheel = (ev: WheelEvent) => {
            /** assumes ev.deltaMode === 0 */
            globals.peer?.mouseChannel?.send(
                /** i know it's the wrong way round */
                JSON.stringify([1, ev.deltaY, ev.deltaX]),
            );
        };
    }, []);
    return <video id="video-player" autoPlay></video>;
};

export default Remote;
