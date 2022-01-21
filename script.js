"use strict";

const petList = [
  "Kitten",
  "Whale",
  "Tarantula",
  "Emu",
  "Worms",
  "Hamster",
  "Rock",
  "Cow",
  "Horse",
  "Pig",
  "Capybara",
];

const adjectives = [
  "Fetching",
  "Cute",
  "Goofy",
  "Cheeky",
  "Rambunctious",
  "Kindhearted",
  "Huggable",
  "Mischievous",
  "Jolly",
  "'Big Boned'",
  "Tiny",
  "Sleepy",
  "Slimey",
];
let randomAdjList = [];
let randompetList = [];
let randomCombined = [];
let pets = {};

let picker = (array) =>
  array.splice(Math.floor(Math.random() * array.length), 1);

let numberGenerator = () => Math.floor(Math.random() * (10 - 3 + 1) + 3);

let listMaker = (inList, outList) => {
  while (inList.length) {
    outList.push(picker(inList));
  }
};

listMaker(adjectives, randomAdjList);
listMaker(petList, randompetList);

let listCombiner = () => {
  for (let i = 0; i < randomAdjList.length && i < randompetList.length; i++) {
    randomCombined.push(randomAdjList[i] + " " + randompetList[i]);
  }
};

listCombiner();

class Pet {
  constructor(name) {
    this.name = name;
    this.feedNeed = numberGenerator();
    this.cleanNeed = numberGenerator();
    this.petNeed = numberGenerator();
    this.trainNeed = numberGenerator();
    this.feedCount = this.feedNeed;
    this.cleanCount = this.cleanNeed;
    this.petCount = this.petNeed;
    this.trainCount = this.feedNeed;
  }
}

pets[1] = new Pet("Adorable Puppy");

for (let i = 2; i < 10; i++) {
  pets[i] = new Pet(randomCombined[i]);
}

let counter = 1;
let start = () => {
  let petGetter = document.createElement("div");
  petGetter.className = "petBox";
  petGetter.innerHTML = pets[counter].name;

  petpen.append(petGetter);
  counter++;
};

let timedRelease = () => setInterval(start, 300);

startButton.addEventListener("click", timedRelease);
startButton.addEventListener("click", startButton.remove);
