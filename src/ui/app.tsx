import React from "react";
// import Login from "./pages/login";
import Connect from "./pages/connect";
import Remote from "./pages/remote";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Peer from "../lib/peer";
import globals from "../lib/globals";

function App() {
    globals.peer = new Peer();
    console.log(globals.peer);

    return (
        <GoogleOAuthProvider clientId="153453342514-dpdp2bnenfvthtch1uj7cgs5erb462si.apps.googleusercontent.com">
            <Router>
                <Routes>
                    <Route path="/" element={<Connect />} />
                    <Route path="/remote" element={<Remote />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

// <Route exact path='/' element={<Login />} />

export default App;
