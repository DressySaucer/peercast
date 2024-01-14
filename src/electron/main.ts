import {
    app,
    BrowserWindow,
    desktopCapturer,
    ipcMain,
    session,
} from "electron";
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

function createWindow() {
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

    mainWindow.loadFile(path.resolve(__dirname, "..", "static", "index.html"));

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

async function start() {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) console.log("No available refresh / access token");

    createWindow();
}

function createAuthWindow() {
    authWindow = new BrowserWindow({
        width: 600,
        height: 800,
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
        const code = new URL(url).searchParams.get("code");
        if (code) await auth.exchangeToken("code", code);
        destroyAuthWindow();
        mainWindow.loadFile(
            path.resolve(__dirname, "..", "static", "index.html"),
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
    auth.registerSession(session.fromPartition("persist:peercast"));

    ipcMain.on("auth:login", async () => {
        if (!authWindow) {
            const accessToken = await auth.getAccessToken();
            if (!accessToken) createAuthWindow();
        } else authWindow.focus();
    });

    ipcMain.handle("auth:isAuthenticated", auth.isAuthenticated);

    start();
});

app.on("window-all-closed", () => app.quit());
