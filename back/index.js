const http = require('node:http');
const files = require('./files');
const api = require('./api');

const server = http.createServer((request, response) => {
    if (request.url.split('/').at(1) === 'api') {
        api.manageRequest(request, response);
    } else {
        files.manageRequest(request, response);
    }
});

server.listen(8000);
