$('main').css('display', 'none'); 

// WHY IS CLOUDFLARE NOT UDATING MY CODE?????????

let url = 'https://karljoke.herokuapp.com/jokes/ten'

let jokes = {}
let items = []
let flpd = []
let timerStarted = false;
let solved = 0

const board = document.querySelector('.board')
const mins = document.querySelector('.mins')
const tens = document.querySelector('.tens')
const ones = document.querySelector('.ones')
const modal = document.getElementById("myModal");
const close = document.querySelector('.close')
const tt = document.querySelector('.finalTime')
const rld = document.querySelector('.reloadBtn')

var timerInt;

const fetchJokes = async () => {
    try {
        const response = await fetch(url, {method: 'GET', })
        if (response.ok) {
            const jsonResponse = await response.json();
            for (item of jsonResponse) {
                jokes[item.setup] = item.punchline;
                items.push(item.setup, item.punchline);
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}


// FISHER YATES SHUFFLE

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}



const startGame = async () => {
    const itemsShfe = shuffle(items)
    for (let i = 0; i < itemsShfe.length; i++) {
        const ele = document.createElement('p');
        ele.classList.add('card');
        ele.innerHTML = items[i]
        board.appendChild(ele);
    }
    return true;
    
}

const endGame = () => {
    clearInterval(timerInt)
    modal.style.display = 'block';
    let timeString = mins.innerHTML + ':' + tens.innerHTML + ones.innerHTML;
    tt.innerHTML = timeString
}

close.onclick = () => {
    modal.style.display = 'none';
}


const isMatch = () => {
    console.log(flpd)
    flpd[0].classList.add('correct')
    flpd[1].classList.add('correct')
    flpd = []
    solved++;
    if (solved == 10) {
        endGame();
    }
}

const isNotMatch = () => {
    var flpdHere = flpd;
    flpdHere[0].classList.add('incorrect')
    flpdHere[1].classList.add('incorrect')
    setTimeout(() => {
         
        flpdHere[0].classList.remove('incorrect')
        flpdHere[1].classList.remove('incorrect')
        flpdHere[0].classList.remove('flip')
        flpdHere[1].classList.remove('flip')
    }, 2000)
    
    flpd = []
}


const checkMatch = () => {
    let setup, punchline;
    let j0 = flpd[0].innerHTML
    let j1 = flpd[1].innerHTML
    console.log(Object.keys(jokes))
    if (Object.keys(jokes).includes(j0) == true && Object.keys(jokes).includes(j1) == false) {
        setup = j0
        punchline = j1
    }
    else if (Object.keys(jokes).includes(j1) == true && Object.keys(jokes).includes(j0) == false) {
        setup = j1
        punchline = j0
    }
    else if (Object.values(jokes).includes(j1) && Object.values(jokes).includes(j0)) {
        isNotMatch();
    }
    else if (Object.keys(jokes).includes(j1) && Object.keys(jokes).includes(j0)) {
        isNotMatch();
    }
    else {
        throw new Error('Serious error... text not contained in jokes.')
    }
    if (jokes[setup] == punchline) {
        isMatch();
    }
    else {
        isNotMatch();
    }
}
const ready = () => {
    $('main').fadeIn(2000)
}

fetchJokes().then(startGame).then(ready)

const timer = () => {
    ones.innerHTML = parseInt(ones.innerHTML) + 1
    if (ones.innerHTML == 10) {
        tens.innerHTML = parseInt(tens.innerHTML) + 1
        ones.innerHTML = 0
        if (tens.innerHTML == 6) {
            mins.innerHTML = parseInt(mins.innerHTML) + 1
            tens.innerHTML = 0
        }
    }
}

board.addEventListener('click', (evt) => {
    
    
    if (evt.target.nodeName === 'P') {
        if (timerStarted == false) {
            console.log('among us')
            timerInt = setInterval(timer, 1000)
            timerStarted = true;
        }
        console.log('tapped ' + evt.target.nodeName)
        flipCard()
    }
    
        
    function flipCard() {
        if (evt.target.classList.contains('flip') == false) {
            evt.target.classList.add("flip");
            flpd.push(evt.target)
        }
        else {
            evt.target.classList.remove("flip");
            flpd.splice(flpd.indexOf(evt.target), 1)
        }
        if (flpd.length == 2) {
            checkMatch();
        }
    }
})

window.onclick = (evt) => {
    if (evt.target == modal) {
      modal.style.display = "none";
    }
}

rld.onclick = (evt) => {
    location.reload();
}

