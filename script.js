let word
let wordUnaccented
let words
wordsRequest().then((data) => {words = data})
let screen
let wrongLetters
let isSonWinning = false
let index

const letterContainer = document.getElementById("letter")
const wrongLettersContainer = document.querySelector(".letters")
const confirmButton = document.getElementById("sender")
const imageHTML = document.getElementById("hangman")
const playButton = document.getElementById("play_button")
const display = document.getElementById("display")
const letterInput = document.getElementById("letter")

async function wordsRequest() {
    return (await axios.get("https://raw.githubusercontent.com/KevayneCst/FrenchWords/master/CorrectedFrenchDictionnary.txt")).data.split("\n")
}

function newWord() {
    word = randomInArray(words)
    wordUnaccented = removeAccents(word)
    screen = Array(word.length).fill("_")
    wrongLetters = []
    index = -1
    imageHTML.removeAttribute("src")
    wrongLettersContainer.innerHTML = ""
    confirmButton.innerHTML = "Confirm"
    isSonWinning = false
    update()
}

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomInArray(array) {
    return array[randomInt(array.length)]
}

function show() {
    Array.from(document.querySelectorAll('.hidden')).forEach((elem) => elem.classList.remove('hidden'))
}

function update() {
    display.innerText = screen.join("")
    letterInput.value = ""
}

function isLetter(letter) {
    return letter.match(/[a-z]/i)
}

function displayMessage(str) {
        confirmButton.innerHTML = str
        setTimeout(() => confirmButton.innerHTML = "Confirm", 600)
}

function tryInput() {
    if (isSonWinning) {
        newWord()
    } else {
        const ltr = letterContainer.value.toLowerCase()
        if (isLetter(ltr)) {
            tryLetter(ltr)
        } else {
            letterInput.value = ""
            displayMessage("Unauthorized >:(")
        }
    }
    letterContainer.focus()
}

function tryLetter(letter) {
    if (!wordUnaccented.includes(letter)) {
        if (!wrongLetters.includes(letter)) {
            addWrongLetter(letter)
        } else {
            displayMessage("Already tried :(")
        }
    } else {
        for (let i = 0; i < screen.length; i++) {
            if (wordUnaccented[i] === letter) {
                screen[i] = word[i]
            }
        }
    }
    update()
    checkWin()
    checkLoss()
}

function addWrongLetter(ltr) {
    wrongLetters.push(ltr)
    const elem = document.createElement("div")
    elem.innerText = ltr
    wrongLettersContainer.appendChild(elem)
    if (index < 9) {
        index++
        imageHTML.setAttribute("src", `images/nightmare/${index}.png`)
    }
}

function play() {
    newWord()
    show()
    playButton.classList.add("hidden")
    update()
}

function checkWin() {
    if (word === screen.join("")) {
        isSonWinning = true
        confirmButton.innerHTML = "Play again"
        setTimeout(() => {alert("You have won!")}, 500)
    }
}

function checkLoss() {
    if (index >= 9) {
        isSonWinning = true
        confirmButton.innerHTML = "Play again"
        setTimeout(() => {alert("You have lost :(")}, 500)
    }
}

playButton.addEventListener("click", play)
confirmButton.addEventListener("click", tryInput)
letterContainer.addEventListener("keydown", 
(e) => {
    if (e.key == "Enter") {
        tryInput();
    }
})
