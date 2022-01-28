"use strict";

let barAnimator = (parentDiv, childDiv, statMax) => {
  let parent = document.getElementById(parentDiv);
  let parentStyle = getComputedStyle(parent);
  let parentWidth = parseInt(parentStyle.width);
  const parentWidthPercent = parentWidth / 100;
  let child = document.getElementById(childDiv);
  let reducedBy = 0;

  let barReducer = () => {
    if (parentWidth > reducedBy) {
      child.style.width = parentWidth - reducedBy + "px";
      reducedBy += parentWidthPercent/ statMax;
    } else {
      child.style.width = 0;
      clearInterval(reduceRepeater);
    }
  };

  let reduceRepeater = setInterval(barReducer, 10);

  parent.onclick = () => {
    clearInterval(reduceRepeater);
    reduceRepeater = setInterval(barReducer, 10);
    child.style.width = parentWidth + "px";
    reducedBy = 0;
  };
};
let barMaker = (stat) => {
  let statBarParent = document.createElement("div");
  statBarParent.className = "barParent";
  statBarParent.id = "statBarParent"+stat+counter;
  document.getElementById("petDiv"+counter).append(statBarParent);
  let statBarChild = document.createElement("div");
  statBarChild.className = "barChild";
  statBarChild.id = "statBarChild" + stat+ counter;
  statBarParent.append(statBarChild);
  }
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

for (let i = 2; i < 6; i++) {
  pets[i] = new Pet(randomCombined[i]);
}

let counter = 1;
let start = () => {
  let petDivVariable = document.createElement("div");
  petDivVariable.className = "petDiv";
  petDivVariable.id = "petDiv" + counter;
  petDivVariable.innerHTML = pets[counter].name;
  document.getElementById("petPen").append(petDivVariable);
  barMaker("Feed");
  barAnimator("statBarParentFeed"+counter,"statBarChildFeed"+counter,pets[counter].feedNeed);
  barMaker("Clean");
  barAnimator("statBarParentClean"+counter,"statBarChildClean"+counter,pets[counter].cleanNeed);
  barMaker("Pet");
  barAnimator("statBarParentPet"+counter,"statBarChildPet"+counter,pets[counter].petNeed);
  barMaker("Train");
  barAnimator("statBarParentTrain"+counter,"statBarChildTrain"+counter,pets[counter].trainNeed);

  counter++;
  if (counter > 5) {
    clearInterval(intervalVariable);
  }
};

let intervalVariable;
let timedRelease = () => (intervalVariable = setInterval(start, 2000));

startButton.addEventListener("click", timedRelease);
startButton.addEventListener("click", startButton.remove);

