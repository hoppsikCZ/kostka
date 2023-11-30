const divKostek = document.getElementById("divKostky");
const divHracu = document.getElementById("divHraci");
let currentScore = 0;
let playerCount = 1;
let activePlayer = 0;
class Die {
    constructor(dieDiv, image) {
        this.dieDiv = dieDiv;
        this.image = image;
    }

    throw() {
        let h = Math.ceil(Math.random() * 6);
        this.dieDiv.setAttribute("data-value", h);
        this.image.src = './img/kostka' + h + '.png';
    }
}
let kostky = [];
let hraci = [];
let skoreHracu = [];
let hody = [];

setup();

function buildDie() {
    const dieDiv = document.createElement("div");
    const image = document.createElement("img");
    let h = Math.ceil(Math.random() * 6);

    dieDiv.classList.add("dieDiv");
    dieDiv.classList.add("col-4");
    dieDiv.classList.add("d-flex");
    dieDiv.classList.add("align-items-center");
    dieDiv.classList.add("justify-content-center");
    dieDiv.setAttribute("data-locked", "false");
    dieDiv.setAttribute("data-used", "false");
    dieDiv.setAttribute("data-value", h);
    image.setAttribute("src", "./img/kostka" + h + ".png");
    image.setAttribute("alt", "kostka");
    dieDiv.appendChild(document.createElement("figure")).appendChild(image);

    dieDiv.addEventListener("click", () => {
        if (dieDiv.getAttribute("data-locked") === "false") {
            image.style.outline = "solid green 3px";
            dieDiv.setAttribute("data-locked", "true");
        } else if (dieDiv.getAttribute("data-used") === "false"){
            image.style.outline = "solid green 0px";
            dieDiv.setAttribute("data-locked", "false");
        }
    });

    const resultDie = new Die(dieDiv, image); 

    return resultDie;
}

function buildPlayer(num) {
    const player = document.createElement("div");
    player.classList.add("col-4");
    player.classList.add("bg-light");
    player.innerHTML = '<p style="text-align:center">Hráč ' + num + '</p>';
    skoreHracu[num - 1] = 0;
    return player;
}

document.getElementById('bThrow').addEventListener('click', () => { 
    score = calcSore(true);
    if (score < 0)
        alert("Neplatný výběr kostek!");
    else if (score === 0)
        alert("Musíš nahrát více než v minulém kole");
    else {
        currentScore += score;
        kostky.forEach((item) => {
            if (item.dieDiv.getAttribute("data-locked") !== "true")
                item.throw();
        });
    }
});

document.getElementById('bEndTurn').addEventListener('click', () => {
    score = calcSore(true);

    if (score > 0 && score + currentScore >= 350) {
        skoreHracu[activePlayer] += currentScore + score;
    }

    kostky.forEach((item) => {
        item.dieDiv.setAttribute("data-locked", "false");
        item.dieDiv.setAttribute("data-used", "false");
        item.image.style.outline = "solid red 0px";
        item.throw();
    });

    hraci[activePlayer].innerHTML += "<p>" + skoreHracu[activePlayer] + "</p>";
    currentScore = 0;

    if (++activePlayer >= playerCount)
        activePlayer = 0;
});

/*function suma(cisla) {
    var sum = 0;
    cisla.forEach(function(value,index){
        sum += value;
    })
    return sum;
}

function maximum(cisla) {
    var max = 1;
    cisla.forEach(function(value,index){
        if (value > max) max = value;
    })
    return max;
}

function minimum(cisla) {
    var min = 6;
    cisla.forEach(function(value,index){
        if (value < min) min = value;
    })
    return min;
}

function average(sum, count) {
    return (sum / count).toFixed(2);
}

function hod() {
    document.getElementById('cube').src='img/kostka' + h + '.png';
    document.getElementById('result').innerHTML = '<p>Hod: ' + h + '</p>';
    document.getElementById('result').innerHTML += 
        '<p>Počet hodů: ' + hody.length + '</p>';
    document.getElementById('result').innerHTML += 
        '<p>Součet hodů: ' + suma(hody) + '</p>';
    document.getElementById('result').innerHTML += 
        '<p>Průměr hodů: ' + average(suma(hody),hody.length) + '</p>';
    document.getElementById('result').innerHTML += 
        '<p>Nejvyšší hod: ' + maximum(hody) + '</p>';
    document.getElementById('result').innerHTML += 
        '<p>Nejvyšší hod: ' + minimum(hody) + '</p>';
    return h;
}*/

function setup() {
    do {
        playerCount = prompt("Zadej počet hráčů");
    } while (isNaN(playerCount) || playerCount < 1);


    for (let i = 0; i < 6; i++) {
        kostky[i] = buildDie();
        divKostek.appendChild(kostky[i].dieDiv);

        if (i < playerCount) {
            hraci[i] = buildPlayer(i + 1);
            divHracu.appendChild(hraci[i]);
        }
    }
}

function calcSore(onlySelected) {
    let numbers = [0, 0, 0, 0, 0, 0];
    let resultScore = 0;
    let postupka = true;
    let dvojice = 0;
    let neplatne = false;

    kostky.forEach((item) => {
        if ((!onlySelected || item.dieDiv.getAttribute("data-locked") === "true") && item.dieDiv.getAttribute("data-used") === "false") {
            numbers[item.dieDiv.getAttribute("data-value") - 1]++;
            item.dieDiv.setAttribute("data-used", "true");
            item.image.style.outline = "solid red 3px";
        }
    });

    for (let i = 0; i < 6; i++) 
    {
        if (numbers[i] !== 1)
            postupka = false;

        if (numbers[i] === 2)
            dvojice++;

        if (i === 0) {
            if (numbers[i] >= 3)
                resultScore += 1000 * (2 ** (numbers[i] - 3));
            else
                resultScore += numbers[i] * 100; 
        } else if (i === 4 && numbers[i] < 3) {
            resultScore += numbers[i] * 50;
        } else if (numbers[i] >= 3) {
            resultScore += (i + 1) * 100 * (2 ** (numbers[i] - 3));
        } else if (numbers[i] > 0)
            neplatne = true;
    }
    
    if (neplatne && onlySelected === true)
        resultScore = (-1);
    else if (postupka === true)
        resultScore = 1500;
    else if (dvojice === 3)
        resultScore = 1000;

    return resultScore;
}