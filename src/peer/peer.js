const io = require('socket.io-client');

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}

const constraints = {
    audio: false,
    video: {
        mandatory: {
            chromeMediaSource: 'desktop'
        }
    }
}


class Peer {
    constructor() {
        this.socket = io('ws://109.74.193.11:8080/');
        this.peerConnection = new RTCPeerConnection(servers);

        const socket = this.socket;
        const peerConnection = this.peerConnection;

        socket.on('peer-connect', async () => {
            // Create stream object for receiving remote tracks
            let localStream = await navigator.mediaDevices.getUserMedia(constraints);

            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
            })

            // Create SDP offer and set local description
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            console.log(peerConnection)

            console.log('Offer:', offer)
            socket.emit('Offer', JSON.stringify(offer))
        })

        peerConnection.onicecandidate = (event) => {
            console.log('New ICE Candidate:', event.candidate);
            socket.emit('ICE Candidate', JSON.stringify(event.candidate))
        }

        socket.on('ICE Candidate', (candidate) => { peerConnection.addIceCandidate(JSON.parse(candidate)) })
        
        socket.on('Offer', async (data) => {
            const remoteStream = new MediaStream();
            document.getElementById('video-player').srcObject = remoteStream;

            // Handle and assign recieved tracks to stream
            this.peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track)
                })
            }

            const offer = JSON.parse(data)
            await peerConnection.setRemoteDescription(offer);
            
            const answer = await peerConnection.createAnswer();
            console.log('Answer:', answer)
            await peerConnection.setLocalDescription(answer);
            socket.emit('Answer', JSON.stringify(answer))
        })

        socket.on('Answer', (answer) => peerConnection.setRemoteDescription(JSON.parse(answer)))
    }

    async connect() {
        this.socket.emit('peer-connect');
    }
    
}

module.exports = Peer;
