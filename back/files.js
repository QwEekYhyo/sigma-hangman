const url = require('node:url');
const fs = require('node:fs');
const path = require('node:path');

const mimeTypes = {
     '.ico': 'image/x-icon',
     '.html': 'text/html',
     '.js': 'text/javascript',
     '.json': 'application/json',
     '.css': 'text/css',
     '.png': 'image/png',
     '.jpg': 'image/jpeg',
     '.wav': 'audio/wav',
     '.mp3': 'audio/mpeg',
     '.svg': 'image/svg+xml',
     '.pdf': 'application/pdf',
     '.doc': 'application/msword',
     '.md': 'text/plain',
     '.ttf': 'application/x-font-ttf',
     '.otf': 'application/x-font-opentype',
     '.woff': 'font/woff',
     'default': 'application/octet-stream'
};

function manageRequest(request, response) {
    const uRocketLeague = '../front'.concat(url.parse(request.url).pathname);

    let stat;
    try {
        stat = fs.statSync(uRocketLeague)
    } catch (error) {
        response.statusCode = 404;
        response.end();
        return;
    }

    response.setHeader('Content-Type', mimeTypes[path.extname(uRocketLeague)]);
    response.setHeader('Content-Length', stat.size);

    const readStream = fs.createReadStream(uRocketLeague)
    readStream.pipe(response)
}

exports.manageRequest = manageRequest;
