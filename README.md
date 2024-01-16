# peercast

**peercast** is a WebRTC-based screen sharing and remote desktop application for MacOS and Windows

## Installing

Download the latest version from releases.
After moving Peercast to the Applications folder, run `xattr -r -d com.apple.quarantine Peercast.app` in the terminal before opening as otherwise macos will complain about damage to the application

I could fix this by code signing and notarising Peercast, but apple demand a hefty sum so I'm holding off for now
