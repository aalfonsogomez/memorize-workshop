const pokemons = [1, 2, 3, 4, 5, 6, 7, 8];
const gameContainer = document.getElementById('game-container');
let allCards;
let currentCards;

const drawCards = () => {
    console.log(allCards);
    const fragment = document.createDocumentFragment();
    allCards.forEach(cardNumber => {
        const card = document.createElement('div');
        card.classList.add('card');
        const cardFront = document.createElement('div');
        cardFront.classList.add('card__front');
        const cardImage = document.createElement('img');
        cardImage.src = `assets/images/png/${cardNumber}.png`;
        cardImage.classList.add('card__img');
        cardFront.appendChild(cardImage);
        card.append(cardFront);
        const cardBack = document.createElement('div');
        cardBack.classList.add('card__back');
        card.appendChild(cardBack);
        fragment.appendChild(card);
    });
    gameContainer.appendChild(fragment);
};

const getRandomNumber = (max = 149) => Math.floor(Math.random() * max + 1);

const generatePokeCards = () => {
    currentCards = [...new Set(Array.from({length: 4}, () => getRandomNumber()))];
    allCards = [...currentCards, ...currentCards].sort(() => Math.random() - 0.5);
    currentCards.length < 4 ? generatePokeCards() : drawCards();
};


generatePokeCards();

gameContainer.addEventListener('click', e => {
    if (e.target.closest('.card') !== null) {
        e.target.parentElement.classList.add('card--show');
    }
});