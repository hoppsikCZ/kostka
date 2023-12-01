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

    dieDiv.classList.add("dieDiv");
    dieDiv.classList.add("col-4");
    dieDiv.classList.add("d-flex");
    dieDiv.classList.add("align-items-center");
    dieDiv.classList.add("justify-content-center");
    dieDiv.setAttribute("data-locked", "false");
    dieDiv.setAttribute("data-used", "false");
    dieDiv.setAttribute("data-value", "6");
    image.setAttribute("src", "./img/kostka6.png");
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
    let score = calcSore(true);
    let nextThrow = true;
    kostky.forEach((item) => {
        if (item.dieDiv.getAttribute("data-locked") === "false")
            nextThrow = false;
    });

    if (score < 0)
        alert("Neplatný výběr kostek!");
    else if (score === 0)
        alert("Musíš nahrát více než v minulém kole!");
    else {
        currentScore += score;
        kostky.forEach((item) => {
            if (item.dieDiv.getAttribute("data-locked") !== "true")
                item.throw();
        });
        
        if (nextThrow) {
            kostky.forEach((item) => {
                item.throw();
                item.image.style.outline = "solid green 0px";
                item.dieDiv.setAttribute("data-locked", "false");
                item.dieDiv.setAttribute("data-used", "false");
            });
        }
    }
});

document.getElementById('bEndTurn').addEventListener('click', () => {
    score = calcSore(true, false);
    let vsechnyLocked = true;

    kostky.forEach((item) => {
        if (item.dieDiv.getAttribute("data-locked") === "false")
            vsechnyLocked = false;
    });

    if (calcSore(false, false) > score) {
        alert("Ještě jsou na ploše kostky, které je možné označit!");
        return;
    } else if (vsechnyLocked) {
            alert("Nelze ukončit tah, jsou-li všechny kostky uzamčeny! Házej znovu.");
            return;
    } else if (score > 0 && score + currentScore >= 350) {
        skoreHracu[activePlayer] += currentScore + score;
    }

    kostky.forEach((item) => {
        if (item.dieDiv.getAttribute("data-locked") === "false")
            vsechnyLocked = false;
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

document.getElementById('bChangePlayerCount').addEventListener('click', () => { 
    if (playerCount < 6) {
        playerCount++;
        setup();
    } else
        alert("Byl dosažen maximálmí možný počet hráčů!")
});

document.getElementById('bRules').addEventListener('click', () => { 
    window.open("https://www.kramekprodeti.cz/fotky45931/fotov/_ps_42351Pravidla-her-v-kostky.pdf");
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
    for (let i = 0; i < 6; i++) {
        if (kostky[i] == null) {
            kostky[i] = buildDie();
            divKostek.appendChild(kostky[i].dieDiv);
        }

        kostky[i].throw();

        if (i < playerCount) {
            if (hraci[i] == null) {
                hraci[i] = buildPlayer(i + 1);
                divHracu.appendChild(hraci[i]);
            }

            skoreHracu[i] = 0;
            hraci[i].innerHTML = '<p style="text-align:center">Hráč ' + (i + 1) + '</p>';
        }
    }
}

function calcSore(onlySelected, lock = true) {
    let numbers = [0, 0, 0, 0, 0, 0];
    let resultScore = 0;
    let postupka = true;
    let dvojice = 0;
    let neplatne = false;

    kostky.forEach((item) => {
        if ((!onlySelected || item.dieDiv.getAttribute("data-locked") === "true") && item.dieDiv.getAttribute("data-used") === "false") {
            numbers[item.dieDiv.getAttribute("data-value") - 1]++;
        }
    });

    for (let i = 0; i < 6; i++) 
    {
        if (numbers[i] !== 1)
            postupka = false;

        if (numbers[i] / 2 >= 1 && numbers[i] <= 2 && numbers[i] % 2 === 0)
            dvojice += numbers[i] / 2;

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
    
    if (neplatne && onlySelected)
        resultScore = (-1);
        
    if (postupka === true)
        resultScore = 1500;
        
    if (dvojice === 3)
        resultScore = 1000;

    if (lock && resultScore !== 1) {
        kostky.forEach((item) => {
        if ((item.dieDiv.getAttribute("data-locked") === "true") && item.dieDiv.getAttribute("data-used") === "false") {
            item.dieDiv.setAttribute("data-used", "true");
            item.image.style.outline = "solid red 3px";
        } 
        });
    }
    return resultScore;
}
