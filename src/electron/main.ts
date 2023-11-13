import { app, BrowserWindow, desktopCapturer } from "electron";
import path from "path";

const createWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    desktopCapturer
        .getSources({ types: ["window", "screen"] })
        .then(async (sources) => {
            sources.forEach((source) => {
                if (source.name === "Electron") {
                    window.webContents.send("SET_SOURCE", source.id);
                }
            });
        });

    window.loadFile(path.join(__dirname, "index.html"));
};

/**

const createRemoteWindow = () => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    desktopCapturer
        .getSources({ types: ["window", "screen"] })
        .then(async (sources) => {
            sources.forEach((source) => {
                if (source.name === "Electron") {
                    window.webContents.send("SET_SOURCE", source.id);
                }
            });
        });

    window.loadFile("./build/static/remote/index.html");
};

*/

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
