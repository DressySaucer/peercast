import { Socket, io } from "socket.io-client";
import generateId from "./connection-id";

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
    socket: Socket<any, any>; // remember to fix types
    peerConnection: RTCPeerConnection;
    keyChannel: RTCDataChannel;
    mouseChannel: RTCDataChannel;
    remoteStream: MediaStream;

    private async _handleConnectionRequest() {
        console.log("peer this: ", this);
        const localStream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: true,
        });

        localStream.getTracks().forEach((track) => {
            this.peerConnection.addTrack(track, localStream);
        });

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        console.log(this.peerConnection);

        console.log("Offer:", offer);
        this.socket.emit("Offer", JSON.stringify(offer));
    }

    private _sendICECandidate(ev: RTCPeerConnectionIceEvent) {
        console.log("New ICE Candidate:", ev.candidate);
        this.socket.emit("ICE Candidate", JSON.stringify(ev.candidate));
    }

    private _handleICECandidate(data: string) {
        const candidate = JSON.parse(data);
        this.peerConnection.addIceCandidate(candidate);
    }

    private _handleIncomingAnswer(data: string) {
        const answer = JSON.parse(data);
        this.peerConnection.setRemoteDescription(answer);
    }

    async _handleIncomingOffer(data: string) {
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
        this.keyChannel = this.peerConnection.createDataChannel("key", {
            negotiated: true,
            id: 0,
        });
        this.mouseChannel = this.peerConnection.createDataChannel("mouse", {
            negotiated: true,
            id: 1,
        });

        /** RTCPeerConnection event handlers */
        this.peerConnection.onicecandidate = (ev) => this._sendICECandidate(ev);

        /** Assigning handlers for socket.io signalling events */
        this.socket.on("peer-connect", () => this._handleConnectionRequest());
        this.socket.on("Offer", (data: string) =>
            this._handleIncomingOffer(data),
        );
        this.socket.on("Answer", (data: string) =>
            this._handleIncomingAnswer(data),
        );
        this.socket.on("ICE Candidate", (data: string) =>
            this._handleICECandidate(data),
        );

        this.remoteStream = new MediaStream();
    }

    async connect(targetId: number) {
        this.socket.emit("peer-connect", targetId);
    }
}

export default Peer;
