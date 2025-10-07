import { app, BrowserWindow, ipcMain } from "electron";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import Store from "electron-store";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();
const overlayApp = express();
const server = http.createServer(overlayApp);
const io = new Server(server);

let mainWindow;
let currentData = store.get("character") || {};

// Caminho da pasta overlay — funciona tanto em dev quanto no .exe
const overlayPath = app.isPackaged
  ? path.join(process.resourcesPath, "overlay") // quando buildado
  : path.join(__dirname, "overlay");            // quando rodando com npm start

overlayApp.use("/overlay", express.static(overlayPath));

io.on("connection", (socket) => {
  console.log("Overlay conectado");
  socket.emit("statusUpdate", currentData);
});

server.listen(3001, () =>
  console.log("Servidor Socket.io rodando em http://localhost:3001/overlay")
);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("renderer/index.html");
}

app.whenReady().then(createWindow);

ipcMain.on("save-data", (event, data) => {
  currentData = data;
  store.set("character", data);
  io.emit("statusUpdate", data);
});

ipcMain.handle("load-data", () => {
  return currentData;
});
