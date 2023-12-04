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
            globals.peer?.keyChannel?.send("0" + ev.code + "1");
        };

        document.onkeyup = (ev: KeyboardEvent) => {
            console.log(ev.code);
            globals.peer?.keyChannel?.send("0" + ev.code + "0");
        };

        document.onmousemove = (ev: MouseEvent) => {
            console.log("(", ev.clientX, ", ", ev.clientY, ")");
            globals.peer?.mouseChannel?.send(
                JSON.stringify({ x: ev.clientX, y: ev.clientY }),
            );
        };

        document.onmousedown = (ev: MouseEvent) => {
            console.log("(", ev.clientX, ", ", ev.clientY, ")");
            globals.peer?.keyChannel?.send(
                "1" + JSON.stringify({ x: ev.clientX, y: ev.clientY }) + "1",
            );
        };

        document.onmouseup = (ev: MouseEvent) => {
            console.log("(", ev.clientX, ", ", ev.clientY, ")");
            globals.peer?.keyChannel?.send(
                "1" + JSON.stringify({ x: ev.clientX, y: ev.clientY }) + "0",
            );
        };
    }, []);
    return (
        <div id="videos">
            <video id="video-player" autoPlay></video>
        </div>
    );
};

export default Remote;
