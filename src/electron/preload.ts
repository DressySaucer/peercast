import { ipcRenderer, contextBridge } from "electron";
import {
    ChromiumGetUserMedia,
    ChromiumMediaStreamConstraints,
} from "../lib/desktop-capture";
import vinput from "../bin/vinput.node";
import { VInputAPI } from "../lib/api";

const vinputAPI: VInputAPI = {
    keyUp: vinput.keyUp,
    keyDown: vinput.keyDown,
    keyPress: vinput.keyPress,
    mouseMove: vinput.mouseMove,
    mouseUp: vinput.mouseClick,
    mouseDown: vinput.mouseDown,
    mouseClick: vinput.mouseClick,
    scroll: vinput.scroll,
};

contextBridge.exposeInMainWorld("vinput", vinputAPI);

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
    const constraints: ChromiumMediaStreamConstraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: sourceId,
                minWidth: 1440,
                maxWidth: 1440,
                minHeight: 779,
                maxHeight: 779,
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
