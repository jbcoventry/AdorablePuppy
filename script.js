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

let picker = (array) =>
  array.splice(Math.floor(Math.random() * array.length), 1);

let numberGenerator = () => Math.floor(Math.random() * (30 - 10 + 1) + 10);

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
  }
}

let aPet = new Pet(randomCombined[0]);

console.log(randomCombined[0]);
