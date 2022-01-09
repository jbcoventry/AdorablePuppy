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

let listCombiner = (firstList, secondList) => {
  if (firstList.length <= secondList.length) {
    randomCombined.push(
      firstList.map((item, index) => item + " " + secondList[index])
    );
  } else {
    randomCombined.push(
      secondList.map((item, index) => firstList[index] + " " + item)
    );
  }
};
listCombiner(randomAdjList, randompetList);

console.log(randomAdjList);
console.log(randompetList);
console.log(randomCombined);
console.log(numberGenerator);
