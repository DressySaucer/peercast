import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './connect.css';
import Peer from '../../common/peer'

const Connect = () => {
    console.log(Peer.connectionId)
    const navigate = useNavigate();
    const location = useLocation();
    const [targetID, setTargetID] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        Peer.connect(targetID)
        console.log(Peer.remoteStream)
        navigate('/remote');
    }

    return (
        <form id="connect-form" onSubmit={handleSubmit}>
            <input value={targetID} onChange={(e) => setTargetID(e.target.value)} id="connect-input" type="text"/>
            <button id="connect-button" type="submit">Connect</button>
            <p id="connect-id">{Peer.connectionId}</p>
        </form>
    );
};

export default Connect;