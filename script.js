let word
let wordUnaccented
let words
wordsRequest().then((data) => {words = data})
let screen
let wrongLetters
let isSonWinning = false
let index
let difficulty = 1

const letterContainer = document.getElementById("letter")
const wrongLettersContainer = document.querySelector(".letters")
const confirmButton = document.getElementById("sender")
const imageHTML = document.getElementById("hangman")
const playButton = document.getElementById("play_button")
const difficultyButton = document.getElementById("difficulty_button")
const display = document.getElementById("display")
const letterInput = document.getElementById("letter")

const audioCtx = new AudioContext()
let globalSource
const sounds = await multipleBuffers(["turn_on.mp3", "continuous.mp3", "caca.mp3"].map((file) => "sounds/" + file))

async function wordsRequest() {
    return (await axios.get("https://raw.githubusercontent.com/KevayneCst/FrenchWords/master/CorrectedFrenchDictionnary.txt")).data.split("\n")
}

const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const randomInt = (max) => Math.floor(Math.random() * max)

const randomInArray = (array) => array[randomInt(array.length)]

const isLetter = (letter) => letter.match(/[a-z]/i)

// difficulty => 1, 2 or 3
function getWord(arr, difficulty = 1) {
    console.log("Generating a word...")
    let word = ""
    while (word.length < difficulty * 3 || word.length > difficulty * 5) {
        word = randomInArray(arr)
    }
    console.log("Word successfully generated")
    return word
}

function newWord() {
    word = getWord(words, difficulty)
    wordUnaccented = removeAccents(word)
    screen = Array(word.length).fill("_")
    wrongLetters = []
    index = -1
    imageHTML.removeAttribute("src")
    wrongLettersContainer.innerHTML = ""
    confirmButton.innerText = "Confirm"
    letterContainer.classList.remove("hidden")
    isSonWinning = false
    playSound(sounds[0])
    loopSoundButSourceIsGlobal(sounds[1], sounds[0].duration)
    update()
}

function show() {
    Array.from(document.querySelectorAll('.hidden')).forEach((elem) => elem.classList.remove('hidden'))
}

function update() {
    display.innerText = screen.join("")
    letterInput.value = ""
}

function displayMessage(str) {
        confirmButton.innerText = str
        setTimeout(() => confirmButton.innerText = "Confirm", 600)
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
    } else if (screen.includes(letter)) {
            displayMessage("Already guessed :(")
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

function changeDifficulty() {
    const difficultiesText = ["Short", "Medium", "Long"]
    difficulty = (difficulty++ % 3) + 1
    difficultyButton.innerText = difficultiesText[difficulty - 1]
}

function play() {
    newWord()
    show()
    playButton.classList.add("hidden")
    difficultyButton.classList.add("hidden")
    update()
}

function checkWin() {
    if (word === screen.join("")) {
        isSonWinning = true
        confirmButton.innerText = "Play again"
        letterContainer.classList.add("hidden")
        globalSource.stop()
        setTimeout(() => alert("You have won!"), 500)
    }
}

function checkLoss() {
    if (index >= 9) {
        isSonWinning = true
        confirmButton.innerText = "Play again"
        letterContainer.classList.add("hidden")
        globalSource.stop()
        setTimeout(() => playCoolAnimation(), 600)
    }
}

function playCoolAnimation() {
    const image = document.createElement("img")
    const sound = sounds[2]

    image.classList.add("friendly_image")
    image.setAttribute("src", "images/nightmare/friendly.png")
    document.body.appendChild(image)
    playSound(sound)
    setTimeout(() => image.remove(), sound.duration * 1000)

}

async function getBuffer(url) {
    console.log("Decoding " + url)
    const request = await fetch(url)
    const buffer = await audioCtx.decodeAudioData(await request.arrayBuffer())
    console.log(`Successfully decoded ${url}!`)
    return buffer
}

async function multipleBuffers(urls) {
    return await Promise.all(urls.map((url) => getBuffer(url)))
}

// non one liner version of the function above (might need it later)
async function ezmultipleBuffers(urls) {
    let buffers = []

    for (const url of urls) {
        const buffer = await getBuffer(url)
        buffers.push(buffer)
    }
    return buffers
}

function playSound(buffer, time = 0, volume = 0.1) {
    const source = audioCtx.createBufferSource()
    const gain = audioCtx.createGain()

    source.buffer = buffer
    source.connect(gain)
    gain.connect(audioCtx.destination)
    gain.gain.setValueAtTime(volume, time)
    source.start(time)
}

function loopSoundButSourceIsGlobal(buffer, time = 0, volume = 0.1) {
    globalSource = audioCtx.createBufferSource()
    const gain = audioCtx.createGain()

    globalSource.buffer = buffer
    globalSource.connect(gain)
    gain.connect(audioCtx.destination)
    gain.gain.setValueAtTime(volume, time)
    setTimeout(() => globalSource.start(), time * 1000) // je m'en bas les couilles
    globalSource.loop = true
}

playButton.addEventListener("click", play)
difficultyButton.addEventListener("click", changeDifficulty)
confirmButton.addEventListener("click", tryInput)
letterContainer.addEventListener("keydown", 
(e) => {
    if (e.key == "Enter") {
        tryInput()
    }
})
