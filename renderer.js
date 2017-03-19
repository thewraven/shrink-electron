const {
    ipcRenderer
} = require('electron');
const finished_msg = "Everything done!"
let inputFolder = "";
let outputFolder = "";

let lblInputFolder = document.getElementById("lbl-sourceFolder");
let btnInputDialog = document.getElementById("btn-selectSourceFolder");
console.log(lblInputFolder, btnInputDialog);
btnInputDialog.addEventListener('click', function() {
    let result = ipcRenderer.sendSync('showDialog');
    console.log("resultado", result);
    lblInputFolder.value = result;
    inputFolder = result;
});

let lblDestFolder = document.getElementById("lbl-destFolder");
let btnDestDialog = document.getElementById("btn-selectDestFolder");
btnDestDialog.addEventListener("click", function() {
    let result = ipcRenderer.sendSync('showDialog');
    console.log(result);
    lblDestFolder.value = result;
    outputFolder = result;
})

let btnOK = document.getElementById("btn-ok");
let btnReboot = document.getElementById("btn-reboot");
btnReboot.style = "display:none"
let resultInfo = document.getElementById("txt-result");

ipcRenderer.on("output", (event, output) => {
    resultInfo.value += output;
    resultInfo.scrollTop = resultInfo.scrollHeight;
    if (output === finished_msg) {
        btnReboot.style = "display"
    }
});

document.getElementById("result-info").style = "display:none"
btnOK.addEventListener("click", function() {
    resultInfo.value = ""
    document.getElementById("config-container").style = "display:none"
    document.getElementById("result-info").style = "display"
    ipcRenderer.send("startCompression", {
        input: inputFolder,
        output: outputFolder,
        quality: document.getElementById("quality").value,
        workers: document.getElementById("workers").value,
    });
});


btnReboot.addEventListener("click", function() {
    document.getElementById("config-container").style = "display"
    document.getElementById("result-info").style = "display:none"
    btnReboot.style = "display:none"
})