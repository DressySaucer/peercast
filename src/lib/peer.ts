import { Socket, io } from "socket.io-client";
import {
    ChromiumGetUserMedia,
    ChromiumMediaStreamConstraints,
} from "./desktop-capture";
import generateId from "./connection-id";
import "./api";

const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
};

class Peer {
    connectionId: number;

    socket: Socket; // remember to fix types

    peerConnection: RTCPeerConnection;

    keyChannel?: RTCDataChannel;

    mouseChannel?: RTCDataChannel;

    remoteStream: MediaStream;

    private async handleConnectionRequest() {
        const constraints: ChromiumMediaStreamConstraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                },
            },
        };

        console.log("peer this: ", this);
        const localStream = await (<ChromiumGetUserMedia>(
            navigator.mediaDevices.getUserMedia
        ))(constraints);

        localStream.getTracks().forEach((track) => {
            /** contentHint parameter can raise low fps cap on some codecs used by WebRTC */
            track.contentHint = "motion";
            this.peerConnection.addTrack(track, localStream);
        });

        /* Data channel creation is signalled inline through datachannel event */
        this.keyChannel = this.peerConnection.createDataChannel("key");
        this.keyChannel.onmessage = (ev) => {
            console.log(ev);
            const data = JSON.parse(ev.data);
            const isMouseClick = data[0];
            const isDown = data[1];
            console.log("Message: ", data);
            if (!isMouseClick) {
                if (!isDown) window.vinput.keyUp(data[2]);
                else window.vinput.keyDown(data[2]);
            } else {
                if (!isDown) window.vinput.mouseUp(data[2], data[3]);
                else window.vinput.mouseDown(data[2], data[3]);
            }
        };
        this.mouseChannel = this.peerConnection.createDataChannel("mouse");
        this.mouseChannel.onmessage = (ev) => {
            console.log(ev);
            const data = JSON.parse(ev.data);
            const isScroll = data[0];
            if (!isScroll) {
                window.vinput.mouseMove(data[1], data[2]);
            } else {
                window.vinput.scroll(data[1], data[2]);
            }
        };

        console.log(RTCRtpReceiver.getCapabilities("video"));
        const codecs: RTCRtpCodecCapability[] = [];
        RTCRtpReceiver.getCapabilities("video")?.codecs.forEach((codec) => {
            if (codec.mimeType == "video/VP8") codecs.push(codec);
            console.log("Codecs: ", codecs);
            this.peerConnection.getTransceivers().forEach((transceiver) => {
                console.log(transceiver);
                transceiver.setCodecPreferences(codecs);
            });
        });

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        console.log(this.peerConnection);

        console.log("Offer:", offer);
        this.socket.emit("Offer", JSON.stringify(offer));
    }

    private sendICECandidate(ev: RTCPeerConnectionIceEvent) {
        console.log("New ICE Candidate:", ev.candidate);
        this.socket.emit("ICE Candidate", JSON.stringify(ev.candidate));
    }

    private handleICECandidate(data: string) {
        const candidate = JSON.parse(data);
        this.peerConnection.addIceCandidate(candidate);
    }

    private handleIncomingAnswer(data: string) {
        const answer = JSON.parse(data);
        this.peerConnection.setRemoteDescription(answer);
    }

    private async handleIncomingOffer(data: string) {
        this.peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                this.remoteStream.addTrack(track);
            });
        };

        const offer = JSON.parse(data);
        await this.peerConnection.setRemoteDescription(offer);

        const answer = await this.peerConnection.createAnswer();
        console.log("Answer:", answer);
        await this.peerConnection.setLocalDescription(answer);
        this.socket.emit("Answer", JSON.stringify(answer));
    }

    constructor() {
        this.connectionId = generateId();

        /** Open socket.io socket to signalling server */
        this.socket = io("wss://server.peercast.co.uk/", {
            query: {
                connectionId: this.connectionId,
            },
        });

        /** Initialise RTCPeerConnection */
        this.peerConnection = new RTCPeerConnection(servers);

        /** RTCPeerConnection event handlers */
        this.peerConnection.onicecandidate = (ev: RTCPeerConnectionIceEvent) =>
            this.sendICECandidate(ev);
        this.peerConnection.ondatachannel = (ev: RTCDataChannelEvent) => {
            console.log("Data channel event: ", ev);
            if (ev.channel.label === "key") {
                this.keyChannel = ev.channel;
            }
            if (ev.channel.label === "mouse") this.mouseChannel = ev.channel;
        };

        /** Assigning handlers for socket.io signalling events */
        this.socket.on("peer-connect", () => this.handleConnectionRequest());
        this.socket.on("Offer", (data: string) =>
            this.handleIncomingOffer(data),
        );
        this.socket.on("Answer", (data: string) =>
            this.handleIncomingAnswer(data),
        );
        this.socket.on("ICE Candidate", (data: string) =>
            this.handleICECandidate(data),
        );

        this.remoteStream = new MediaStream();
    }

    async connect(targetId: number) {
        this.socket.emit("peer-connect", targetId);
    }
}

export default Peer;
