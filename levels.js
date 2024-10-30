let currentWordNum = 1, currentLineNum = 1;
const currentWord = document.getElementById(`word${currentWordNum}`);
currentWord.classList.remove("off");
currentWord.disabled = false;
currentWord.focus();

const board = document.querySelector(".board");

let startNode = null;
board.addEventListener('click', (event) => {
    const endNode = event.target.closest(".node");
    if (!startNode) {
        const firstWord = document.getElementById("word1");
        firstWord.value = endNode.id;
        endNode.classList.add("used");
        endNode.classList.add("last-item");
        startNode = endNode;
        return;
    }
    if (!isLegalChar(startNode, endNode)) {
        return;
    }
    drawLine(startNode, endNode);
    startNode.classList.remove("last-item");
    endNode.classList.add("last-item");
    endNode.classList.add("used");
    const currentWord = document.getElementById(`word${currentWordNum}`);
    currentWord.value += endNode.id;
    startNode = endNode;

    checkWin();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (!isLegalWord()) return;
        
        const currentWord = document.getElementById(`word${currentWordNum}`);
        currentWord.classList.add("off");
        currentWord.disabled = true;
        const oldLastValue = currentWord.value[currentWord.value.length - 1];
        currentWordNum++;
        const newCurrentWord = document.getElementById(`word${currentWordNum}`);
        newCurrentWord.classList.remove("off");
        newCurrentWord.disabled = false;
        newCurrentWord.focus();
        newCurrentWord.value = oldLastValue;
    }
    if (event.key === "Backspace") {
        let currentLineNumCopy = currentLineNum;
        let lastLine = document.getElementById(`line${currentLineNumCopy--}`);
        while (!lastLine && currentLineNumCopy > 0) {
            lastLine = document.getElementById(`line${currentLineNumCopy--}`);
        }
        lastLine.parentNode.removeChild(lastLine);
    }
});

const historyContainer = document.querySelector(".history");
historyContainer.addEventListener("input", () => {
    let currentWord = document.getElementById(`word${currentWordNum}`).value;
    const wordLength = currentWord.length;
    if (wordLength < 2) {
        const node2 = document.getElementById(`${currentWord[wordLength - 1]}`);
        if (!node2) {
            const wordToAdjust = document.getElementById(`word${currentWordNum}`);
            wordToAdjust.value = currentWord.substring(0, wordLength - 1);
            return;
        }
        node2.classList.add("last-item");
        node2.classList.add("used");
        return;
    }
    const node1 = document.getElementById(`${currentWord[wordLength - 2]}`);
    const node2 = document.getElementById(`${currentWord[wordLength - 1]}`);
    if (!isLegalChar(node1, node2)) {
        const wordToAdjust = document.getElementById(`word${currentWordNum}`);
        wordToAdjust.value = currentWord.substring(0, wordLength - 1);
        return;
    }
    node1.classList.remove("last-item");
    node2.classList.add("last-item");
    node2.classList.add("used");
    drawLine(node1, node2);

    checkWin();
});

function isLegalChar(startNode, endNode) {
    return startNode && endNode && startNode.dataset.links.includes(endNode.id);
}

function drawLine(startNode, endNode) {
    const startBox = startNode.getBoundingClientRect();
    const endBox = endNode.getBoundingClientRect();
    
    const x1 = startBox.left + startBox.width / 2;
    const y1 = startBox.top + startBox.height / 2;
    const x2 = endBox.left + endBox.width / 2;
    const y2 = endBox.top + endBox.height / 2;
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    const newLine = document.createElement("div");
    newLine.id = `line${currentLineNum}`;
    newLine.classList.add("line");
    
    newLine.style.width = length + "px";
    newLine.style.transform = `rotate(${angle}deg)`;
    newLine.style.left = `${x1}px`;
    newLine.style.top = `${y1}px`;
    currentLineNum++;
    
    document.body.appendChild(newLine);
}

function isLegalWord() {
    const currentWord = document.getElementById(`word${currentWordNum}`).value;
    const dictionary = " adhe ebfgc bfgbcd "; // temporary value!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return currentWord.length > 1 && dictionary.includes(" " + currentWord + " ");
}

function checkWin() {
    if (!isLegalWord()) return;
    
    const allUsedNodes = document.querySelectorAll(".used");
    const allNodes = document.querySelectorAll(".node");
    if (allUsedNodes.length !== allNodes.length) return;
    
    const currentLevel = parseInt(localStorage.getItem("current_level"));
    const nextLevel = parseInt(Math.min(currentLevel, document.body.dataset.level) + 1);
    const score = currentWordNum / 2;
    localStorage.setItem("current_level", nextLevel);
    localStorage.setItem("level_1_score", score);
    window.location.href = "index.html";
}

const fs = require("fs");

function checkWordInDictionary(word) {
    return new Promise((resolve, reject) => {
        fs.readFile("dictionary.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                const dictionary = data.split("\n");
                return dictionary.includes(word);
            }
        })
    })
}