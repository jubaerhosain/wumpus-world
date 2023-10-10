const SIZE = 10;
const PITNumber = 6;
let WUMPUSNumber = 5;
let GOLDNumber = 6;

const EMPTY = "e";
const PIT = "P";
const BREEZE = "b";
//const BUMP= 3;
const WUMPUS = "W";
const STENCH = "s";
const BREEZEstench = "bs";
//const SCREAM= 7;
const GOLD = "G";
const UNCOVER = "u";
const SAFE = "sa";
const CANpit = "cp";
const CANwumpus = "cw";
const CANboth = "cb";
const KILLwumpus = "kw";

var wumpusNo = 5;
var pitNo = 6;
var goldNo = 6;
const wumpusArray = [];
const boardSize = 10;
const boardView = [];
let myPos_X = 0;
let myPos_Y = 0;
let found_gold = 0;
let SLEEPINGTIME = 1000;
let TotalPoint = 1;
let TotalWumpusKill = 0;
let arrowRemain = WUMPUSNumber;

function posToDivID(inX, inY) {
    //return cell number 01-99
    let retV = inX * 10 + inY;
    if (retV == 0) return "00";
    else if (retV == 1) return "01";
    else if (retV == 2) return "02";
    else if (retV == 3) return "03";
    else if (retV == 4) return "04";
    else if (retV == 5) return "05";
    else if (retV == 6) return "06";
    else if (retV == 7) return "07";
    else if (retV == 8) return "08";
    else if (retV == 9) return "09";
    else return retV;
}
// Initialize the boardView array
for (let i = 0; i < boardSize; i++) {
    boardView[i] = [];
    for (let j = 0; j < boardSize; j++) {
        boardView[i][j] = EMPTY; // Initialize with empty strings
    }
}
document.getElementById("arrowRemain").innerHTML = `Arrow remain: ${arrowRemain}`;

function getIndex_x_fromNumber(num) {
    if (num <= 10) return 0;
    else if (num <= 20) return 1;
    else if (num <= 30) return 2;
    else if (num <= 40) return 3;
    else if (num <= 50) return 4;
    else if (num <= 60) return 5;
    else if (num <= 70) return 6;
    else if (num <= 80) return 7;
    else if (num <= 90) return 8;
    else if (num <= 100) return 9;
}
function getIndex_y_fromNumber(num) {
    let retValue = num % 10;
    if (retValue == 0) return 9;
    else return retValue;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let file;
const array = [];
document.getElementById("fileInput").addEventListener("change", function (event) {
    file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target.result;

            // Split the file content into lines
            const lines = fileContent.split("\n");

            for (let i = 0; i < 10; i++) {
                array.push(Array.from(lines[i].trim())); // Convert each line to an array of characters
            }
            boardView = array;
        };
        reader.readAsText(file);
    }
});
function setBoard() {
    if (!file) {
        console.log("File input fail");

        for (let i = 0; i < PITNumber; i++) {
            let x, y;
            do {
                x = getRandomInt(0, SIZE - 1);
                y = getRandomInt(0, SIZE - 1);
            } while (boardView[x][y] !== EMPTY);
            boardView[x][y] = PIT;
        }

        for (let i = 0; i < WUMPUSNumber; i++) {
            let x, y;
            do {
                //place wuppus
                x = getRandomInt(0, SIZE - 1);
                y = getRandomInt(0, SIZE - 1);
            } while (boardView[x][y] !== EMPTY);
            boardView[x][y] = WUMPUS;
        }

        for (let i = 0; i < GOLDNumber; i++) {
            let x, y;
            do {
                //place gold
                x = getRandomInt(0, SIZE - 1);
                y = getRandomInt(0, SIZE - 1);
            } while (boardView[x][y] !== EMPTY);
            boardView[x][y] = GOLD;
        }
    } else {
        console.log("Data set by file");
        GOLDNumber = 0;
        WUMPUSNumber = 0;
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                boardView[i][j] = array[i][j];
                if (array[i][j] === GOLD) GOLDNumber++;
                if (array[i][j] === WUMPUS) WUMPUSNumber++;
            }
        }
        arrowRemain = WUMPUSNumber;
        console.log(boardView);
    }

    console.log(boardView, " is board view");
}
function validCheck(i, j) {
    return i >= 0 && i < SIZE && j >= 0 && j < SIZE;
}
function checkAdjacentCell(i, j) {
    if (boardView[i][j] === PIT) return PIT;
    else if (boardView[i][j] === WUMPUS) return WUMPUS;
    else if (boardView[i][j] === GOLD) {
        //boardView[i][j] = EMPTY;
        return GOLD;
    }

    let hasPit = false,
        hasWumpus = false;
    const directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ];
    for (const [px, py] of directions) {
        const x = i + px;
        const y = j + py;
        if (validCheck(x, y) && boardView[x][y] === PIT) hasPit = true;
        else if (validCheck(x, y) && boardView[x][y] === WUMPUS) hasWumpus = true;
    }

    if (hasPit && hasWumpus) return BREEZEstench;
    else if (hasPit) return BREEZE;
    else if (hasWumpus) return STENCH;
    else return EMPTY;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function setAttribute(x, y) {
    TotalPoint--;
    document.getElementById("TotalPoint").innerHTML = `Total point: ${TotalPoint}`;
    let textt = "";
    let theDiv = document.getElementById(posToDivID(x, y));
    theDiv.classList.add("visited");
    theDiv.classList.add("Nvisited");
    if (checkAdjacentCell(x, y) == STENCH) theDiv.classList.add("snitchCell");
    else if (checkAdjacentCell(x, y) == BREEZE) theDiv.classList.add("breezeCell");
    else if (checkAdjacentCell(x, y) == BREEZEstench) theDiv.classList.add("doubleCell");
    else if (checkAdjacentCell(x, y) == WUMPUS) theDiv.classList.add("wumpusCell");
    else if (checkAdjacentCell(x, y) == PIT) theDiv.classList.add("pitCell");
    else if (checkAdjacentCell(x, y) == GOLD) theDiv.classList.add("goldCell");

    if (checkAdjacentCell(x, y) == PIT || checkAdjacentCell(x, y) == WUMPUS) {
        alert("Game Over. Agent killed");
        agent.gameOver = true;
        //location.reload();
        console.log("Game over for wumpus and pit : ", x, " ", y);
    }
}

const getIndexFromNumber = (num) => ({
    x: Math.floor(num / 10),
    y: num % 10,
});


async function aiMovement(lowestPath) {
    let lastPath = lowestPath.length - 1;
    for (let i = 1; i < lowestPath.length; i++) {
        await sleep(SLEEPINGTIME);
        const { x: rowIndex, y: colIndex } = getIndexFromNumber(lowestPath[i]);
        const { x: oldRowIndex, y: oldColIndex } = getIndexFromNumber(lowestPath[i - 1]);
        let theDiv = document.getElementById(posToDivID(oldRowIndex, oldColIndex));
        theDiv.classList.remove("Nvisited");
        console.log(rowIndex, colIndex, " index");
        console.log(lowestPath[i] - lowestPath[i - 1], " ", myPos_X, " ", myPos_Y);

        setAttribute(rowIndex, colIndex);
    }

    const { x: rowIndex, y: colIndex } = getIndexFromNumber(lowestPath[lastPath]);
    return checkAdjacentCell(rowIndex, colIndex);
}

function killWumpus(pointX, pointY) {
    if (boardView[pointX][pointY] === WUMPUS) {
        TotalPoint += 1000;
        TotalWumpusKill++;
        document.getElementById("TotalPoint").innerHTML = `Total point: ${TotalPoint}`;
        document.getElementById("TotalWumpusKill").innerHTML = `Total wumpus kill: ${TotalWumpusKill}`;
        boardView[pointX][pointY] = EMPTY; //later try to adjus sorounding
        //boardView[pointX][pointY] = checkAdjacentCell(pointX,pointY);
        let theDiv = document.getElementById(posToDivID(pointX, pointY));
        theDiv.classList.add("wumpus_dead");
        //alert("kill wumpus");
        return true;
    } else {
        TotalPoint -= 10;
        return false;
    }
    // arrowRemain--;
    // document.getElementById("arrowRemain").innerHTML = `Arrow remain: ${arrowRemain}`;
}

function sensorForGold(i, j) {
    TotalPoint += 1000;
    document.getElementById("TotalPoint").innerHTML = `Total point: ${TotalPoint}`;
    found_gold++;
    document.getElementById("TotalGoldFound").innerHTML = `Total gold found: ${found_gold}`;

    if (found_gold == GOLDNumber) {
        alert("Congratulation Game Finished. All GOLD collected");
        agent.gameOver = true;
        //location.reload();
        console.log("Game over for gold ");
    }
    let hasPit = false,
        hasWumpus = false;
    const directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ];
    for (const [px, py] of directions) {
        const x = i + px;
        const y = j + py;
        if (validCheck(x, y) && boardView[x][y] === PIT) hasPit = true;
        else if (validCheck(x, y) && boardView[x][y] === WUMPUS) hasWumpus = true;
    }
    let theDiv = document.getElementById(posToDivID(i, j));

    if (hasPit && hasWumpus) {
        theDiv.classList.add("goldBoth");
        return BREEZEstench;
    } else if (hasPit) {
        theDiv.classList.add("goldBreez");
        return BREEZE;
    } else if (hasWumpus) {
        theDiv.classList.add("goldStench");
        return STENCH;
    } else return EMPTY;
}

class Agent {
    constructor() {
        this.board = Array(SIZE)
            .fill(null)
            .map(() => Array(SIZE).fill(UNCOVER));
        this.agentX = 9;
        this.agentY = 0;
        this.agentHasGold = false;
        this.agentHasArrow = true;
        this.gameOver = false;
        this.originalBoard;
        this.game;
        this.goldNumber = GOLDNumber;
        this.totalPoint = 0;
        this.numberOfWumpusKill = 0;
        this.PITProbability = 1;
        this.ArrowRemain = WUMPUSNumber;
    }

    directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
    ];

    async initiateTheGame() {
        //this.game = new WumpusWorld();
        //this.game.createBoard();
        console.log("Here game started-----------------------------------------------");

        this.board[this.agentX][this.agentY] = checkAdjacentCell(this.agentX, this.agentY);
        agentMind(this.agentX, this.agentY, this.board[this.agentX][this.agentY]);
        let count = 0;
        //await this.findBestMove();
        while (this.gameOver === false) {
            await this.findBestMove();
            if (this.gameOver === false) {
                console.log("Probability part started");
                await this.createSaveMove();
            }

            console.log("One");
        }

        console.log("Final statement: ");
        console.log(this.totalPoint, " is the point");
        console.log(GOLDNumber - this.goldNumber, "  gold found ");
        console.log(this.numberOfWumpusKill, " total wumpus kill");
    }

    async findBestMove() {
        let count = 0,
            checkArray;
        do {
            //console.log("lests check ",count);
            checkArray = this.findAdjacentCell(this.board);
            console.log(checkArray, " here after get it");
            if (checkArray.length === 0) {
                break;
            }
            const graph = new Graph();
            graph.createGraph(this.board);
            let cost = Number.MAX_VALUE,
                lowestPath,
                lowestPoint;
            for (const point of checkArray) {
                const path = graph.BFS(this.agentX * SIZE + this.agentY, point[0] * SIZE + point[1]);
                if (path.length < cost) {
                    cost = path.length;
                    lowestPath = path;
                    lowestPoint = point;
                }

                this.board[point[0]][point[1]] = UNCOVER;
            }
            console.log("This is the lowest path", lowestPath);

            let status = await aiMovement(lowestPath);
            console.log("this is from forntent: ", status);

            //this.game.passingMove(lowestPoint[0], lowestPoint[1]); //send the point or the path to forntent
            this.checkStatus(status); //check  if the gane end
            if (status === GOLD) status = sensorForGold(lowestPoint[0], lowestPoint[1]);
            agentMind(lowestPoint[0], lowestPoint[1], status);
            this.board[lowestPoint[0]][lowestPoint[1]] = status;
            this.agentX = lowestPoint[0];
            this.agentY = lowestPoint[1];
            this.totalPoint -= lowestPath.length - 1;
            //count++;
        } while (this.gameOver === false && checkArray.length !== 0);

        for (let row of this.board) {
            console.log(row.join("    "));
            console.log();
        }
    }

    checkStatus(status) {
        if (status === GOLD) {
            this.totalPoint += 1000;
            console.log("COngratulation you find the GOLD");
            if (--this.goldNumber == 0) this.gameOver = true;
        } else if (status === WUMPUS) {
            console.log("Game Over. Wumpus found in this cell");
            this.gameOver = true;
        } else if (status === PIT) {
            console.log("Game Over. You fall in PIT");
            this.gameOver = true;
        }
    }

    convertedArray(sensor) {
        const probability = Array(SIZE)
            .fill(null)
            .map(() => Array(SIZE).fill(0));
        for (let i = 0; i < SIZE; i++) {
            //check where there are wumpus or pit
            for (let j = 0; j < SIZE; j++) {
                if (this.board[i][j] === EMPTY || this.board[i][j] === BREEZEstench || this.board[i][j] === sensor) {
                    probability[i][j] = -1;
                } else if (this.board[i][j] === UNCOVER) {
                    for (const [px, py] of this.directions) {
                        const x = i + px;
                        const y = j + py;
                        if (this.validCheck(x, y) && (this.board[x][y] === sensor || this.board[x][y] === BREEZEstench)) {
                            probability[i][j]++;
                        }
                    }
                }
            }
        }

        return probability;
    }

    async createSaveMove() {
        const pitProbability = this.convertedArray(BREEZE);
        const wumpusProbability = this.convertedArray(STENCH);
        await this.applyLogic(pitProbability, wumpusProbability); //try to logic apply here
    }

    async makeMovement(i, j) {
        console.log("make a probability movement");
        this.board[i][j] = SAFE;
        //replace it with another function
        const graph = new Graph();
        graph.createGraph(this.board);
        const path = graph.BFS(this.agentX * SIZE + this.agentY, i * SIZE + j);
        let status = await aiMovement(path);
        console.log("this is from forntent: ", status); //send the point or the path to forntent
        //if (status === GOLD) status = this.game.passingMove(i, j);
        if (status === GOLD) status = sensorForGold(i, j);
        this.checkStatus(status); //check  if the gane end
        console.log(status, " is the status of ", i, " - ", j);
        agentMind(i, j, status);
        this.board[i][j] = status;
        this.agentX = i;
        this.agentY = j;
        this.totalPoint -= path.length - 1;
    }

    async applyLogic(probability, wumpusProbability) {
        //find acctually there are pit or wumpus exixs or not
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (this.board[i][j] === CANboth || this.board[i][j] === CANpit) {
                    if (this.checkSorounding(this.board, i, j, STENCH)) return true;
                }
                if (this.board[i][j] === CANboth || this.board[i][j] === CANwumpus) {
                    if (this.checkSorounding(this.board, i, j, BREEZE)) return true;
                }
            }
        }

        let killStatus = await this.tryKillWumpus(wumpusProbability);
        if (killStatus) return;
        console.log("No inferance apply here--------------------");
        for (let row of probability) {
            console.log(row.join("    "));
            console.log();
        }

        //where there are low probability to get the pit it can explore this
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (probability[i][j] === this.PITProbability && wumpusProbability[i][j] === 0) {
                    //@update add here list and sort then find also 2 not only 1
                    await this.makeMovement(i, j);
                    this.PITProbability = 1;
                    return;
                }
            }
        }

        this.PITProbability++; //there are no probability for PIT with 1 breeze
        return;
    } //apply here that here are actual pit and wumpus

    async tryKillWumpus(wumpusProbability) {
        const mySet = new Set();
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (wumpusProbability[i][j] !== -1 && wumpusProbability[i][j] !== 0) {
                    mySet.add([i, j]);
                }
            }
        }

        const myArray = Array.from(mySet);
        if (myArray.length === 0) return false;
        myArray.sort((a, b) => {
            const [x1, y1] = a;
            const [x2, y2] = b;
            const value1 = wumpusProbability[x1][y1];
            const value2 = wumpusProbability[x2][y2];
            return value2 - value1;
        });

        const [highestX, highestY] = myArray[0];
        const highestValue = wumpusProbability[highestX][highestY];

        console.log(`Highest Value: ${highestValue}`);
        console.log(`Coordinates: (${highestX}, ${highestY})`);

        //kill here
        if (highestValue >= 2 && this.ArrowRemain > 0) {
            //@update check here that arrow are here
            this.ArrowRemain--;
            console.log("make a movement for kill wumpus");
            let i,
                j,
                lowcost = Number.MAX_VALUE,
                lowcostPath;
            const graph = new Graph();
            graph.createGraph(this.board);
            console.log(this.agentX, "===", this.agentY);
            for (const [px, py] of this.directions) {
                const x = highestX + px;
                const y = highestY + py;
                if (this.validCheck(x, y) && this.board[x][y] !== UNCOVER) {
                    const path = graph.BFS(this.agentX * SIZE + this.agentY, x * SIZE + y);
                    console.log(x, " -- ", y, "  ", path, path.length);
                    if (path && path.length < lowcost) {
                        lowcostPath = path;
                        lowcost = path.length;
                        i = x;
                        j = y;
                    }
                }
            }
            console.log("after for loop");

            this.agentX = i;
            this.agentY = j;
            console.log(i, " ", j, " ", this.agentX, " ", this.agentY, " in kill part ", lowcostPath);
            //SLEEPINGTIME = 500;
            let status = await aiMovement(lowcostPath);
            //send the point or the path to forntent
            //this.checkStatus(status)                //check  if the gane end
            this.totalPoint -= lowcostPath.length - 1 + 10;

            let isKill;
            if (status) isKill = await killWumpus(highestX, highestY);
            console.log("Here after kill part ", isKill);
            if (isKill) {
                const path = graph.BFS(this.agentX * SIZE + this.agentY, highestX * SIZE + highestY);
                console.log(path, " is the path of ", this.agentX, " ", this.agentY, " ", highestX, " ", highestY);

                let status = await aiMovement([this.agentX * SIZE + this.agentY, highestX * SIZE + highestY]);
                console.log("this is from forntent: ", status);
                console.log(status, " is the status of ", i, " - ", j);
                this.board[i][j] = status;
                agentMind(highestX, highestY, status);
                this.agentX = highestX;
                this.agentY = highestY;
                console.log("Here wumpus are killed###########################");
                this.numberOfWumpusKill++;

                for (const [px, py] of this.directions) {
                    //update currrent board
                    const x = highestX + px;
                    const y = highestY + py;

                    if (this.validCheck(x, y) && this.board[x][y] !== UNCOVER) {
                        this.board[x][y] = checkAdjacentCell(x, y);
                        agentMind(x, y, this.board[x][y]);
                    }
                }
                //this.totalPoint -= 1;
                return true;
            }

            console.log("Without executing it");
            return false;
        } else return false;
        console.log("Without executing it");
    }

    checkSorounding(board, i, j, sensor) {
        //create safe if it not wumpus or pit
        for (const [px, py] of this.directions) {
            //add here sure there are pit or wumpus
            const x = i + px;
            const y = j + py;
            if (this.validCheck(x, y) && (board[x][y] === EMPTY || board[x][y] === sensor)) {
                if (this.board[i][j] === CANboth) this.board[i][j] = sensor;
                else {
                    this.makeMovement(i, j);
                    return true;
                }
            }
        }
        return false;
    }

    findAdjacentCell(board) {
        //return all the set of cell that has adjacent uncover cell
        const mySet = new Set();
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (board[i][j] === UNCOVER && this.checkAdjacentCell(board, i, j)) {
                    mySet.add([i, j]);
                    this.board[i][j] = SAFE;
                }
            }
        }

        const pointArray = Array.from(mySet);
        return pointArray;
    }

    validCheck(i, j) {
        return i >= 0 && i < SIZE && j >= 0 && j < SIZE;
    }

    checkAdjacentCell(board, i, j) {
        //return if there any cell that is uncover
        const directions = [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
        ];
        for (const [px, py] of this.directions) {
            const x = i + px;
            const y = j + py;
            //if (this.validCheck(x, y) && (board[x][y] === EMPTY || board[x][y] === SAFE))
            if (this.validCheck(x, y) && board[x][y] === EMPTY) return true;
        }

        return false;
    }
}

class Graph {
    constructor() {
        this.adj;
    }

    isKnown(board, i, j) {
        if (
            i < SIZE &&
            j < SIZE &&
            (board[i][j] === EMPTY ||
                board[i][j] === BREEZE ||
                board[i][j] === STENCH ||
                board[i][j] === BREEZEstench ||
                board[i][j] === SAFE)
        ) {
            return true;
        } else {
            return false;
        }
    }

    createGraph(board) {
        this.adj = new Array(SIZE * SIZE).fill(null).map(() => []);
        //console.log(this.adj," is initial graph")

        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (this.isKnown(board, i, j)) {
                    //console.log(i,j);
                    if (this.isKnown(board, i, j + 1)) {
                        this.addEdge(i * SIZE + j, i * SIZE + j + 1);
                        //console.log("left")
                    }
                    if (this.isKnown(board, i + 1, j)) {
                        this.addEdge(i * SIZE + j, (i + 1) * SIZE + j);
                        //console.log("down")
                    }
                }
            }
        }

        //console.log(this.adj," is after create graph")
    }

    addEdge(u, v) {
        //console.log(u,"--" ,v)
        this.adj[u].push(v);
        this.adj[v].push(u);
    }

    BFS(s, d) {
        //console.log("The graph is ",this.adj);
        const visited = new Array(SIZE * SIZE).fill(false);
        const queue = [];

        queue.push(s);
        visited[s] = true;

        const parent = new Array(SIZE * SIZE).fill(-1);

        while (queue.length > 0) {
            const u = queue.shift();

            for (const v of this.adj[u]) {
                if (!visited[v]) {
                    queue.push(v);
                    visited[v] = true;
                    parent[v] = u;
                }
            }
        }

        if (!visited[d]) {
            return false;
        }

        const path = [];

        while (d !== -1) {
            path.push(d);
            d = parent[d];
        }

        path.reverse();

        return path;
    }
}

const agent = new Agent();
async function startGame() {
    await setBoard();
    setAttribute(9, 0);
    agent.initiateTheGame();
}

async function restartGame() {
    location.reload();
    await setBoard();
    setAttribute(9, 0);
    agent.initiateTheGame();
}

const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
];

const agentBoard = Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(EMPTY));
function agentMind(i, j, sensor) {
    // let theDiv = document.getElementById(`0${posToDivID(x, y)}`);
    // theDiv.classList.add("visited");
    if (sensor == EMPTY) {
        agentBoard[i][j] = SAFE;
        for (const [px, py] of directions) {
            const x = i + px;
            const y = j + py;
            if (validCheck(x, y)) {
                changeSorounding("safe", x, y);
                agentBoard[x][y] = SAFE;
            }
        }
    } else if (sensor === BREEZE) {
        for (const [px, py] of directions) {
            const x = i + px;
            const y = j + py;
            if (validCheck(x, y) && agentBoard[x][y] === EMPTY) {
                changeSorounding("canPit", x, y);
                agentBoard[x][y] = CANpit;
            } else if (validCheck(x, y) && agentBoard[x][y] === CANwumpus) {
                changeSorounding("canBoth", x, y);
                agentBoard[x][y] = CANboth;
            }
        }
    } else if (sensor === STENCH) {
        for (const [px, py] of directions) {
            const x = i + px;
            const y = j + py;
            if (validCheck(x, y) && agentBoard[x][y] === EMPTY) {
                changeSorounding("canWumpus", x, y);
                agentBoard[x][y] = CANwumpus;
            } else if (validCheck(x, y) && agentBoard[x][y] === CANpit) {
                changeSorounding("canBoth", x, y);
                agentBoard[x][y] = CANboth;
            }
        }
    }
    // else if(sensor==="kill"){
    //   for (const [px, py] of directions) {
    //   const x = i + px;
    //   const y = j + py;
    //     if (validCheck(x, y) && agentBoard[x][y] === STENCH){
    //       changeSorounding("sa",x,y);
    //       agentBoard[x][y] = CANwumpus;
    //     }else if(validCheck(x, y) && agentBoard[x][y] === CANpit){
    //       changeSorounding("b?",x,y);
    //       agentBoard[x][y] = CANboth;
    //     }
    //   }
    // }
}

function changeSorounding(text, x, y) {
    //console.log(`0${posToDivID(x, y)}`,x,y);
    //document.getElementById(`0${posToDivID(x, y)}`).innerHTML = `${text}`;
    let theDiv = document.getElementById(`0${posToDivID(x, y)}`);
    theDiv.classList.add(text);
}
