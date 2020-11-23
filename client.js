async function getInsult() {
    const response = await fetch('http://localhost:8000/api/getInsult');
    const data = await response.json();

    console.log(data);
    document.querySelector('#insult').innerHTML = data.insult;
    document.querySelector('#play').innerHTML = data.play;
}

async function getInsults() {
    const response = await fetch('http://localhost:8000/api/getAll');
    const data = await response.json();

    console.log(data);
}

getInsult();
getInsults();