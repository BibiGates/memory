const nImg = 8;
const BACK = "img/mem_back.jpg";
const TIME = 1000;

var timer;
var imgTab = [];
var stateTab = [];
var choixImg = null;
var foundImg = [];
var nFound = 0;
var canChoose = true;

function setTab()
{
    let i;
    for (i = 0; i < nImg; i++) {
        imgTab[i] = i + 1;
        imgTab[i + nImg] = i + 1;
        stateTab[i] = false;
        stateTab[i + nImg] = false;
    }
}

function onClick(td, img)
{
    if (!stateTab[td.id]) {
        stateTab[td.id] = true;
        img.setAttribute("src", "img/mem" + imgTab[td.id] + ".jpg");

        if (choixImg == null) {
            choixImg = img;
        } else {
            let a = choixImg.parentNode.id, b = td.id;

            if (imgTab[a] != imgTab[b]) {
                canChoose = false;
                document.getElementById(a).setAttribute("class", "not-found");
                document.getElementById(b).setAttribute("class", "not-found");
                document.getElementById("restart").disabled = true;
                setTimeout(function() {
                    choixImg.setAttribute("src", BACK);
                    img.setAttribute("src", BACK);
                    stateTab[a] = false;
                    stateTab[b] = false;
                    canChoose = true;
                    choixImg = null;
                    document.getElementById(a).setAttribute("class", "hide");
                    document.getElementById(b).setAttribute("class", "hide");
                    document.getElementById("restart").disabled = false;
                }, TIME);
            } else {
                foundImg.push(choixImg, img);
                nFound++;
                choixImg = null;
                document.getElementById(a).setAttribute("class", "found");
                document.getElementById(b).setAttribute("class", "found");
                document.getElementById("restart").disabled = false;

                if (nFound == nImg)
                    setTimeout(function() { window.alert("Gagné !"); }, TIME);
            }
        }
    } else
        console.log("Image déjà face visible.");
}

function createLine(idL, lig, col)
{
    let tr, td, img;
    tr = document.createElement("tr");
    let i;
    for (i = 0; i < col; i++) {
        td = document.createElement("td");
        td.id = idL * lig + i;
        td.setAttribute("class", "hide");

        img = document.createElement("img");
        img.setAttribute("src", BACK);

        (function(_td, _img) {
            _td.addEventListener("click", function() { if (canChoose) onClick(_td, _img); }, false);
        }(td, img));

        td.appendChild(img);
        tr.appendChild(td);
    }

    return tr;
}

function createTable(lig, col)
{
    if (lig * col <= nImg * 2) {
        let table = document.createElement("table");
        let i;
        for (i = 0; i < lig; i++)
            table.appendChild(createLine(i, lig, col));
        
        document.getElementById("memory").appendChild(table);
        scramble(imgTab);
        console.log("Table de Mémory créée.");
    } else
        console.log("La table n'a pas pu être instanciée. (pas assez d'images disponibles)");
}

function scramble(a)
{
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function restart()
{
    let i;
    for (i = 0; i < foundImg.length; i++) {
        foundImg[i].setAttribute("src", BACK);
        foundImg[i].parentNode.setAttribute("class", "hide");
    }
    for (i = 0; i < nImg; i++) {
        stateTab[i] = false;
        stateTab[i + nImg] = false;
    }
    foundImg = [];
    choixImg = null;
    nFound = 0;
    canChoose = true;
    scramble(imgTab);
}

function main()
{
    

    setTab();
    createTable(4, 4);

    let bRestart = document.createElement("button");
    bRestart.id = "restart";
    bRestart.innerHTML = "Recommencer";
    bRestart.disabled = true;
    bRestart.addEventListener("click", function() {
        restart();
        bRestart.disabled = true;
    }, false);
    document.getElementById("memory").appendChild(bRestart);
}

document.addEventListener("DOMContentLoaded", main);
