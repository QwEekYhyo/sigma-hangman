const fs = require('node:fs');
const url = require('node:url');

let words = readDic();
words = words.filter(isWordGood);

const randomInt = (max) => Math.floor(Math.random() * max)

const randomInArray = (array) => array[randomInt(array.length)]

function manageRequest(request, response) {
    const path = url.parse(request.url);
    if (path.pathname === "/api/getWord") {
        const word = randomInArray(words);
        response.statusCode = 200;
        response.end(word);
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

exports.manageRequest = manageRequest;
