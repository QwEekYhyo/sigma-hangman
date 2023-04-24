let word
let word_arr
let words
wordsRequest().then((data) => {words = data})
let screen
let wrongLetters
let isSonWinning = false

const letterContainer = document.getElementById("letter")
const wrongLettersContainer = document.querySelector(".letters")
const confirmButton = document.getElementById("sender")

async function wordsRequest() {
    return (await axios.get("https://raw.githubusercontent.com/KevayneCst/FrenchWords/master/CorrectedFrenchDictionnary.txt")).data.split("\n")
}

function newWord() {
    word = randomInArray(words)
    word_arr = word.split("")
    screen = Array(word.length).fill("_")
    wrongLetters = []
    isSonWinning = false
    confirmButton.innerHTML = "Confirm"
    wrongLettersContainer.innerHTML = ""
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
    document.getElementById("display").innerText = screen.join("")
    document.getElementById("letter").value = ""
}

function tryInput() {
    if (isSonWinning) {
        newWord()
    } else {
        const ltr = letterContainer.value
        tryLetter(ltr)
    }
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
    wrongLettersContainer.innerHTML += `<div>${ltr}</div>`
}

function play() {
    newWord()
    show()
    document.getElementById("playButton").classList.add("hidden")
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

document.getElementById("playButton").addEventListener("click", play)
confirmButton.addEventListener("click", tryInput)
letterContainer.addEventListener("keydown", 
(e) => {
    if (e.key == "Enter") {
        tryInput();
    }
})
