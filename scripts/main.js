let images = 24;
let gameSize = 48;
let folder = 'images';
let cardStyle = 'junior';
let cardSize = 'large';

dealCards();

function dealCards() {
	images = sequence(1,images);
	images = shuffle(images);
	images = images.slice(0,gameSize/2);
	images = images.concat(images);
	images = shuffle(images);
	let grid = document.createElement('ul')
	grid.classList.add(cardSize);
	grid.classList.add('grid');
	for (let i = 0; i < gameSize; i++) {
		let card = document.createElement('li');
		card.classList.add('card');
		card.classList.add(cardStyle);
		let front = document.createElement('div');
		front.classList.add('front');
		front.style.backgroundImage = 'url("./'+folder+'/'+images[i]+'.jpg")';
		let back = document.createElement('div');
		back.classList.add('back');
		back.style.backgroundImage = 'url("./'+folder+'/'+ 'bg.jpg")';
		card.addEventListener('click', chooseCard);
		card.appendChild(back);
		card.appendChild(front);
		grid.appendChild(card);
	}
	document.getElementById('table').appendChild(grid);
}

let firstChoice = null;
let secondChoice = null;

function chooseCard(event) {
	if (firstChoice == null && this.classList.contains('flipped') != true) {
		firstChoice = this;
		flipCard(this);
	} else if (secondChoice == null && this.classList.contains('flipped') != true) {
		secondChoice = this;
		flipCard(this);
		if (firstChoice.lastChild.style.backgroundImage == secondChoice.lastChild.style.backgroundImage) {
			firstChoice.classList.add('found');
			secondChoice.classList.add('found');
			firstChoice = null;
			secondChoice = null;
		} 
	} else if (this.classList.contains('flipped') != true) {
			flipCard(firstChoice);
			flipCard(secondChoice);
			firstChoice = null;
			secondChoice = null;
			flipCard(this);
			firstChoice = this;
	}
}

function flipCard(card) {
	if (card.classList.contains('flipped') == false) {
		card.classList.add('flipped');
		card.style.transform = 'rotateY(180deg)';
	} else {
		card.classList.remove('flipped');
		card.style.transform = 'rotateY(0deg)';
	}
}

function sequence(from, to) {
	let result = [];
	for (let i = from; i < to + 1; ++i) {
		result.push(i);
	}
	return result;
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}