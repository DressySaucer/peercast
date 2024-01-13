import { app, BrowserWindow, desktopCapturer, ipcMain } from "electron";
import * as auth from "../lib/auth";
import path from "path";

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient("peercast", process.execPath, [
            path.resolve(process.argv[1]),
        ]);
    }
} else {
    app.setAsDefaultProtocolClient("peercast");
}

let mainWindow: BrowserWindow | null = null;
let authWindow: BrowserWindow | null = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "preload.js"),
        },
    });

    desktopCapturer
        .getSources({ types: ["window", "screen"] })
        .then(async (sources) => {
            sources.forEach((source) => {
                if (source.name === "Electron") {
                    mainWindow!.webContents.send("SET_SOURCE", source.id);
                }
            });
        });

    try {
        await auth.refreshTokens();
    } catch (err) {
        console.log("No available refresh token");
    }

    mainWindow.loadFile(path.resolve(__dirname, "..", "static", "index.html"));

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function createAuthWindow() {
    authWindow = new BrowserWindow({
        width: 600,
        height: 1000,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    authWindow.loadURL(auth.getAuthUrl());

    /*
    authWindow.on("authenticated", () => {
        destroyAuthWindow();
    });
    */

    authWindow.on("closed", () => {
        authWindow = null;
    });
}

function destroyAuthWindow() {
    if (!authWindow) return;
    authWindow.close();
    authWindow = null;
}

// create logout window

app.on("open-url", async (event, url) => {
    if (mainWindow && authWindow) {
        await auth.loadTokens(url);
        destroyAuthWindow();
        mainWindow.loadURL(
            "file://" + path.resolve(__dirname, "..", "static", "index.html"),
        );
        mainWindow.focus();
    }
});

/**

const createRemoteWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    desktopCapturer
        .getSources({ types: ["mainWindow", "screen"] })
        .then(async (sources) => {
            sources.forEach((source) => {
                if (source.name === "Electron") {
                    mainWindow.webContents.send("SET_SOURCE", source.id);
                }
            });
        });

    mainWindow.loadFile("./build/static/remote/index.html");
};

*/

app.whenReady().then(() => {
    ipcMain.on("auth:login", () => {
        if (!authWindow) createAuthWindow();
        else authWindow.focus();
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => app.quit());
