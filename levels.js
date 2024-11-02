// const elements = document.querySelectorAll("*:contains('" + targetText + "')");

let startLetter = "", currentLineNum = 0, currentWordNum = 1, currentWord = document.getElementById("word1");
currentWord.disabled = false;
currentWord.focus();

async function setUpDictionary() {
    try {
        const response = await fetch("../dictionary.txt");
        const data = await response.text();
        dictionary = data.split('\n');
        return dictionary;
    } catch (error) {
        console.error("Error fetching dictionary:", error);
    }
}
(async () => {
    const dictionary = await setUpDictionary();
})();

// for typed letters in input
const inputFields = document.querySelectorAll("input");
inputFields.forEach(inputField => {
    inputField.addEventListener('keydown', (event) => {
        const typedLetter = event.key;
        if (typedLetter === "Enter" || typedLetter === "Tab") { // forward a letter
            if (!dictionary.includes(currentWord.value.toUpperCase())) return;
            const oldLastLetter = currentWord.value[currentWord.value.length - 1];
            updateCurrentWord(true, oldLastLetter);
            checkWin();
        } else if (typedLetter === "Backspace") { // back a letter
            const currentWordLength = currentWord.value.length;
            if (currentWordNum === 1 && currentWord.value.length === 0) return;
            if (currentWordNum !== 1 && currentWord.value.length === 1) { // must always have 1 letter if not on first word
                updateCurrentWord(false, "");
                return;
            }
            
            const currentLine = document.getElementById(`line${currentLineNum}`);
            if (currentLine) currentLine.parentNode.removeChild(currentLine);
            currentLineNum--;
            
            const currentNode = document.evaluate("//button[text() = '" + startLetter + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            currentNode.classList.remove("last-item");
            if (!charExistsInPrevHistory(startLetter)) {
                currentNode.classList.remove("used");
            }

            const newLetter = currentWord.value[currentWord.value.length - 2].toUpperCase();
            const newNode = document.evaluate("//button[text() = '" + newLetter + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (newNode) newNode.classList.add("last-item");
            startLetter = newLetter;
        } else if (isLegalChar(typedLetter.toUpperCase())) { // legal letter
            addLetter(typedLetter.toUpperCase(), true);
        } else { // illegal letter
            event.preventDefault(); // prevent typed letter
        }
    });
});

// for clicks on nodes
const board = document.querySelector(".board");
board.addEventListener("click", (event) => {
    const clickedLetter = event.target.closest(".node").innerText;
    if (isLegalChar(clickedLetter)) {
        addLetter(clickedLetter, false);
    }
});

function charExistsInPrevHistory(char) {
    let allLetters = "";
    for (let i = 0; i < currentWordNum; i++) {
        allLetters += document.getElementById(`word${i + 1}`).value;
    }
    const allLettersButLast = allLetters.slice(0, -1).toUpperCase();
    return allLettersButLast.includes(char);
}

function isLegalChar(endLetter) {
    const startNode = document.evaluate("//button[text() = '" + startLetter + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const endNode = document.evaluate("//button[text() = '" + endLetter + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (!endNode) return false;
    return (currentWordNum === 1 && currentWord.value.length === 0)
        || (currentWordNum !== 1 && currentWord.value.length === 1)
        || (startNode && startNode.dataset.links.includes(endNode.id));
}

function updateCurrentWord(forward, letter) {
    if (forward) currentWordNum++;
    else currentWordNum--;
    if (currentWordNum < 1 || currentWordNum > 6) return;
    currentWord.classList.add("off");
    currentWord.disabled = true;
    currentWord = document.getElementById(`word${currentWordNum}`);
    currentWord.classList.remove("off");
    currentWord.disabled = false;
    currentWord.focus();
    if (forward) currentWord.value = letter;
}

function addLetter(endLetter, wasTyped) {
    // add word to input boxes if not already
    if (!wasTyped) {
        currentWord.value += endLetter.toLowerCase();
    }
    
    const startNode = document.evaluate("//button[text() = '" + startLetter + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const endNode = document.evaluate("//button[text() = '" + endLetter + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    if (startNode) {
        drawLine(startNode, endNode);
        startNode.classList.remove("last-item");
    }
    endNode.classList.add("last-item");
    endNode.classList.add("used");
    
    startLetter = endLetter;
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
    currentLineNum++;
    newLine.id = `line${currentLineNum}`;
    newLine.classList.add("line");
    
    newLine.style.width = length + "px";
    newLine.style.transform = `rotate(${angle}deg)`;
    newLine.style.left = `${x1}px`;
    newLine.style.top = `${y1}px`;
    
    document.body.appendChild(newLine);
}

function checkWin() {    
    const allUsedNodes = document.querySelectorAll(".used");
    const allNodes = document.querySelectorAll(".node");
    if (allUsedNodes.length !== allNodes.length) return;
    
    const currentLevel = parseInt(localStorage.getItem("current_level"));
    const nextLevel = parseInt(Math.min(currentLevel, document.body.dataset.level) + 1);
    const score = currentWordNum / 2;
    localStorage.setItem("current_level", nextLevel);
    localStorage.setItem("level_1_score", score);
    window.location.href = "../index.html";
}
