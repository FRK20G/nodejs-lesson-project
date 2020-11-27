const searchButton = document.querySelector('#search');
const queryInput = document.querySelector('#query');
const insultsWrapper = document.querySelector('#insults');


async function getInsult() {
    const response = await fetch('http://localhost:8000/api/getInsult');
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
    const response = await fetch('http://localhost:8000/api/insults?play=' + query);
    const data = await response.json();
    displayInsults(data);
}

searchButton.addEventListener('click', () => {
    const query = queryInput.value;
    console.log('Från inputfältet: ', query);
    getInsultsFromQuery(query);
});

getInsult();


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