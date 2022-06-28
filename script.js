"use strict";
const minPossibleTraitValue = 5000;
const maxPossibleTraitValue = 20000;
const newPetRate = 1000000000;
const loseConditionDeathCount = 100;
const acceptableClickThreshold = 2500;
const animalList = [
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
const adjectiveList = [
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

const createRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const createPetProperties = (petName) => {
    return {
        name: petName,
        traitFeed: createRandomNumberBetween(
            minPossibleTraitValue,
            maxPossibleTraitValue
        ),
        traitClean: createRandomNumberBetween(
            minPossibleTraitValue,
            maxPossibleTraitValue
        ),
        traitPlay: createRandomNumberBetween(
            minPossibleTraitValue,
            maxPossibleTraitValue
        ),
        traitTrain: createRandomNumberBetween(
            minPossibleTraitValue,
            maxPossibleTraitValue
        ),
        deathReason: null,
    };
};

const shuffleArray = (toBeShuffled) =>
    toBeShuffled
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

const combineAnimalListAndAdjectiveList = (adjectiveList, animalList) => {
    return adjectiveList.slice(0, animalList.length).map(function (value, index) {
        return value + " " + animalList[index];
    });
};

const createPetObjects = (adjectiveList, animalList) => {
    return combineAnimalListAndAdjectiveList(
        shuffleArray(adjectiveList),
        shuffleArray(animalList)
    ).map(createPetProperties);
};

const petArray = createPetObjects(adjectiveList, animalList);
const createPetDiv = (petIndex) => {
    const petDiv = document.createElement("div");
    petDiv.className = "pet-div";
    petDiv.id = `pet-div-${petIndex}`;
    petDiv.dataset.petIndex = petIndex;
    const petHeading = document.createElement("div");
    petHeading.className = "pet-heading";
    petHeading.id = `pet-heading-${petIndex}`;
    petHeading.textContent = `${petArray[petIndex].name}`;
    petDiv.append(petHeading);
    petDiv.append(createTraitBar("feed", petIndex));
    petDiv.append(createTraitBar("clean", petIndex));
    petDiv.append(createTraitBar("play", petIndex));
    petDiv.append(createTraitBar("train", petIndex));
    return petDiv;
};
const createTraitBar = (trait, petIndex) => {
    const traitBarOuter = document.createElement("div");
    traitBarOuter.className = "trait-bar-outer";
    traitBarOuter.id = `trait-bar-outer-${trait}-${petIndex}`;
    const traitBarInner = document.createElement("div");
    traitBarInner.className = "trait-bar-inner";
    traitBarInner.id = `trait-bar-inner-${trait}-${petIndex}`;
    traitBarInner.dataset.trait = trait;
    traitBarOuter.append(traitBarInner);
    return traitBarOuter;
};

const endTheGame = () => {
    console.log("game over");
};

const killPet = (petDiv, petObject, deathReason) => {
    petDiv.style.backgroundColor = "red";
    // petDiv.classList.add("dead");
    // petObject.deathReason = deathReason;
    // if (document.querySelectorAll(".dead").length >= loseConditionDeathCount)
    //     endTheGame();
};
const animateTraitBar = (trait, petIndex) => {
    const innerBarDiv = document.getElementById(`trait-bar-inner-${trait}-${petIndex}`);
    const outerBarDiv = document.getElementById(`trait-bar-outer-${trait}-${petIndex}`);
    const petDiv = document.getElementById(`pet-div-${petIndex}`);
    const petObject = petArray[petIndex];
    const objectTraitName = `trait${trait[0].toUpperCase()}${trait.substring(1)}`;
    const test = "traitClean"
    const timeToTake = petObject[objectTraitName];
    let starttime = null;
    let currentRuntime = 0;
    const maxWidth = outerBarDiv.clientWidth;

    outerBarDiv.addEventListener("click", (event) => {
        if (checkIfUnderTime(currentRuntime, timeToTake))
            killPet(petDiv, petObject, `toomuch${trait}`);
        innerBarDiv.style.width = `${maxWidth}px`;
        innerBarDiv.style.backgroundColor = "blue";
        starttime = null;
    });
    function animate(timestamp) {
        if (!starttime) {
            starttime = timestamp;
        }

        currentRuntime = timestamp - starttime;
        const relativeProgress = currentRuntime / timeToTake;
        
        innerBarDiv.style.width = `${maxWidth - maxWidth * relativeProgress}px`;
        if (innerBarDiv.clientWidth < 1) {
            innerBarDiv.style.width = "0px";
        }
        if (timeToTake - currentRuntime <= acceptableClickThreshold) {
            innerBarDiv.style.backgroundColor = "green";
        }
        if (checkIfOverTime(currentRuntime, timeToTake))
            killPet(petDiv, petObject, `toolittle${trait}`);

        if (!petObject.deathReason) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
};
const checkIfOverTime = (currentRuntime, timeToTake) => {
    return currentRuntime - acceptableClickThreshold > timeToTake ? true : false;
};
const checkIfUnderTime = (currentRuntime, timeToTake) => {
    return timeToTake - currentRuntime > acceptableClickThreshold ? true : false;
};
const sendNewPetToDOM = () => {
    const totalCurrentPets = document.getElementById("pet-pen").childElementCount;
    document.getElementById("pet-pen").append(createPetDiv(totalCurrentPets));
    animateTraitBar("feed", totalCurrentPets);
    animateTraitBar("clean", totalCurrentPets);
    animateTraitBar("play", totalCurrentPets);
    animateTraitBar("train", totalCurrentPets);
    if (totalCurrentPets < petArray.length - 1) setTimeout(sendNewPetToDOM, newPetRate);
};

document.addEventListener("click", (event) => {
    if (event.target.matches("#start-button")) {
        sendNewPetToDOM();
        event.target.remove();
    }
});
