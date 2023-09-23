import React, { useEffect } from 'react'
import Peer from '../../common/peer'
import './remote.css'



const Remote = () => {
    useEffect(() => {
        console.log(Peer.remoteStream)
        document.getElementById('video-player').srcObject = Peer.remoteStream;
    },[])
    return (
        <div id="videos">
                <video id="video-player" autoPlay></video>
        </div>
            
    )
}

export default Remote;