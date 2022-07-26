const pokemons = [1, 2, 3, 4, 5, 6, 7, 8];
const gameContainer = document.getElementById('game-container');
const failElement = document.getElementById('fails-text');
const pointsElement = document.getElementById('points-text');
const comboElement = document.getElementById('combo-text');
const scoreboardElement = document.getElementById('scoreboard');
const modalElement = document.getElementById('modal');
const formElement = document.getElementById('form');
const modalWinElement = document.getElementById('modal-win');
const modalRestartElement = document.getElementById('modal-restart');
let allCards;
let firstSelection = undefined;
let secondSelection = undefined;
let fails = 0;
let canPlay = false;
let combo = 1;
let points = 0;
const ranking = [];
let rankingData = localStorage.getItem('rankingData');
let user = '';
let totalCards = 2;

const sortRankingData = () => {
    return JSON.parse(rankingData).sort((a, b) => b.points - a.points);
};

const drawRanking = rankingData => {
    rankingData = sortRankingData();
    scoreboardElement.textContent = '';
    const fragment = document.createDocumentFragment();
    for (position of rankingData) {
        const data = document.createElement('p');
        data.textContent = `${position.name} - ${position.points}`;
        fragment.appendChild(data);
    }
    scoreboardElement.appendChild(fragment);
};

const getDataFromLocalStorage = () => {
    if (!rankingData) {
        localStorage.setItem('rankingData', JSON.stringify(ranking));
    }
};

const saveUserData = (name, points) => {
    const newDataForLocalStorage = { name, points };
    rankingData = localStorage.getItem('rankingData');
    const oldLocalStorage = JSON.parse(rankingData);
    const newData =
        oldLocalStorage === [] || oldLocalStorage === null
            ? [newDataForLocalStorage]
            : [...oldLocalStorage, newDataForLocalStorage];
    localStorage.setItem('rankingData', JSON.stringify(newData));
    rankingData = localStorage.getItem('rankingData');
    drawRanking(newData);
};

const showAllCards = (allCardsElements) => {
    allCardsElements.forEach(card => {
        card.classList.add('card--show');
    });
};

const hideAllCards = (allCardsElements) => {
    allCardsElements.forEach(card => {
        card.classList.remove('card--show');
    });
    canPlay = true;
}

const drawCards = () => {
    gameContainer.textContent = '';
    const fragment = document.createDocumentFragment();
    allCards.forEach(cardNumber => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = cardNumber;
        card.dataset.pokewin = false;
        const cardBack = document.createElement('div');
        cardBack.classList.add('card__back');
        card.appendChild(cardBack);
        const cardFront = document.createElement('div');
        cardFront.classList.add('card__front');
        const cardImage = document.createElement('img');
        cardImage.src = `assets/images/png/${cardNumber}.png`;
        cardImage.classList.add('card__img');
        cardFront.appendChild(cardImage);
        card.appendChild(cardFront);
        fragment.appendChild(card);
    });
    gameContainer.appendChild(fragment);

    const allCardsElements = document.querySelectorAll('.card');
    setTimeout(() => showAllCards(allCardsElements), 1000)
    setTimeout(() => hideAllCards(allCardsElements), 3000)
    getDataFromLocalStorage();

};

const getRandomNumber = (max = 150) => Math.floor(Math.random() * max + 1);

const generatePokeCards = () => {
    currentCards = [...new Set(Array.from({ length: totalCards }, () => getRandomNumber()))];
    allCards = [...currentCards, ...currentCards].sort(() => Math.random() - 0.5);
    currentCards.length < totalCards ? generatePokeCards() : drawCards();
};

const hidePokeCards = (a, b) => {
    a.classList.remove('card--show');
    b.classList.remove('card--show');
};

const checkPokeWin = () => {
    const countPokeWins = document.querySelectorAll('.card[data-pokewin="true"]');
    if (countPokeWins.length === totalCards * 2) {
        saveUserData(user, points);
        modalWinElement.classList.add('modal-win--show');
        canPlay = false;
    }
};

const setPoints = (error = false) => {
    if (!error) {
        points = points + combo * 10;
        combo = combo + 1;
        pointsElement.textContent = `Total points: ${points}`;
    } else {
        combo = 1;
        fails = fails + 1;
        failElement.textContent = `Fails: ${fails}`;
    }
};

const setCardsSelected = (firstElementSelected, secondElementSelected) => {
    if (firstElementSelected.dataset.id === secondElementSelected.dataset.id) {
        firstElementSelected.dataset.pokewin = true;
        secondElementSelected.dataset.pokewin = true;
        setPoints();
        checkPokeWin();
    } else {
        secondElementSelected.addEventListener(
            'transitionend',
            () => hidePokeCards(firstElementSelected, secondElementSelected),
            { once: true }
        );
        setPoints(true)
    }
    comboElement.textContent = `X ${combo}`;
    firstSelection = undefined;
    secondSelection = undefined;
};

gameContainer.addEventListener('click', e => {
    if (canPlay) {
        if (e.target.parentElement.classList.contains('card') && e.target.parentElement.dataset.pokewin === 'false') {
            e.target.parentElement.classList.add('card--show');
            if (firstSelection === undefined) {
                firstSelection = e.target.parentElement;
            } else {
                if (firstSelection !== e.target.parentElement) {
                    secondSelection = e.target.parentElement;
                    setCardsSelected(firstSelection, secondSelection);
                }
            }
        }
    }
});

formElement.addEventListener('submit', e => {
    e.preventDefault();
    user = e.target.name.value;
    formElement.remove();
    generatePokeCards();
    modalElement.classList.remove('modal--show');
    drawRanking(JSON.parse(rankingData));
});

modalRestartElement.addEventListener('click', () => {
    generatePokeCards();
    modalWinElement.classList.remove('modal-win--show');
  });

window.addEventListener('load', e => {
    getDataFromLocalStorage();
    modalElement.classList.add('modal--show');
});