const {
    ipcRenderer
} = require('electron');

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
let resultInfo = document.getElementById("txt-result");

ipcRenderer.on("output", (event, output) => {
    resultInfo.value += output;
});

btnOK.addEventListener("click", function() {
    resultInfo.value = ""
    ipcRenderer.send("startCompression", {
        input: inputFolder,
        output: outputFolder,
        quality: document.getElementById("quality").value,
        workers: document.getElementById("workers").value,
    });
    // let output = ipcRenderer.sendSync("startCompression", {
    //     input: inputFolder,
    //     output: outputFolder
    // });
    // resultInfo.value = output;
});