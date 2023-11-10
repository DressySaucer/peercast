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

// ws://109.74.193.11:8080/

/** Abstraction of RTCPeerConnection that represents a basic peercast user **/
class Peer {
    connectionId: number;
    socket: Socket<any, any>; // remember to fix types
    peerConnection: RTCPeerConnection;
    keyChannel: RTCDataChannel;
    mouseChannel: RTCDataChannel;
    remoteStream: MediaStream;

    private async _handleConnectionRequest() {
        console.log("peer this: ", this);
        // Create stream object for receiving remote tracks
        const localStream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: true,
        });

        localStream.getTracks().forEach((track) => {
            this.peerConnection.addTrack(track, localStream);
        });

        // Create SDP offer and set local description
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
        // Handle and assign recieved tracks to stream
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

    /**
     * @constructor
     */
    constructor() {
        this.connectionId = generateId();
        this.socket = io("wss://server.peercast.co.uk/", {
            query: {
                connectionId: this.connectionId,
            },
        });
        this.peerConnection = new RTCPeerConnection(servers);
        this.keyChannel = this.peerConnection.createDataChannel("key", {
            negotiated: true,
            id: 0,
        });
        this.mouseChannel = this.peerConnection.createDataChannel("mouse", {
            negotiated: true,
            id: 1,
        });

        this.remoteStream = new MediaStream();

        this.peerConnection.onicecandidate = (ev) => this._sendICECandidate(ev);

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
    }

    async connect(targetId: number) {
        this.socket.emit("peer-connect", targetId);
    }
}

export default Peer;
