module.exports = {
    packagerConfig: {
        asar: true,
        protocols: [
            {
                name: "Peercast",
                schemes: ["peercast"],
            },
        ],
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
        },
    ],
    plugins: [
        {
            name: "@electron-forge/plugin-auto-unpack-natives",
            config: {},
        },
    ],
};
