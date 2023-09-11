module.exports = {
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ["win32"],
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ["darwin"],
      config: {},
    }
  ]
};
