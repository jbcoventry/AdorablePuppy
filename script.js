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

let picker = (array) =>
  array.splice(Math.floor(Math.random() * adjectives.length), 1);

let randomAdjList = [];
for (let i = 0; i < petList.length - 1; i++) {
  randomAdjList.push(picker(adjectives));
}

picker(adjectives);
let generatedPetNames = picker(petList);
