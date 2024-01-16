module.exports = {
    packagerConfig: {
        asar: true,
        osxSign: {},
        protocols: [
            {
                name: "Peercast",
                schemes: ["peercast"],
            },
        ],
        icon: "./static/icons/icon",
    },
    rebuildConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin"],
        },
        {
            name: "@electron-forge/maker-dmg",
            platforms: ["darwin"],
            config: {
                icon: "./static/icons/icon.icns",
            },
        },
    ],
    plugins: [
        {
            name: "@electron-forge/plugin-auto-unpack-natives",
            config: {},
        },
    ],
};
