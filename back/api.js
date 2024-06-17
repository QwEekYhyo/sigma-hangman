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
    const params = new URLSearchParams(path.search);

    if (path.pathname === '/api/getWord') {
        const word = randomInArray(words);
        response.statusCode = 200;
        response.end(word);

    } else if (path.pathname === '/api/testLetter') {
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
        const difficulty = params.get("difficulty");
        game = new Game(difficulty);

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
    return word === word.toLowerCase();
}

class Game {
    constructor(difficulty) {
        this.wordToGuess = ""
        while (this.wordToGuess.length < difficulty * 3 || this.wordToGuess.length > difficulty * 5) {
            this.wordToGuess = randomInArray(words);
        }
        this.wordUnaccented = removeAccents(this.wordToGuess);
        this.displayedWord = Array(this.wordToGuess.length).fill("_");
        this.nbErrors;
        this.maxErrors = 10;
        this.isSonWinning = false;
        this.wrongLetters = [];
        this.message = "";
    }

    tryLetter(letter) {
        if (!this.wordUnaccented.includes(letter)) {
            if (!this.wrongLetters.includes(letter)) {
                this.wrongLetters.push(letter);
            } else {
                this.message = "Already tried :(";
            }
        } else if (this.displayedWord.includes(letter)) {
                this.message = "Already guessed :(";
        } else {
            for (let i = 0; i < this.wordToGuess.length; i++) {
                if (this.wordUnaccented[i] === letter) {
                    this.displayedWord[i] = this.wordToGuess[i];
                }
            }
        }
    }

    send() {
        this.nbErrors = this.wrongLetters.length;
        const toSend = JSON.stringify({
            nbErrors: this.nbErrors,
            displayedWord: this.displayedWord,
            isLost: this.nbErrors >= this.maxErrors,
            isWon: this.displayedWord.join("") === this.wordToGuess,
            message: this.message,
        });
        this.message = "";
        return toSend;
    }
}

exports.manageRequest = manageRequest;
