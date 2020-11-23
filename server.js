const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer();

const insults = [{"insult":"Were such things here as we do speak about? Or have we eaten on the insane root That takes the reason prisoner?","play":"Macbeth"},{"insult":"Never hung poison on a fouler toad","play":"Rickard III"},{"insult":"He thinks too much: such men are dangerous.","play":"Julius Ceasar"},{"insult":"Thou calledst me a dog before thou hadst a cause. But since I am a dog, beware my fangs.","play":"The Merchant of Venice"},{"insult":"Give me your hand...I can tell your fortune. You are a fool.","play":"The Two Noble Kinsmen"},{"insult":"He smells like a fish, a very ancient and fish-like smell, a kind of not-of-the-newest poor-John. A strange fish!","play":"The Tempest"},{"insult":"It is a tale Told by an idiot, full of sound and fury, Signifying nothing.","play":"Macbeth"},{"insult":"Alas, poor heart, that kiss is comfortless As frozen water to a starved snake","play":"Titus Andronicus"},{"insult":"He hath eaten me out of house and home; he hath put all substance into that fat belly of his.","play":"Henry IV, Part 2"},{"insult":"Out, you green-sickness carrion! Out, you baggage! You tallow-face!","play":"Romeo and Juliet"}]

server.on('request', (request, response) => {
    console.log('Request: ', request.url);
    //console.log('basename: ', path.basename(request.url));

    if (request.url === '/') {
        const src = fs.createReadStream('index.html');
        src.pipe(response);
    } else if (request.url.includes('/api/getInsult')) {
        //API endpoint som returnerar en slumpad förolämpning
        const index = Math.floor(Math.random() * insults.length);
        response.end(JSON.stringify(insults[index]));
    } else if (request.url === '/api/getAll') {
        //API endpoint som returnerar alla förolämpningar
        response.end(JSON.stringify(insults))

        //För att göra ytterligare ett anrop till ett annat API och sedan skicka tillbaka dess svar till
        //klienten
        /*http.get('http://shakespeare-insults-generator.herokuapp.com/getAll', (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                const obj = JSON.parse(data)
                response.end(JSON.stringify(obj));
            });
        })*/
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