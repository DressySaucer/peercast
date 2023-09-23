const Peer = require('./peer')

const localPeer = new Peer();

const connectButton = document.getElementById('connect-button')
connectButton.addEventListener("click", () => {localPeer.connect()})
