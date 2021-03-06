const electron = require('electron')
const { dialog, ipcMain, app, BrowserWindow } = require('electron')
const { spawn } = require("child_process")
const finished_msg = "All done!"
const path = require('path')
const url = require('url')
const os = require('os').platform();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
ipcMain.on('showDialog', function(event, data) {
    electron.dialog.showOpenDialog({
        title: "Select the directory",
        createDirectory: false,
        properties: ["openDirectory"],
        buttonLabel: "Select"
    }, function(folderPath) {
        event.returnValue = folderPath;
    });
});

//ipcMain executes the shrink binary for compressing the image
//it must be called the async way
ipcMain.on('startCompression', function(event, parameters) {
    let { input, output, quality, workers } = parameters;
    console.log("in", input, "out", output, "workers",
        workers, "quality", quality);
    let execPath = "";
    switch (os) {
      case "linux":
        execPath = "./assets/shrink_linux";
        break;
      case "win32":
        execPath = "assets\\shrink"
        break;
    }
    console.log(execPath);
    let shrink = spawn(execPath, ["-dir", input, "-output", output, "-quality", quality, "-workers", workers, "-hierarchy"]);
    shrink.stdout.on("data", (output_info) => {
        event.sender.send("output", output_info)
    });
    shrink.stderr.on("data", (output_info) => {
        event.sender.send("output", output_info)
    });
    shrink.on("close", (output_info) => {
        event.sender.send("output", finished_msg)
    });
});

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 600, height: 575 });
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})
