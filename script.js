"use strict";
const log = console.log;
const MINIMUM_TRAIT_VALUE = 5000;
const MAXIMUM_TRAIT_VALUE = 20000;
const NEW_PET_RATE = 5000;
const LOSE_CONDITION_DEATH_AMOUNT = 3;
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

const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const petProperties = (petName) => {
    return {
        name: petName,
        feedTrait: randomNumberBetween(MINIMUM_TRAIT_VALUE, MAXIMUM_TRAIT_VALUE),
        cleanTrait: randomNumberBetween(MINIMUM_TRAIT_VALUE, MAXIMUM_TRAIT_VALUE),
        playTrait: randomNumberBetween(MINIMUM_TRAIT_VALUE, MAXIMUM_TRAIT_VALUE),
        trainTrait: randomNumberBetween(MINIMUM_TRAIT_VALUE, MAXIMUM_TRAIT_VALUE),
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

const shuffledArray = (toBeShuffled) => {
    return toBeShuffled
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

const combinedLists = (adjectiveArray, animalArray) => {
    return adjectiveArray.slice(0, animalArray.length).map(function (value, index) {
        return value + " " + animalArray[index];
    });
};

const petObjects = (adjectiveArray, animalArray) => {
    return combinedLists(shuffledArray(adjectiveArray), shuffledArray(animalArray)).map(
        petProperties
    );
};

const PET_ARRAY = petObjects(ADJECTIVE_LIST, ANIMAL_LIST);
const petDiv = (petIndex) => {
    const petDiv = document.createElement("div");
    const petHeading = document.createElement("div");
    petDiv.id = `pet-div-${petIndex}`;
    petHeading.id = `pet-heading-${petIndex}`;
    petDiv.className = "pet-div";
    petHeading.className = "pet-heading";
    petDiv.dataset.petIndex = petIndex;
    petHeading.textContent = `${PET_ARRAY[petIndex].name}`;
    petDiv.append(petHeading);
    TRAIT_LIST.forEach((trait) => petDiv.append(traitBarDiv(trait, petIndex)));
    return petDiv;
};
const traitBarDiv = (trait, petIndex) => {
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

const endTheGame = (endCondition) => {
    document.getElementById("pet-pen").style.display = "none";
    PET_ARRAY.forEach((element) => {
        if (!element.deathReason) {
            element.deathReason = "gameover";
        }
    });
    document.body.append(endGameDiv(endCondition));
};
const deathReasonText = (deathReason) => {
    switch (deathReason) {
        case "toomuchfeed":
            return " was stuffed full of so much food it exploded";
        case "toomuchclean":
            return " was cleaned to death";
        case "toomuchplay":
            return " died from exhaustion after too much play";
        case "toomuchtrain":
            return " died (on the inside) after too much training";
        case "toolittlefeed":
            return " starved to death next to its empty food dish";
        case "toolittleclean":
            return " was so filthy it had to be put down";
        case "toolittleplay":
            return " died from a broken heart";
        case "toolittletrain":
            return " went wild and escaped in to the bush to live its best life";
    }
};
const endGameDiv = (endCondition) => {
    const deadpets = PET_ARRAY.filter(
        (pet) => pet.deathReason != null && pet.deathReason != "gameover"
    ).map((pet) => `<li>${pet.name}${deathReasonText(pet.deathReason)}</li>`).join("");
    const main = document.createElement("div");
    const heading = document.createElement("div");
    const body = document.createElement("div");
    main.id = "end-game-div";
    heading.id = "end-game-heading";
    body.id = "end-game-body";
    if (endCondition == "win" && deadpets == false) {
        heading.textContent = "Congratulation!";
        body.textContent = "You kept all of your pets alive";
        log(deadpets)
    } else if (endCondition == "win") {
        heading.textContent = "You finished the Game!";
        body.innerHTML = `However...

        <ul>${deadpets}</ul>

        PETA has been notified`;
        log(deadpets)

    } else {
        heading.textContent = "Game Over";
        body.innerHTML = `
        <ul>${deadpets}</ul>


        PETA has been notified`;
        log(deadpets)

    }
    main.append(heading);
    main.append(body);
    return main;
};

const killPet = (petDiv, petObject, deathReason) => {
    petDiv.classList.add("dead");
    petObject.deathReason = deathReason;
    if (document.querySelectorAll(".dead").length >= LOSE_CONDITION_DEATH_AMOUNT)
        endTheGame("lose");
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
        if (isDead(petObject[currentRuntime], petObject[timeToTake], "animation"))
            killPet(petDiv, petObject, `toolittle${trait}`);

        if (!petObject.deathReason) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
};
const isDead = (currentRuntime, timeToTake, source) => {
    if (source == "animation") {
        return currentRuntime - ACCEPTABLE_CLICK_THRESHOLD > timeToTake;
    } else if (source == "click") {
        return timeToTake - currentRuntime > ACCEPTABLE_CLICK_THRESHOLD;
    }
};
const renderNextPet = () => {
    const totalCurrentPets = document.querySelectorAll(".pet-div").length;
    const totalDeadPets = document.querySelectorAll(".dead").length;
    if (totalCurrentPets - totalDeadPets >= WIN_CONDITION_PET_COUNT) {
        endTheGame("win");
    }
    document.getElementById("pet-pen").append(petDiv(totalCurrentPets));
    TRAIT_LIST.forEach((trait) => animateTraitBar(trait, totalCurrentPets));
    if (!document.getElementById('end-game-div')) setTimeout(renderNextPet, NEW_PET_RATE);
};

document.addEventListener("click", (event) => {
    if (event.target.matches("#start-button")) {
        startButtonClicked(event);
    }
    if (
        event.target.matches(".trait-bar-inner") ||
        event.target.matches(".trait-bar-outer")
    ) {
        traitBarClicked(event);
    }
});
const startButtonClicked = (event) => {
    if (event.target.matches("#start-button")) {
        event.target.remove();
        renderNextPet();
    }
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
    if (
        isDead(
            PET_ARRAY[petIndex][`${trait}Current`],
            PET_ARRAY[petIndex][`${trait}Trait`],
            "click"
        )
    )
        killPet(petDiv, PET_ARRAY[petIndex], `toomuch${trait}`);
    resetTraitBar(petIndex, trait, innerDiv);
};
const resetTraitBar = (petIndex, trait, innerDiv) => {
    PET_ARRAY[petIndex][`${trait}Start`] = 0;
    innerDiv.classList.remove("green");
    innerDiv.style.width = `${innerDiv.parentElement.clientWidth}px`;
};
