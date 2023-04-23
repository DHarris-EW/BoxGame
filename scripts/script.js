
let gridSize = 1;
let boxes = [];
let boxSize = 0;

let colours = [];
let prevColours = []
let coloursInPlay = [];
let nextColour = "";
let hex = "";

let score = 0;
let roundCounter = 0;
let maxRound = 3;

let lastClick = 0;

const createGrid = (gridSize, colours) => {
    let grid = document.getElementById("grid");
    let boxes = []
    let boxSize = (grid.offsetHeight - (10 * (gridSize - 1))) / gridSize;
    let numOfBoxes = gridSize * gridSize;

    let coloursInPlay = []
    let coloursCopy = [...colours]
    let colour;

    grid.style.gridTemplateColumns = `${boxSize}px `.repeat(gridSize);

    while (grid.lastChild) {
        grid.removeChild(grid.lastChild);
    }

    for (let i = 0; i < numOfBoxes; i++) {
        let box = document.createElement("button");
        let randomIndex = Math.floor(Math.random() * coloursCopy.length);

        if (coloursCopy.length === 0) {
            coloursCopy = [...colours];
        }

        colour = coloursCopy.splice(randomIndex, 1);
        coloursInPlay.push(colour);

        box.classList.add("box");
        box.style.width = `${boxSize}px`;
        box.style.height = `${boxSize}px`;
        box.style.background = `${colour}`
        document.getElementById("grid").appendChild(box);
        boxes.push(box);
    }

    return [boxes, coloursInPlay, boxSize];
}

const generateNextColour = (coloursInPlay, prevColours) => {
    coloursInPlay = coloursInPlay.filter((colour) => {
       return !prevColours.includes(colour);
    })

    let randomIndex = Math.floor(Math.random() * coloursInPlay.length);
    let colour = coloursInPlay[randomIndex];
    let changeBox = document.getElementById("nextColour");

    changeBox.style.width = "200px";
    changeBox.style.height = "200px";
    changeBox.style.background = colour;
    prevColours.push(colour);

    return colour;
}

const generateColours = () => {
    let colours = []

    for (let i = 0; i < 20; i++) {
        const colour = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
        colours.push("#" + colour);
    }

    return colours;
}

const game = (boxes) => {
    boxes.forEach((box) => {
        const rgbColour = box.style.getPropertyValue("background");
        let [r, g, b] = rgbColour.substr(4).split(")")[0].split(",");

        const base16 = (num) => {
            return Number(num).toString(16).padStart(2, "0");
        }

        const clicked = (e) => {
            hex = "#" + base16(r) + base16(g) + base16(b);

            if (nextColour[0] === hex) {
                if (prevColours.length < coloursInPlay.length) {
                    e.currentTarget.classList.add("winner");
                    nextColour = generateNextColour(coloursInPlay, prevColours);

                    let newClick = e.timeStamp;
                    let diff = Math.round(newClick - lastClick);

                    lastClick = newClick;

                    let targetTimePercentage = (1 - (diff / 5000)).toFixed(1);

                    if (0 > targetTimePercentage < 1) {
                        score += targetTimePercentage * 100;
                        document.getElementById("score").innerHTML = String(score);
                    }
                } else {
                    nextRound();
                }
            }
        }
        box.addEventListener("click", clicked);
    })
}

const gameOver = () => {
    document.getElementById("gameArea").style.display = "none";
    document.getElementById("hint").style.display = "none";
    document.getElementById("gameOver").style.display = "flex";
    document.getElementById("finalScore").innerHTML = String(score);
}

const nextRound = () => {
    if (roundCounter === maxRound) {
        gameOver();
    }
    roundCounter += 1;
    prevColours = [];
    colours = generateColours();
    gridSize += 1;
    [boxes, coloursInPlay, boxSize] = createGrid(gridSize, colours);
    nextColour = generateNextColour(coloursInPlay, prevColours);
    game(boxes);
}

const playAgain = () => {
    roundCounter = 0;
    gridSize = 1;
    score = 0;

    document.getElementById("gameArea").style.display = "flex";
    document.getElementById("hint").style.display = "block";
    document.getElementById("gameOver").style.display = "none";

    document.getElementById("score").innerHTML = String(score);

    nextRound();
}

nextRound();