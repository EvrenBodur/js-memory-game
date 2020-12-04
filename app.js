const container = document.querySelector(".container");

const deck = [
  { id: 0, img: "./images/back.png" },
  { id: 1, img: "./images/1.png" },
  { id: 2, img: "./images/2.png" },
  { id: 3, img: "./images/3.png" },
  { id: 4, img: "./images/4.png" },
  { id: 5, img: "./images/5.png" },
  { id: 6, img: "./images/6.png" },
  { id: 7, img: "./images/7.png" },
  { id: 8, img: "./images/8.png" },
  { id: 9, img: "./images/9.png" },
];

class ShuffleDeck {
  constructor(arr) {
    this.arr = [...arr, ...arr];
  }
  shuffle() {
    for (let i = this.arr.length - 1; i > 0; i--) {
      let random = Math.floor(Math.random() * (i + 1));
      let temp = this.arr[i];
      this.arr[i] = this.arr[random];
      this.arr[random] = temp;
    }
    return this.arr;
  }
}

class Board {
  constructor(deck) {
    this.deck = deck;
  }
  create() {
    const board = document.createElement("div");
    board.className = "board";
    container.append(board);
    this.deck.map((item) => {
      if (item.id !== 0) {
        const newCard = new Card(item);
        board.append(newCard.create());
      }
    });
    const scoreBoard = document.createElement("div");
    scoreBoard.className = "scoreBoard";
    container.append(scoreBoard);
    const scoreTitle = document.createElement("div");
    scoreTitle.className = "scoreTitle";
    scoreTitle.innerText = "Score";
    scoreBoard.append(scoreTitle);
    const score = document.createElement("div");
    score.className = "score";
    score.innerText = 0;
    scoreBoard.append(score);
    const timer = document.createElement("div");
    timer.className = "timer";
    container.append(timer);
  }
}

class Card {
  constructor(item) {
    this.item = item;
    this.clickHandle = this.clickHandle.bind(this);
  }
  create() {
    const card = document.createElement("div");
    card.className = "card";
    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";
    cardInner.setAttribute("id", this.item.id);
    card.append(cardInner);
    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    const cardFrontImage = document.createElement("img");
    cardFrontImage.src = "./images/back.png";
    cardFront.append(cardFrontImage);
    cardInner.append(cardFront);
    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    const cardBackImage = document.createElement("img");
    cardBackImage.src = this.item.img;
    cardBack.append(cardBackImage);
    cardInner.append(cardBack);
    cardInner.addEventListener("click", this.clickHandle);

    return card;
  }

  clickHandle(e) {
    e.target.parentNode.parentNode.classList.add("selected");
    newGame.validation(this.item.id, e, this.clickHandle);
  }
}

class Game {
  constructor() {
    this.shuffledDeck = new ShuffleDeck(deck);
    this.board = new Board(this.shuffledDeck.shuffle());
    this.selectedCards = [];
    this.score = 0;
  }
  start() {
    this.board.create();
    const start = document.querySelectorAll(".card-inner");
    const timerElement = document.querySelector(".timer");
    const scoreBoard = document.querySelector(".scoreBoard");
    let count = 10;

    setTimeout(() => {
      start.forEach((el) => {
        el.classList.add("selected");
      });
      const timer = setInterval(() => {
        if (count >= 0) {
          timerElement.innerText = count;
          count--;
        } else {
          clearInterval(timer);
          timerElement.innerText = "";
          timerElement.style.zIndex = -1;
          scoreBoard.style.display = "block";
        }
      }, 1000);
    }, 500);

    setTimeout(() => {
      start.forEach((el) => {
        el.classList.remove("selected");
      });
    }, 11500);
  }

  validation(id, e, eventHandler) {
    const scr = document.querySelector(".score");
    this.selectedCards.push(id);
    e.target.parentNode.parentNode.style.pointerEvents = "none";

    if (this.selectedCards[0] === this.selectedCards[1]) {
      document.querySelectorAll(".selected").forEach((el) => {
        el.classList.remove("selected");
        el.classList.add("validated");
      });
      this.score += 100;
      scr.innerText = this.score;
      this.selectedCards = [];
    } else if (
      this.selectedCards.length === 2 &&
      this.selectedCards[0] !== this.selectedCards[1]
    ) {
      document
        .querySelectorAll(".card-inner")
        .forEach((el) => (el.style.pointerEvents = "none"));
      this.score -= 25;
      scr.innerText = this.score;

      setTimeout(() => {
        document.querySelectorAll(".selected").forEach((el) => {
          el.classList.remove("selected");
          el.style.pointerEvents = "auto";
          document
            .querySelectorAll(".card-inner")
            .forEach((el) => (el.style.pointerEvents = "auto"));
        });
      }, 1000);
      this.selectedCards = [];
    }

    document
      .querySelectorAll(".validated")
      .forEach((el) => el.removeEventListener("click", eventHandler));
  }
}

const newGame = new Game();
newGame.start();
