const word = "bonsoir"
const arr = word.split("") // or use Array.from() ?
let screen = Array(word.length).fill("_")

const letterContainer = document.getElementById("letter")

function show() {
    Array.from(document.querySelectorAll('.hidden')).forEach((elem) => elem.classList.remove('hidden'))
}

function update() {
    document.getElementById("display").innerText = screen.join("")
    document.getElementById("letter").value = ""
}

function tryLetter() {
    const letter = letterContainer.value
    
    for (let i = 0; i < screen.length; i++) {
        if (arr[i] === letter) {
            screen[i] = letter
        }
    }
    update()
    console.log(checkWin())
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
    return equalArrays(arr, screen)
}

document.getElementById("playButton").addEventListener("click", play)
document.getElementById("sender").addEventListener("click", tryLetter)
