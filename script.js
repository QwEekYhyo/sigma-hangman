let word
let word_arr
let words
wordsRequest().then((data) => {words = data})
let screen
let wrongLetters
let isSonWinning = false
let index

const allowedChars = Array.from("abcdefghijklmnopqrstuvwxyzéèàçùê")

const letterContainer = document.getElementById("letter")
const wrongLettersContainer = document.querySelector(".letters")
const confirmButton = document.getElementById("sender")
const imageHTML = document.getElementById("hangman")
const play_button = document.getElementById("play_button")
const display = document.getElementById("display")
const letter_input = document.getElementById("letter")

async function wordsRequest() {
    return (await axios.get("https://raw.githubusercontent.com/KevayneCst/FrenchWords/master/CorrectedFrenchDictionnary.txt")).data.split("\n")
}

function newWord() {
    word = randomInArray(words)
    word_arr = word.split("")
    screen = Array(word.length).fill("_")
    wrongLetters = []
    index = -1
    imageHTML.removeAttribute("src")
    wrongLettersContainer.innerHTML = ""
    confirmButton.innerHTML = "Confirm"
    isSonWinning = false
    update()
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
    letter_input.value = ""
}

function isLetter(letter) {
    return allowedChars.includes(letter)
}

function tryInput() {
    if (isSonWinning) {
        newWord()
    } else {
        const ltr = letterContainer.value.toLowerCase()
        if (isLetter(ltr)) {
            tryLetter(ltr)
        }
    }
    letterContainer.focus()
}

function tryLetter(letter) {
    if (!word_arr.includes(letter)) {
        if (!wrongLetters.includes(letter)) {
            addWrongLetter(letter)
        }
    } else {
        for (let i = 0; i < screen.length; i++) {
            if (word_arr[i] === letter) {
                screen[i] = letter
            }
        }
    }
    update()
    checkWin()
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
    play_button.classList.add("hidden")
    update()
}

function equalArrays(a, b) {
    return a.length == b.length && a.every((val, index) => val === b[index])
}

function checkWin() {
    if (equalArrays(word_arr, screen)) {
        isSonWinning = true
        confirmButton.innerHTML = "Play again"
        alert("You won!")
    }
}

play_button.addEventListener("click", play)
confirmButton.addEventListener("click", tryInput)
letterContainer.addEventListener("keydown", 
(e) => {
    if (e.key == "Enter") {
        tryInput();
    }
})
