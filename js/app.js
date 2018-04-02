"use strict";

{
    /*
    * Create a list that holds all of your cards
    */
    let icons = [
        'bomb', 'bomb', 
        'diamond', 'diamond', 
        'bicycle', 'bicycle', 
        'hand-spock-o', 'hand-spock-o', 
        'bug', 'bug',
        'beer', 'beer',
        'anchor', 'anchor',
        'android', 'android'
    ];
    let opened = []; //stores the opened and matching cards
    let $scorePanel = document.querySelector('.score-panel');
    let moveCount = document.querySelector('.moves'); //Counter for moves
    let timer = document.querySelector('.time'); //Counter for time in seconds
    let ratingStars = document.querySelectorAll('.fa-star'); //stars that can be achieved, depending on number of moves
    let gameboard = document.querySelector('.gameboard'); 
    let stars3 = 12; 
    let stars2 = 18;
    let allCardsOpen = icons.length / 2; //16 cards - means 8 matches for success -> 16/2=8
    let successDelay = 500;
    let reset = document.querySelector('.restart');
    let second, currentSeconds, moves, match;

    /*
    * Display the cards on the page
    *   - shuffle the list of cards using the provided "shuffle" method below
    *   - loop through each card and create its HTML
    *   - add each card's HTML to the page
    */
    const init = () => {
        let cards = shuffle(icons);
        gameboard.innerHTML = '';
        generateCards(icons);
        match = 0; //counts if two matching cards (class match) are opened
        moves = 0; //counts if two cards are opened
        moveCount.innerHTML = ('0');
        ratingStars.forEach(card => {
            card.classList.remove('fa-star-o');
        });
        addCardListener();
        second = 0;
        resetTimer(currentSeconds);
    }

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

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
        for(let i = 0; i < array.length; i++) {
            let card = gameboard.appendChild(document.createElement('li'));
            card.classList.add('card');
            card.innerHTML = '<i class="fa fa-'+icons[i]+'"></i>';
        };
    }

    // Handle Timer - restart when page is loaded
    const startTimer = () => {
        currentSeconds = setInterval(() => {
            timer.innerHTML = second;
            second += 1;
        }, 1000);
    }

    const resetTimer = (second) => {
        if(second) {
            clearInterval(second);
            console.log(second);
            timer.innerHTML = 0;
        }
    }

    //Handle Rating
    const handleRating = (moves) => {
        let rates = 3;
        if(moves < 3){
            rates;
        } else if(moves > stars3 && moves < stars2) {
            ratingStars[2].classList.add('fa-star-o');
            rates = 2;
        } else if(moves > stars2) {
            ratingStars[2].classList.add('fa-star-o');
            ratingStars[1].classList.add('fa-star-o');
            rates = 1;
        }
        return { score: rates };
    }

    // Handle Clicks = 2 clicks = 1 move
    const addCardListener = () => {
        let cards = gameboard.querySelectorAll('.card');
        cards.forEach(handleCards);
    };

    const handleCards = (card) => {
        card.addEventListener('click', function () {
            if(moveCount === 1) {
                startTimer();
            }

            if(this.classList.contains('show') || this.classList.contains('match')) {
                return true;
            }
            
            let openCard = this.innerHTML;
            this.classList.add('open', 'show');
            opened.push(openCard);

            if(opened.length > 1) {
                if(openCard === opened[0]) {
                    let cardsOpen = gameboard.querySelectorAll('.open');

                    cardsOpen.forEach((card) => {
                        card.classList.add('match', 'animated', 'tada');
                    });

                    setTimeout(function() {
                        let cardsMatch = gameboard.querySelectorAll('.match');
                        cardsMatch.forEach((card) => {
                            card.classList.remove('open', 'show', 'animated', 'tada');
                        });
                    }, successDelay);
                    match++;
                } else {
                    let cardsOpen = gameboard.querySelectorAll('.open');
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
                console.log(moveCount);
            }
            if (allCardsOpen === match) {
                handleRating(moves);
                let score = handleRating(moves).score;
                setTimeout(function () {
                    winningPopUp(moves, score);
                }, 500);
            }
        });
    };

    // Game Winner Popup Box via Sweetalert2.js
    const winningPopUp = (moves, moveCount) => {
        let title;
        let stars;
        if (moves < stars3) {
            title = "Herzlichen Glückwunsch! \nDu hast gewonnen!";
            stars = "3 Sternen";
        } else if (moves > stars3 && moves < stars2) {
            title = "Du warst nahe dran! \nVersuch es gleich nochmal!";
            stars = "2 Sternen";
        } else if (moves > stars2) {
            title = "Das hätte besser laufen können! \n Gib nicht auf!";
            stars = "1 Stern";
        } 

        swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: title,
            text: 'Mit ' + moves + ' Zügen und ' + stars + ' in ' + second + ' Sekunden.',
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

}
