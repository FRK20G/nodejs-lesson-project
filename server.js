/*const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer();*/

const express = require('express');
const bodyParser = require('body-parser');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const database = new lowdb(adapter);
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

//const insults = [{"insult":"Were such things here as we do speak about? Or have we eaten on the insane root That takes the reason prisoner?","play":"Macbeth"},{"insult":"Never hung poison on a fouler toad","play":"Rickard III"},{"insult":"He thinks too much: such men are dangerous.","play":"Julius Ceasar"},{"insult":"Thou calledst me a dog before thou hadst a cause. But since I am a dog, beware my fangs.","play":"The Merchant of Venice"},{"insult":"Give me your hand...I can tell your fortune. You are a fool.","play":"The Two Noble Kinsmen"},{"insult":"He smells like a fish, a very ancient and fish-like smell, a kind of not-of-the-newest poor-John. A strange fish!","play":"The Tempest"},{"insult":"It is a tale Told by an idiot, full of sound and fury, Signifying nothing.","play":"Macbeth"},{"insult":"Alas, poor heart, that kiss is comfortless As frozen water to a starved snake","play":"Titus Andronicus"},{"insult":"He hath eaten me out of house and home; he hath put all substance into that fat belly of his.","play":"Henry IV, Part 2"},{"insult":"Out, you green-sickness carrion! Out, you baggage! You tallow-face!","play":"Romeo and Juliet"}]

// HTTP - modulen response.end()
// Express - response.send()

io.on('connection', (socket) => {
    socket.on('join', (username) => {
        console.log('Username: ', username);
        socket.broadcast.emit('user joined', 'User ' + username + ' joined');
    });

    socket.on('message', (chatMessage) => {
        socket.broadcast.emit('new message', chatMessage);
    });
});

app.use((request, response, next) => {
    //console.log('A new request: ', request.url);
    next();
});
app.use(bodyParser.json());

app.use(express.static('public'));

//app.use(express.static('public')) matchar url:er och returnerar rätt fil istället för att
//behöva göra nedanstående routes
/*app.get('/', (request, response) => {
    const src = fs.createReadStream('index.html');
    src.pipe(response);
});

app.get('/style.css', (request, response) => {
    const src = fs.createReadStream('style.css');
    src.pipe(response);
});

app.get('/client.js', (request, response) => {
    const src = fs.createReadStream('client.js');
    src.pipe(response);
});*/





function findInsults(play) {
    let result = [];

    for(insult of insults) {
        console.log('Compare: ', insult.play + ' ' + play);
        if (insult.play === play) {
            result.push(insult);
        }
    }

    return result;
}

async function getInsults() {
    const insults = await database.get('insults').value();
    return insults;
}

app.get('/api/insult', async (request, response) => {
    const data = await database.get('insults').value();
    const index = Math.floor(Math.random() * data.length);
    response.send(JSON.stringify(data[index]));
});

app.get('/api/insult/all', async (request, response) => {
    const data = await getInsults(); 
    response.send(JSON.stringify(data))
});

app.get('/api/insult/search', async (request, response) => {
    const play = request.query.play;
    //const insults = findInsults(play);
    const data = await database.get('insults').filter({ 'play' : play }).value();
    response.send(JSON.stringify(data));
});

app.post('/api/insult', async (request, response) => {
    const data = request.body;
    const result = await database.get('insults').push(data).write();

    const resObj = {
        success: true,
        message: result
    }

    response.send(JSON.stringify(resObj));
});

app.get('/plays/:play', (request, response) => {
    console.log('Param: ', request.params.play);
    response.send(request.params.play);
});

app.get('/plays', (request, response) => {
    console.log('Query: ', request.query);
    response.send(request.query.play);
});

app.use((request, response) => {
    response.status(404).send('Hittade ingen sida');
});

app.use((error, request, response, next) => {
    const obj = { success: false, message: 'Something went wrong'};
    response.status(500).send(JSON.stringify(obj));
});

http.listen(8000, () => {
    console.log('Server started');
    database.defaults({ insults: [{"insult":"Were such things here as we do speak about? Or have we eaten on the insane root That takes the reason prisoner?","play":"Macbeth"},{"insult":"Never hung poison on a fouler toad","play":"Rickard III"},{"insult":"He thinks too much: such men are dangerous.","play":"Julius Ceasar"},{"insult":"Thou calledst me a dog before thou hadst a cause. But since I am a dog, beware my fangs.","play":"The Merchant of Venice"},{"insult":"Give me your hand...I can tell your fortune. You are a fool.","play":"The Two Noble Kinsmen"},{"insult":"He smells like a fish, a very ancient and fish-like smell, a kind of not-of-the-newest poor-John. A strange fish!","play":"The Tempest"},{"insult":"It is a tale Told by an idiot, full of sound and fury, Signifying nothing.","play":"Macbeth"},{"insult":"Alas, poor heart, that kiss is comfortless As frozen water to a starved snake","play":"Titus Andronicus"},{"insult":"He hath eaten me out of house and home; he hath put all substance into that fat belly of his.","play":"Henry IV, Part 2"},{"insult":"Out, you green-sickness carrion! Out, you baggage! You tallow-face!","play":"Romeo and Juliet"}] }).write();
});




/*server.on('request', (request, response) => {
    console.log('Request: ', request.url);
    console.log('basename: ', path.basename(request.url));
    

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
    /*} else {
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
*/