const path = require('node:path');
const fs = require('node:fs');
const url = require('node:url');

const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const randomInt = (max) => Math.floor(Math.random() * max)

const randomInArray = (array) => array[randomInt(array.length)]

const words = readDic().filter(isWordGood);

const isLetter = (letter) => letter.match(/[a-z]/i)

let game;

function manageRequest(request, response) {
    const path = url.parse(request.url);
    if (path.pathname === '/api/getWord') {
        const word = randomInArray(words);
        response.statusCode = 200;
        response.end(word);

    } else if (path.pathname === '/api/testLetter') {
        const params = new URLSearchParams(path.search);
        const letter = params.get("letter").toLowerCase();
        if (isLetter(letter)) {
            game.tryLetter(letter);
            response.statusCode = 200;
            response.end(game.send());
        } else {
            response.statusCode = 400;
            response.end('Not a letter');
        }

    } else if (path.pathname === '/api/newGame') {
        game = new Game();

        response.statusCode = 200;
        response.end(`${game.wordToGuess.length}`);

    } else {
        response.statusCode = 404;
        response.end('<h1>Not found nigger</h1>');
    }
}

function readDic() {
    const url = './dic.txt';

    try {
        const words  = fs.readFileSync(url, 'utf8');
        return words ? words.split(/[(\r?\n),. ]/) : ['teapot'];
    } catch (error) {
        return ['teapot'];
    }
}

function isWordGood(word) {
    return word.length >= 6 && word.length <= 8 && word === word.toLowerCase();
}

class Game {
    constructor() {
        this.wordToGuess = randomInArray(words);
        this.wordUnaccented = removeAccents(this.wordToGuess);
        this.displayedWord = Array(this.wordToGuess.length).fill("_")
        this.nbErrors = -1
        this.maxErrors = 9;
        this.isSonWinning = false;
        this.wrongLetters = [];
    }

    tryLetter(letter) {
        if (!this.wordUnaccented.includes(letter)) {
            if (!this.wrongLetters.includes(letter)) {
                this.wrongLetters.push(letter)
            } else {
                console.log("Already tried :(")
            }
        } else if (this.displayedWord.includes(letter)) {
                console.log("Already guessed :(")
        } else {
            for (let i = 0; i < this.wordToGuess.length; i++) {
                if (this.wordUnaccented[i] === letter) {
                    this.displayedWord[i] = this.wordToGuess[i]
                }
            }
        }
    }

    send() {
        return JSON.stringify({
            nbErrors: this.nbErrors,
            displayedWord: this.displayedWord,
            isLost: this.nbErrors >= this.maxErrors,
            isWon: this.displayedWord.join("") === this.wordToGuess,
        });
    }
}

exports.manageRequest = manageRequest;
