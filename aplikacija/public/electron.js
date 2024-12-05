const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 890,
    resizable: false,
    icon: path.join(__dirname, "..", "icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      //preload: path.join(__dirname, "preload.js"), // optional, for communication between React and Electron
    },
  });
  mainWindow.setMenuBarVisibility(false);
  //mainWindow.loadURL("http://localhost:3000"); // React development server
 mainWindow.loadFile(path.join(__dirname, "..", "build", "index.html"));
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

// app.on("activate", () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });
