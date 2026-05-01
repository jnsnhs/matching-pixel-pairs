const imgDir = "./images";
const parentElement = document.getElementById("game");

class Utils {
  static getShuffledArray(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}

class Game {
  constructor(numberOfCards, debugMode = false) {
    this.numberOfCards = numberOfCards;
    this.roundsPlayed = 0;
    this.debugMode = debugMode;
    this.firstChoiceCard = null;
    this.secondChoiceCard = null;
    this.listOfimageUrls = this.setListOfimageUrls(numberOfCards);
    if (debugMode) {
      this.displayDebugInfo();
    }
  }
  setListOfimageUrls(numberOfCards) {
    let imageUrls = [];
    for (let i = 0; i < numberOfCards / 2; i++) {
      let fileName = `${i + 1}.jpg`;
      imageUrls.push(fileName);
    }
    return Utils.getShuffledArray([...imageUrls, ...imageUrls]);
  }
  createCards() {
    let grid = document.createElement("ul");
    grid.classList.add("grid");
    for (let i = 0; i < this.numberOfCards; i++) {
      let card = document.createElement("li");
      card.classList.add("card");
      let front = document.createElement("div");
      front.classList.add("front");
      front.style.backgroundImage =
        'url("' + imgDir + "/" + this.listOfimageUrls[i] + '")';
      let back = document.createElement("div");
      back.classList.add("back");
      card.addEventListener("click", () => {
        this.chooseCard(card);
      });
      card.appendChild(back);
      card.appendChild(front);
      grid.appendChild(card);
    }
    parentElement.appendChild(grid);
  }
  chooseCard(clickedCard) {
    let isCardCovered = !clickedCard.classList.contains("uncovered");
    console.log(isCardCovered);
    if (!this.firstChoiceCard && isCardCovered) {
      this.roundsPlayed++;
      this.firstChoiceCard = clickedCard;
      this.flipCard(clickedCard);
    } else if (!this.secondChoiceCard && isCardCovered) {
      this.secondChoiceCard = clickedCard;
      this.flipCard(clickedCard);
      if (
        this.firstChoiceCard.lastChild.style.backgroundImage ==
        this.secondChoiceCard.lastChild.style.backgroundImage
      ) {
        this.firstChoiceCard.classList.add("found");
        this.secondChoiceCard.classList.add("found");
        this.firstChoiceCard = null;
        this.secondChoiceCard = null;
      }
    } else if (isCardCovered) {
      this.flipCard(this.firstChoiceCard);
      this.flipCard(this.secondChoiceCard);
      this.firstChoiceCard = null;
      this.secondChoiceCard = null;
      this.firstChoiceCard = clickedCard;
      this.flipCard(clickedCard);
    }
    if (this.debugMode) {
      this.displayDebugInfo();
    }
  }
  flipCard(cardElement) {
  if (cardElement.classList.contains("uncovered")) {
    cardElement.classList.remove("uncovered");
    // Replace with class:
    //cardElement.style.transform = "rotateY(0deg)";
  } else {
    cardElement.classList.add("uncovered");
    // Replace with class:
    //cardElement.style.transform = "rotateY(180deg)";
  }
}
  displayDebugInfo() {
    let debugContainer = document.getElementById("debug");
    if (!debugContainer) {
      debugContainer = document.createElement("div");
      debugContainer.id = "debug";
    }
    debugContainer.innerHTML = `Rounds played: ${this.roundsPlayed}`;
    document.body.appendChild(debugContainer);
  }
}

let game = new Game(48);
game.createCards();
