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

        const socket = this.socket;
        const peerConnection = this.peerConnection;

        socket.on("peer-connect", async () => {
            // Create stream object for receiving remote tracks
            const localStream = await navigator.mediaDevices.getDisplayMedia({
                audio: false,
                video: true,
            });

            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
            });

            // Create SDP offer and set local description
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            console.log(peerConnection);

            console.log("Offer:", offer);
            socket.emit("Offer", JSON.stringify(offer));
        });

        peerConnection.onicecandidate = (event) => {
            console.log("New ICE Candidate:", event.candidate);
            socket.emit("ICE Candidate", JSON.stringify(event.candidate));
        };

        socket.on("ICE Candidate", (candidate: string) => {
            peerConnection.addIceCandidate(JSON.parse(candidate));
        });

        socket.on("Offer", async (data: string) => {
            // Handle and assign recieved tracks to stream
            this.peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    this.remoteStream.addTrack(track);
                });
            };

            const offer = JSON.parse(data);
            await peerConnection.setRemoteDescription(offer);

            const answer = await peerConnection.createAnswer();
            console.log("Answer:", answer);
            await peerConnection.setLocalDescription(answer);
            socket.emit("Answer", JSON.stringify(answer));
        });

        socket.on("Answer", (answer: string) => {
            peerConnection.setRemoteDescription(JSON.parse(answer));
        });
    }

    async connect(targetId: number) {
        this.socket.emit("peer-connect", targetId);
    }
}

export default new Peer();
