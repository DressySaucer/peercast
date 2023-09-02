const channel = new MessageChannel();

const servers = {
    iceServers:[
        {
            urls:["stun:stun1.l.google.com:19302","stun:stun2.l.google.com:19302"]
        }
    ]
};

const constraints = {
    video:{
        width:{ideal:1920, max:1920},
        height:{ideal:1080, max:1080},
    },
    audio:false
}

const init = async () => {
    const offer = await createOffer();
    const answer = await createAnswer(offer);
    peerConnectionA.setRemoteDescription(answer);
}

const createOffer = async () => {
    // Create peer connection
    peerConnectionA = new RTCPeerConnection(servers);

    // Create local media stream and assign display content (screen capture)
    let localStream = await navigator.mediaDevices.getDisplayMedia(constraints);
    // document.getElementById("user-1").srcObject = localStream;

    localStream.getTracks().forEach((track) => {
        peerConnectionA.addTrack(track, localStream);
    })

    channel.port1.onmessage = (message) => peerConnectionA.addIceCandidate(JSON.parse(message.data));

    // Set ICE candidate handler to log suggestions
    peerConnectionA.onicecandidate = async (event) => {
        console.log('New ice candidate: ', event.candidate)
        channel.port1.postMessage(JSON.stringify(event.candidate));
    }

    // Create SDP offer and set local description
    let offer = await peerConnectionA.createOffer();
    await peerConnectionA.setLocalDescription(offer);

    console.log('Offer:', offer)

    return offer;
}

const createAnswer = async (offer) => {
    // Create peer connection
    peerConnectionB = new RTCPeerConnection(servers);

    // Create stream object for receiving remote tracks
    let remoteStream = new MediaStream();
    document.getElementById("user-2").srcObject = remoteStream;
    
    // Handle and assign recieved tracks to stream
    peerConnectionB.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    channel.port2.onmessage = (message) => peerConnectionB.addIceCandidate(JSON.parse(message.data));

    peerConnectionB.onicecandidate = async (event) => {
        console.log('New ice candidate: ', event.candidate)
        channel.port2.postMessage(JSON.stringify(event.candidate));
    }

    await peerConnectionB.setRemoteDescription(offer);

    let answer = await peerConnectionB.createAnswer();
    await peerConnectionB.setLocalDescription(answer);

    console.log('Answer:', answer)

    return answer;
}

init();