/*
 * Create a list that holds all of your cards
 */
var icons = [
    'bomb', 'bomb', 
    'diamond', 'diamond', 
    'bicycle', 'bicycle', 
    'hand-spock-o', 'hand-spock-o', 
    'bug', 'bug',
    'beer', 'beer',
    'anchor', 'anchor',
    'android', 'android'
];
var opened = []; //stores the cards
var match = 0;
var $scorePanel = document.querySelector('.score-panel');
var moves = 0; //counts if two cards are opened
var moveCount = document.querySelector('.moves'); //Counter for moves
var currentSeconds; 
var second = 0; //reset for seconds
var timer = document.querySelector('.time'); //Counter for time in seconds
var ratingStars = document.querySelectorAll('.fa-star'); //stars that can be achieved, depending on number of moves
var gameboard = document.querySelector('.gameboard'); 
var stars3 = 12; 
var stars2 = 18;
var star1 = 25;
var allCardsOpen = icons.length / 2; //16 cards - means 8 matches for success -> 16/2=8
var successDelay = 500;
var reset = document.querySelector('.restart');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
var init = () => {
    var cards = shuffle(icons);
    gameboard.innerHTML = '';
    generateCards(icons);
    match = 0;
    moves = 0;
    moveCount.innerHTML = ('0');
    ratingStars.forEach(card => {
        card.classList.remove('fa-star-o');
    });
    addCardListener();
    second = 0;
    resetTimer(currentSeconds);
    timer.innerHTML = (`${second}`);
    startTimer();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Generate all Cards with shuffled Icons
const generateCards = (array) => {
    for(var i = 0; i < array.length; i++) {
        var card = gameboard.appendChild(document.createElement('li'));
        card.classList.add('card');
        card.innerHTML = '<i class="fa fa-'+icons[i]+'"></i>';
    };
}

// Handle Timer - restart when page is loaded
const startTimer = () => {
    currentSeconds = setInterval(handleSeconds, 1000);
}

const handleSeconds = () => {
    timer.innerHTML = second;
    second = second + 1;
}

const resetTimer = (seconds) => {
    if(seconds) {
        clearInterval(seconds);
    }
}

//Handle Rating
const handleRating = (moves) => {
    var rates = 3;
    if(moves > stars3 && moves < stars2) {
        ratingStars[2].classList.add('fa-star-o');
        rates = 2;
    } else if (moves > stars2 && moves < star1) {
        ratingStars[2].classList.add('fa-star-o');
        ratingStars[1].classList.add('fa-star-o');
        rates = 1;
    } else if (moves > star1) {
        ratingStars[2].classList.add('fa-star-o');
        ratingStars[1].classList.add('fa-star-o');
        ratingStars[0].classList.add('fa-star-o');
        rates = 0;
    }
    return { score: rates };
}

// Handle Clicks = 2 clicks = 1 move
const addCardListener = () => {
    var cards = gameboard.querySelectorAll('.card');
    cards.forEach(handleCards);
};

const handleCards = (card) => {
    card.addEventListener('click', function () {
        if(this.classList.contains('show') || this.classList.contains('match')) {
            return true;
        }
        
        var openCard = this.innerHTML;
        this.classList.add('open', 'show');
        opened.push(openCard);

        if(opened.length > 1) {
            if(openCard === opened[0]) {
                var cardsOpen = gameboard.querySelectorAll('.open');

                cardsOpen.forEach((card) => {
                    card.classList.add('match', 'animated', 'tada');
                });

                setTimeout(function() {
                    var cardsMatch = gameboard.querySelectorAll('.match');
                    cardsMatch.forEach((card) => {
                        card.classList.remove('open', 'show', 'animated', 'tada');
                    });
                }, successDelay);
                match++;
            } else {
                var cardsOpen = gameboard.querySelectorAll('.open');
                cardsOpen.forEach((card) => {
                    card.classList.remove('nomatch');
                    setTimeout(function() {
                        card.classList.remove('open', 'show');
                    }, successDelay);
                });
            }
            opened = [];
            moves++;
            handleRating(moves);
            moveCount.innerHTML = moves;
        }
        if (allCardsOpen === match) {
            handleRating(moves);
            var score = handleRating(moves).score;
            setTimeout(function () {
                winningPopUp(moves, score);
            }, 500);
        }
    });
};

// Game Winner Popup Box via Sweetalert2.js
const winningPopUp = (moves, moveCount) => {
    var title;
    if (moves < stars3) {
        title = "Herzlichen Glückwunsch! \nDu hast gewonnen!";
    } else if (moves > stars3 && moves < stars2) {
        title = "Du warst nahe dran! \nVersuch es gleich nochmal!";
    } else if (moves > stars2 && moves < star1) {
        title = "Das hätte besser laufen können! \n Gib nicht auf!";
    } else {
        title = "Schade, zu viele Züge \n Versuch es erneut!";
    }

    swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: title,
		text: 'Mit ' + moves + ' Zügen und ' + moveCount + ' Sternen in ' + second + ' Sekunden.',
		type: 'success',
		confirmButtonColor: '#7a43a4',
		confirmButtonText: 'Nochmal spielen!'
	}).then(function (clickConfirm) {
		if (clickConfirm) {
			init();
		}
    });
}

//Restart Game Popup via Sweetalert2.js
const restartingPopUp = () => {
    swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
        title: "Huch, was ist los?",
        text: "Starte jetzt neu!",
		confirmButtonColor: '#7a43a4',
        confirmButtonText: "Oh ja! Los geht's!",
	}).then(function (clickConfirm) {
		if (clickConfirm) {
			init();
		}
	})
}
reset.addEventListener('click', restartingPopUp);

init();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
