const word = "bonsoir"
const arr = word.split("") // or use Array.from() ?
let screen = Array(word.length).fill("_")
let wrongLetters = []

const letterContainer = document.getElementById("letter")
const wrongLettersContainer = document.querySelector(".letters")

function show() {
    Array.from(document.querySelectorAll('.hidden')).forEach((elem) => elem.classList.remove('hidden'))
}

function update() {
    document.getElementById("display").innerText = screen.join("")
    document.getElementById("letter").value = ""
}

function tryLetter() {
    const letter = letterContainer.value
    
    if (!arr.includes(letter)) {
        if (!wrongLetters.includes(letter)) {
            addWrongLetter(letter)
        }
    } else {
        for (let i = 0; i < screen.length; i++) {
            if (arr[i] === letter) {
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
    show()
    document.getElementById("playButton").classList.add("hidden")
    update()
}

function equalArrays(a, b) {
    return a.length == b.length && a.every((val, index) => val === b[index])
}

function checkWin() {
    if (equalArrays(arr, screen)) {
        alert("You won!")
    }
}

document.getElementById("playButton").addEventListener("click", play)
document.getElementById("sender").addEventListener("click", tryLetter)
