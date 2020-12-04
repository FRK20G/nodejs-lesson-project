const searchButton = document.querySelector('#search');
const queryInput = document.querySelector('#query');
const insultsWrapper = document.querySelector('#insults');
const addButton = document.querySelector('#add');
const addInsultInput = document.querySelector('#add-insult');
const addPlayInput = document.querySelector('#add-play');


async function getInsult() {
    const response = await fetch('http://localhost:8000/api/insult', { method: 'GET' });
    const data = await response.json();

    console.log(data);
    document.querySelector('#insult').innerHTML = data.insult;
    document.querySelector('#play').innerHTML = data.play;
}


function displayInsults(insults) {
    insultsWrapper.innerHTML = '';

    for (insult of insults) {
        const insultElem = document.createElement('p');
        insultElem.innerHTML = insult.insult;
        insultsWrapper.append(insultElem);
    }
}

async function getInsultsFromQuery(query) {
    const response = await fetch('http://localhost:8000/api/insult/search?play=' + query);
    const data = await response.json();
    displayInsults(data);
}

async function postInsult(insultToPost) {
    const response = await fetch('http://localhost:8000/api/insult', 
    {
        method: 'POST',
        body: JSON.stringify(insultToPost),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json();
}

searchButton.addEventListener('click', () => {
    const query = queryInput.value;
    console.log('Från inputfältet: ', query);
    getInsultsFromQuery(query);
});

addButton.addEventListener('click', () => {
    const insultValue = addInsultInput.value;
    const playValue = addPlayInput.value;

    const obj = {
        insult: insultValue,
        play: playValue
    }

    postInsult(obj);
});


getInsult();

async function getInsults() {
    const response = await fetch('http://localhost:8000/api/insult/all');
    const data = await response.json();

    console.log(data);
}

getInsults();


/*async function getInsult2() {
    const response = await fetch('http://localhost:8000/plays/Macbeth');
    const data = await response.json();

    console.log(data);
}

async function getInsults() {
    const response = await fetch('http://localhost:8000/api/getAll');
    const data = await response.json();

    console.log(data);
}*/