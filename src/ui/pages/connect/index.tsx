import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/navbar";
import { Header } from "../../components/header";
import { ConnectContainer } from "../../components/connect-container";

function Connect() {
    const navigate = useNavigate();
    window.addEventListener("syn-success", () => {
        navigate("/remote");
    });
    window.addEventListener("syn-failed", () => {
        console.log("Failed to connect to peer");
    });

    return (
        <>
            <Navbar />
            <div id="main-window">
                <Header />
                <div id="wip-banner">
                    <div>
                        <p>Work in progress (v0.3.2-alpha)</p>
                        <a>Check status</a>
                    </div>
                </div>
                <div id="connect">
                    <ConnectContainer />
                </div>
            </div>
        </>
    );
}

export default Connect;
