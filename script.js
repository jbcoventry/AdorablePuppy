"use strict";
const minPossibleTraitValue = 5000;
const maxPossibleTraitValue = 20000;
const newPetRate = 10000;
const animals = [
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
    "Puppy",
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
    "Adorable",
];

const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const createPetValues = (petName) => {
    return {
        name: petName,
        traitFeed: randomNumberBetween(minPossibleTraitValue, maxPossibleTraitValue),
        traitClean: randomNumberBetween(minPossibleTraitValue, maxPossibleTraitValue),
        traitPlay: randomNumberBetween(minPossibleTraitValue, maxPossibleTraitValue),
        traitTrain: randomNumberBetween(minPossibleTraitValue, maxPossibleTraitValue),
        traitFeedLast: null,
        traitCleanLast: null,
        traitPlayLast: null,
        traitTrainLast: null,
    };
};

const shuffleArray = (toBeShuffled) =>
    toBeShuffled
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

const adjectiveAnimalCombiner = (adjectives, animals) => {
    return adjectives.slice(0, animals.length).map(function (value, index) {
        return value + " " + animals[index];
    });
};

const petsMaker = (adjectives, animals) => {
    return adjectiveAnimalCombiner(shuffleArray(adjectives), shuffleArray(animals)).map(
        createPetValues
    );
};

const pets = petsMaker(adjectives, animals);
const petDivMaker = (petsList, petsListPosition) => {
    const petDiv = document.createElement("div");
    petDiv.className = "pet-div";
    petDiv.id = `pet-div-${petsListPosition}`;
    const petHeading = document.createElement("div");
    petHeading.className = "pet-heading";
    petHeading.id = `pet-heading-${petsListPosition}`;
    petHeading.textContent = `${petsList[petsListPosition].name}`;
    petDiv.append(petHeading);
    petDiv.append(traitBarMaker("feed", petsListPosition));
    petDiv.append(traitBarMaker("clean", petsListPosition));
    petDiv.append(traitBarMaker("play", petsListPosition));
    petDiv.append(traitBarMaker("train", petsListPosition));
    return petDiv;
};
const traitBarMaker = (trait, petsListPosition) => {
    const traitBarOuter = document.createElement("div");
    traitBarOuter.className = "trait-bar-outer";
    traitBarOuter.id = `trait-bar-outer-${trait}-${petsListPosition}`;
    const traitBarInner = document.createElement("div");
    traitBarInner.className = "trait-bar-inner";
    traitBarInner.id = `trait-bar-inner-${trait}-${petsListPosition}`;
    traitBarOuter.append(traitBarInner);
    return traitBarOuter;
};

const barAnimator = (durationInMS, progressBarInnerDivID) => {
    const innerDiv = document.getElementById(progressBarInnerDivID);
    let starttime = null;
    const maxWidth = innerDiv.parentElement.clientWidth;
    innerDiv.parentElement.addEventListener("click", (event) => {
        innerDiv.style.width = `${maxWidth}px`;
        starttime = null;

    });
    function animate(timestamp) {
        if (!starttime) {
            starttime = timestamp;
        }

        const runtime = timestamp - starttime;
        const relativeProgress = runtime / durationInMS;

        innerDiv.style.width = `${maxWidth - maxWidth * relativeProgress}px`;
        if (innerDiv.clientWidth < 1){
            innerDiv.style.width = "0px";
        }
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};

const newPetToDOM = () => {
    const totalPets = document.getElementById("pet-pen").childElementCount;
    document.getElementById("pet-pen").append(petDivMaker(pets, totalPets));
    barAnimator(pets[totalPets].traitFeed, `trait-bar-inner-feed-${totalPets}`);
    barAnimator(pets[totalPets].traitClean, `trait-bar-inner-clean-${totalPets}`);
    barAnimator(pets[totalPets].traitPlay, `trait-bar-inner-play-${totalPets}`);
    barAnimator(pets[totalPets].traitTrain, `trait-bar-inner-train-${totalPets}`);
    setTimeout(newPetToDOM, newPetRate);
};

document.addEventListener("click", (event) => {
    if (event.target.matches("#start-button")) {
        newPetToDOM();
        event.target.remove();
    }
});
