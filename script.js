"use strict";
const log = console.log;
const MINIMUM_TRAIT_VALUE = 5000;
const MAXIMUM_TRAIT_VALUE = 20000;
const NEW_PET_RATE = 5000;
const LOSE_CONDITION_DEATH_AMOUNT = 1;
const WIN_CONDITION_PET_COUNT = 4;
const ACCEPTABLE_CLICK_THRESHOLD = 2500;
const ANIMAL_LIST = [
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
const ADJECTIVE_LIST = [
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
const TRAIT_LIST = ["feed", "clean", "play", "train"];

const returnRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const returnPetProperties = (petName) => {
    return {
        name: petName,
        feedTrait: returnRandomNumberBetween(MINIMUM_TRAIT_VALUE, MAXIMUM_TRAIT_VALUE),
        cleanTrait: returnRandomNumberBetween(MINIMUM_TRAIT_VALUE, MAXIMUM_TRAIT_VALUE),
        playTrait: returnRandomNumberBetween(MINIMUM_TRAIT_VALUE, MAXIMUM_TRAIT_VALUE),
        trainTrait: returnRandomNumberBetween(MINIMUM_TRAIT_VALUE, MAXIMUM_TRAIT_VALUE),
        feedStart: null,
        cleanStart: null,
        playStart: null,
        trainStart: null,
        feedCurrent: null,
        cleanCurrent: null,
        playCurrent: null,
        trainCurrent: null,
        deathReason: null,
    };
};

const returnShuffledArray = (toBeShuffled) => {
    return toBeShuffled
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

const returnCombinedLists = (adjectiveList, animalList) => {
    return adjectiveList.slice(0, animalList.length).map(function (value, index) {
        return value + " " + animalList[index];
    });
};

const returnPetObjects = (adjectiveList, animalList) => {
    return returnCombinedLists(
        returnShuffledArray(adjectiveList),
        returnShuffledArray(animalList)
    ).map(returnPetProperties);
};

const PET_ARRAY = returnPetObjects(ADJECTIVE_LIST, ANIMAL_LIST);
const returnPetDiv = (petIndex) => {
    const petDiv = document.createElement("div");
    const petHeading = document.createElement("div");
    petDiv.id = `pet-div-${petIndex}`;
    petHeading.id = `pet-heading-${petIndex}`;
    petDiv.className = "pet-div";
    petHeading.className = "pet-heading";
    petDiv.dataset.petIndex = petIndex;
    petHeading.textContent = `${PET_ARRAY[petIndex].name}`;
    petDiv.append(petHeading);
    TRAIT_LIST.forEach((trait) => petDiv.append(returnTraitBar(trait, petIndex)));
    return petDiv;
};
const returnTraitBar = (trait, petIndex) => {
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

const endGame = (endCondition) => {
    document.getElementById("pet-pen").style.display = "none";
    PET_ARRAY.forEach((element) => {
        if (!element.deathReason) {
            element.deathReason = "gameover";
        }
    });
    document.body.append(returnEndGameScreen(endCondition));
};
const returnEndGameScreen = (endCondition) => {
    const deadpets = PET_ARRAY.filter(
        (pet) => pet.deathReason != null && pet.deathReason != "gameover"
    );
    const main = document.createElement("div");
    const heading = document.createElement("div");
    const body = document.createElement("div");
    main.id = "end-game-div";
    heading.id = "end-game-heading";
    body.id = "end-game-body";
    if (endCondition == "win") {
        heading.textContent = "Congratulation!";
        body.textContent = "You kept all of your pets alive";
    } else {
        heading.textContent = "Game Over";
        body.innerHTML = `
        You let 
        `;
    }
    main.append(heading);
    main.append(body);
    return main;
};

const killPet = (petDiv, petObject, deathReason) => {
    petDiv.classList.add("dead");
    petObject.deathReason = deathReason;
    console.log(petObject.deathReason);
    if (document.querySelectorAll(".dead").length >= LOSE_CONDITION_DEATH_AMOUNT)
        endGame("lose");
};
const animateTraitBar = (trait, petIndex) => {
    const innerBarDiv = document.getElementById(`trait-bar-inner-${trait}-${petIndex}`);
    const outerBarDiv = document.getElementById(`trait-bar-outer-${trait}-${petIndex}`);
    const petDiv = document.getElementById(`pet-div-${petIndex}`);
    const petObject = PET_ARRAY[petIndex];
    const timeToTake = `${trait}Trait`;
    const startTime = `${trait}Start`;
    const currentRuntime = `${trait}Current`;
    const maxWidth = outerBarDiv.clientWidth;
    const animate = (timestamp) => {
        if (!petObject[startTime]) {
            petObject[startTime] = timestamp;
        }

        petObject[currentRuntime] = timestamp - petObject[startTime];
        const relativeProgress = petObject[currentRuntime] / petObject[timeToTake];

        if (maxWidth - maxWidth * relativeProgress > 1) {
            innerBarDiv.style.width = `${maxWidth - maxWidth * relativeProgress}px`;
        } else {
            innerBarDiv.style.width = "0px";
        }
        if (
            petObject[timeToTake] - petObject[currentRuntime] <=
                ACCEPTABLE_CLICK_THRESHOLD &&
            !innerBarDiv.classList.contains("green")
        ) {
            innerBarDiv.classList.add("green");
        }
        if (
            returnIfShouldDie(
                petObject[currentRuntime],
                petObject[timeToTake],
                "animation"
            )
        )
            killPet(petDiv, petObject, `toolittle${trait}`);

        if (!petObject.deathReason) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
};
const returnIfShouldDie = (currentRuntime, timeToTake, source) => {
    if (source == "animation") {
        return currentRuntime - ACCEPTABLE_CLICK_THRESHOLD > timeToTake ? true : false;
    } else if (source == "click") {
        return timeToTake - currentRuntime > ACCEPTABLE_CLICK_THRESHOLD ? true : false;
    }
};
const sendNewPetToDOM = () => {
    const totalCurrentPets = document.querySelectorAll(".pet-div").length;
    const totalDeadPets = document.querySelectorAll(".dead").length;
    if (totalCurrentPets - totalDeadPets >= WIN_CONDITION_PET_COUNT) {
        gameOver("win");
    }
    document.getElementById("pet-pen").append(returnPetDiv(totalCurrentPets));
    TRAIT_LIST.forEach((trait) => animateTraitBar(trait, totalCurrentPets));
    if (totalCurrentPets < PET_ARRAY.length - 1)
        setTimeout(sendNewPetToDOM, NEW_PET_RATE);
};

document.addEventListener("click", (event) => {
    if (event.target.matches("#start-button")) {
        startButtonClicked(event.target);
    }
    if (
        event.target.matches(".trait-bar-inner") ||
        event.target.matches(".trait-bar-outer")
    ) {
        traitBarClicked(event);
    }
});
const startButtonClicked = (button) => {
    button.remove();
    sendNewPetToDOM();
    // endGame();
};
const traitBarClicked = (event) => {
    const petDiv = event.target.matches(".trait-bar-inner")
        ? event.target.parentElement.parentElement
        : event.target.parentElement;
    const trait = event.target.matches(".trait-bar-inner")
        ? event.target.dataset.trait
        : event.target.firstElementChild.dataset.trait;
    const petIndex = petDiv.dataset.petIndex;
    const innerDiv = document.getElementById(`trait-bar-inner-${trait}-${petIndex}`);
    if (returnIfShouldDie(petIndex, trait, "click"))
        killPet(petDiv, petIndex, `toomuch${trait}`);
    resetTraitBar(petIndex, trait, innerDiv);
};
const resetTraitBar = (petIndex, trait, innerDiv) => {
    PET_ARRAY[petIndex][`${trait}Start`] = 0;
    innerDiv.classList.remove("green");
    innerDiv.style.width = `${innerDiv.parentElement.clientWidth}px`;
};
