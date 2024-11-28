const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  doSomething: () => console.log("This is a function exposed to React"),
});
