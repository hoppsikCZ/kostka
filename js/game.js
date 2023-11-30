const divKostek = document.getElementById("divKostky");
let kostky = [];
let hody = [];

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
const die = buildDie();

divKostek.appendChild(die.dieDiv);
function buildDie() {
    const dieDiv = document.createElement("div");
    const image = document.createElement("img");

    dieDiv.classList.add("dieDiv");
    dieDiv.classList.add("col-4");
    dieDiv.setAttribute("data-locked", "false");
    dieDiv.setAttribute("data-value", "6");
    image.setAttribute("src", "./img/kostka6.png");
    image.setAttribute("alt", "kostka");
    dieDiv.appendChild(document.createElement("figure")).appendChild(image);

    dieDiv.addEventListener("click", () => {
        if (dieDiv.getAttribute("data-locked") === "false") {
            image.style.outline = "solid red 1px";
            dieDiv.setAttribute("data-locked", "true");
        } else {
            image.style.outline = "solid red 0px";
            dieDiv.setAttribute("data-locked", "false");
        }
    });

    const resultDie = new Die(dieDiv, image); 

    return resultDie;
}

document.getElementById('game').addEventListener('click',
    function(){
        hod();
        console.log(hody);
    }
);

function suma(cisla) {
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
    var h = Math.ceil(Math.random() * 6);
    hody.add(h);
    /*document.getElementById('cube').src='img/kostka' + h + '.png';
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
    return h;*/
}

function setup() {
    
}