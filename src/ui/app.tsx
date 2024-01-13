import React from "react";
// import Login from "./pages/login";
import Connect from "./pages/connect";
import Remote from "./pages/remote";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Peer from "../lib/peer";
import globals from "../lib/globals";

function App() {
    globals.peer = new Peer();
    console.log(globals.peer);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Connect />} />
                <Route path="/remote" element={<Remote />} />
            </Routes>
        </Router>
    );
}

// <Route exact path='/' element={<Login />} />

export default App;
