const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer();

server.on('request', (request, response) => {
    console.log('Request: ', request.url);
    console.log('basename: ', path.basename(request.url));

    if (request.url === '/') {
        const src = fs.createReadStream('index.html');
        src.pipe(response);
    } else {
        const baseUrl = path.basename(request.url);
        const src = fs.createReadStream(baseUrl);

        src.on('open', () => {
            src.pipe(response);
        });

        src.on('error', () => {
            response.end('Sidan kunde inte hittas');
        });
    }
});

server.listen(8000);