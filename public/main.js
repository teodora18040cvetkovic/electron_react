const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // recommended for security
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load React app in Electron
  mainWindow.loadURL("http://localhost:3000");

  // Open DevTools if in development mode
  mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
