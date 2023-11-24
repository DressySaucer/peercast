// @ts-nocheck
import { ipcRenderer } from "electron";
import {
    ChromiumGetUserMedia,
    ChromiumMediaStreamConstraints,
} from "../lib/desktop-capture";
import { execFile } from "child_process";

window.MyApi = {
    vinput: (key: string) => {
        console.log(key);
        execFile("./vinput", [key], {}, (err, stdout) => console.log(stdout));
    },
};

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
    const constraints: ChromiumMediaStreamConstraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: sourceId,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720,
            },
        },
    };

    try {
        const getUserMedia = navigator.mediaDevices
            .getUserMedia as ChromiumGetUserMedia;
        const stream = await getUserMedia(constraints);
        handleStream(stream);
    } catch (e) {
        handleError(e);
    }
});
function handleStream(stream: MediaStream) {
    const video = document.querySelector("video");
    if (!(video instanceof HTMLElement)) return;
    video.srcObject = stream;
    video.onloadedmetadata = () => video.play();
}

function handleError(e: unknown) {
    console.log(e);
}
