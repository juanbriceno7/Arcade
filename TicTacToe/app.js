let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

let player1score = 0;
let player2score = 0;
let message = document.getElementById("message");
let player1name = document.getElementById("player1");
let player2name = document.getElementById("player2");
let nameSubmission = document.getElementById("submit-names");
let table = document.querySelector("table");
let rows = document.querySelectorAll("tr");
let reset = document.getElementById("reset");
let playerTurn;
let computerIntervalId;
let winState = 0;

reset.hidden = true;
table.classList.toggle("disable-clicks");

nameSubmission.addEventListener("click", function () {
    initialize();
});

document
    .getElementById("player1name")
    .addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            nameSubmission.click();
        }
    });

document
    .getElementById("player2name")
    .addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            nameSubmission.click();
        }
    });

table.addEventListener("click", function (event) {
    addSymbol(event);
});

reset.addEventListener("click", function () {
    playAgain();
});

function initialize() {
    let textfield1 = document.getElementById("player1name");
    let textfield2 = document.getElementById("player2name");

    if (textfield1.value !== "") {
        let name1 = capitalize(textfield1.value);
        player1name.innerText = name1;
    } else {
        return;
    }

    if (textfield2.value !== "") {
        let name2 = capitalize(textfield2.value);
        player2name.innerText = name2;
    } else {
        player2name.innerText = "Computer";
    }
    message.innerText = "";
    textfield1.style.display = "none";
    textfield2.style.display = "none";
    nameSubmission.style.display = "none";
    table.classList.toggle("disable-clicks");

    whoGoesFirst();
}

function capitalize(name) {
    const lower = name.toLowerCase();
    return name.charAt(0).toUpperCase() + lower.slice(1);
}

function whoGoesFirst() {
    playerTurn = Math.floor(Math.random() * 2 + 1);
    if (playerTurn === 1) {
        playerTurn = 'x'
        message.innerText = player1name.innerText + "'s Turn";
    } else {
        playerTurn = 'o'
        message.innerText = player2name.innerText + "'s Turn";
    }
    if (player2name.innerText === "Computer" && playerTurn === 'o') {
        computerThink();
    }
}

function addSymbol(event) {
    let target = event.target;
    if (
        target.tagName === "TD" &&
        !target.classList.contains('x') &&
        !target.classList.contains('o')
    ) {
        if (playerTurn === 'x') {
            target.classList.toggle('x');
        } else {
            target.classList.toggle('o');
        }

        updateBoard();
        winCheck();
        if (winState === 0) {
            if (playerTurn === 'x' && player2name.innerText === "Computer") {
                changeTurn();
                computerThink();
            } else {
                changeTurn();
            }
        }
    } else {
        return;
    }
}

function addSymbolComputer(coordinates) {
    let yCoordinate = coordinates[0];
    let xCoordinate = coordinates[1];
    rows[yCoordinate].getElementsByTagName('td')[xCoordinate].classList.toggle('o');
    board[yCoordinate][xCoordinate] = 'o';
    table.classList.toggle("disable-clicks");

    updateBoard();
    winCheck();
    changeTurn();
}

function updateBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (rows[i].getElementsByTagName("td")[j].classList.contains('x')) {
                board[i][j] = 'x';
            } 
            else if (rows[i].getElementsByTagName("td")[j].classList.contains('o')) {
                board[i][j] = 'o';
            }
        }
    }
}

function changeTurn() {
    if (winState !== 0) {
        return;
    } else if (playerTurn === 'x') {
        playerTurn = 'o';
        message.innerText = player2name.innerText + "'s Turn";
    } else {
        playerTurn = 'x';
        message.innerText = player1name.innerText + "'s Turn";
    }
}

function computerThink() {
    table.classList.toggle("disable-clicks");
    computerIntervalId = setInterval(computerPause, 500);
}

function computerPause() {
    if (message.innerText === "Computer's Turn") {
        message.innerText = "Computer's Turn.";
    } else if (message.innerText === "Computer's Turn.") {
        message.innerText = "Computer's Turn..";
    } else if (message.innerText === "Computer's Turn..") {
        message.innerText = "Computer's Turn...";
    } else {
        clearInterval(computerIntervalId);
        computerIntervalId = null;
        computerTurn();
    }
}

function computerTurn() {
    let coordinates;
    let tempMove = winningMove();
    if (tempMove !== -1) {
        coordinates = tempMove;
        addSymbolComputer(coordinates)
    }
    else {
        tempMove = stopOpponent();
        if (tempMove !== -1) {
            coordinates = tempMove;
            addSymbolComputer(coordinates)
        }
        else {
            tempMove = nextMove();
            if (tempMove !== -1) {
                coordinates = tempMove;
                addSymbolComputer(coordinates)
            }
            else {
                //to run if nothing else does
                coordinates = firstMove();
                addSymbolComputer(coordinates)
            }
        }
    }
}

function winningMove() {
    console.log('winningmove');
    //check horizontally for winning move
    for (let i = 0; i < board.length; i++) {
        if (board[i][0] === 'o' && board[i][1] === 'o' && board[i][2] === 0) {
            return [i, 2];
        }
        else if (board[i][1] === 'o' && board[i][2] === 'o' && board[i][0] === 0) {
            return [i, 0];
        }
        else if (board[i][0] === 'o' && board[i][2] === 'o' && board[i][1] === 0) {
            return [i, 1];
        }
    }

    //check vertically for winning move
    for (let i = 0; i < board.length; i++) {
        if (board[0][i] === 'o' && board[1][i] === 'o' && board[2][i] === 0) {
            return [2, i];
        }
        else if (board[1][i] === 'o' && board[2][i] === 'o' && board[0][i] === 0) {
            return [0, i];
        }
        else if (board[0][i] === 'o' && board[2][i] === 'o' && board[1][i] === 0) {
            return [1, i];
        }
    }

    //check diagonally for winning move
    if (board[0][0] === 'o' && board[1][1] === 'o' && board[2][2] === 0) {
        return [2, 2];
    }
    else if (board[1][1] === 'o' && board[2][2] === 'o' && board[0][0] === 0) {
        return [0, 0];
    }
    else if (board[0][0] === 'o' && board[2][2] === 'o' && board[1][1] === 0) {
        return [1, 1];
    }

    if (board[0][2] === 'o' && board[1][1] === 'o' && board[2][0] === 0) {
        return [2, 0];
    }
    else if (board[1][1] === 'o' && board[2][0] === 'o' && board[0][2] === 0) {
        return [0, 2];
    }
    else if (board[0][2] === 'o' && board[2][0] === 'o' && board[1][1] === 0) {
        return [1, 1];
    }

    return -1;
}

function stopOpponent() {
    console.log('stopopponent');
    //check horizontally for winning move
    for (let i = 0; i < board.length; i++) {
        if (board[i][0] === 'x' && board[i][1] === 'x' && board[i][2] === 0) {
            return [i, 2];
        }
        else if (board[i][1] === 'x' && board[i][2] === 'x' && board[i][0] === 0) {
            return [i, 0];
        }
        else if (board[i][0] === 'x' && board[i][2] === 'x' && board[i][1] === 0) {
            return [i, 1];
        }
    }

    //check vertically for winning move
    for (let i = 0; i < board.length; i++) {
        if (board[0][i] === 'x' && board[1][i] === 'x' && board[2][i] === 0) {
            return [2, i];
        }
        else if (board[1][i] === 'x' && board[2][i] === 'x' && board[0][i] === 0) {
            return [0, i];
        }
        else if (board[0][i] === 'x' && board[2][i] === 'x' && board[1][i] === 0) {
            return [1, i];
        }
    }

    //check diagonally for winning move
    if (board[0][0] === 'x' && board[1][1] === 'x' && board[2][2] === 0) {
        return [2, 2];
    }
    else if (board[1][1] === 'x' && board[2][2] === 'x' && board[0][0] === 0) {
        return [0, 0];
    }
    else if (board[0][0] === 'x' && board[2][2] === 'x' && board[1][1] === 0) {
        return [1, 1];
    }

    if (board[0][2] === 'x' && board[1][1] === 'x' && board[2][0] === 0) {
        return [2, 0];
    }
    else if (board[1][1] === 'x' && board[2][0] === 'x' && board[0][2] === 0) {
        return [0, 2];
    }
    else if (board[0][2] === 'x' && board[2][0] === 'x' && board[1][1] === 0) {
        return [1, 1];
    }

    //stop opponent from making a cross
    if (board[0][0] === 'x' && board[0][2] === 'x' && board[1][1] === 0) {
        return [1, 1];
    }
    else if (board[0][2] === 'x' && board[2][2] === 'x' && board[1][1] === 0) {
        return [1, 1];
    }
    else if (board[2][2] === 'x' && board[2][0] === 'x' && board[1][1] === 0) {
        return [1, 1];
    }
    else if (board[2][0] === 'x' && board[0][0] === 'x' && board[1][1] === 0) {
        return [1, 1];
    }
    return -1;
}

function nextMove() {
    console.log('nextmove');
    //setting up winning move
    if (board[0][0] === 'o' && board[2][2] === 'o') {
        if (board[0][2] === 0) {
            return [0, 2];
        }
        else if (board[2][0] === 0) {
            return [2, 0];
        }
    }
    else if (board[0][2] === 'o' && board[2][0] === 'o') {
        if (board[0][0] === 0) {
            return [0, 0];
        }
        else if (board[2][2] === 0) {
            return [2, 2];
        }
    }

    // setting up the setup for winning move
    if (board[0][0] === 'o' && board[2][2] === 0) {
        return [2, 2];
    }
    else if (board[0][2] === 'o' && board[2][0] === 0) {
        return [2, 0];
    }
    else if (board[2][0] === 'o' && board[0][2] === 0) {
        return [0, 2];
    }
    else if (board[2][2] === 'o' && board[0][0] === 0) {
        return [0, 0];
    }

    //damage control
    if (board[0][0] === 'o' && board[2][2] === 'x') {
        if (board[0][2] === 0) {
            return [0, 2];
        }
        else if (board[2][0] === 0) {
            return [2, 0];
        }
    }
    else if (board[0][2] === 'o' && board[2][0] === 'x') {
        if (board[0][0] === 0) {
            return [0, 0];
        }
        else if (board[2][2] === 0) {
            return [2, 2];
        }
    }
    else if (board[2][0] === 'o' && board[0][2] === 'x') {
        if (board[0][0] === 0) {
            return [0, 0];
        }
        else if (board[2][2] === 0) {
            return [2, 2];
        }
    }
    else if (board[2][2] === 'o' && board[0][0] === 'x') {
        if (board[0][2] === 0) {
            return [0, 2];
        }
        else if (board[2][0] === 0) {
            return [2, 0];
        }
    }

    //if the middle was chosen
    if (board[1][1] === 'o') {
        if (board[0][0] === 0 && board[2][2] !== 'x') {
            return [0, 0];
        }
        else if (board[0][2] === 0 && board[2][0] !== 'x') {
            return [0, 2];
        }
        else if (board[2][0] === 0 && board[0][2] !== 'x') {
            return [2, 0];
        }
        else if (board[2][2] === 0 && board[0][0] !== 'x') {
            return [2, 2];
        }
        else if (board[0][1] === 0 && board[2][1] !== 'x') {
            return [0, 1];
        }
        else if (board[1][2] === 0 && board[1][0] !== 'x') {
            return [1, 2];
        }
        else if (board[2][1] === 0 && board[0][1] !== 'x') {
            return [2, 1];
        }
        else if (board[2][1] === 0 && board[0][1] !== 'x') {
            return [2, 1];
        }
    }

    return -1;
}

function firstMove() {
    console.log('firstmove');
    let first = true;
    //checks to see if it is the very first player
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] !== 0) {
                first = false;
            }
        }
    }
    if (first) {
        let random = Math.floor(Math.random() * 4);
        if (random === 0) {
            return [0, 0];
        }
        else if (random === 1) {
            return [0, 2];
        }
        else if (random === 2) {
            return [2, 0];
        }
        else {
            return [2, 2];
        }
    }
    else {
        if (board[0][0] === 'x') {
            return [0, 1];
        }
        else if (board[0][2] === 'x') {
            return [0, 1];
        }
        else if (board[2][0] === 'x') {
            return [2, 1];
        }
        else if (board[2][2] === 'x') {
            return [2, 1];
        }
        else if (board[1][1] === 0) {
            return [1, 1];
        }
        else {
            if (board[0][0] === 0) {
                return [0, 0];
            }
            else if (board[0][2] === 0) {
                return [0, 2];
            }
            else if (board[2][0] === 0) {
                return [2, 0];
            }
            else if (board[2][2] === 0) {
                return [2, 2];
            }
            else if (board[0][1] === 0) {
                return [0, 1];
            }
            else if (board[1][2] === 0) {
                return [1, 2];
            }
            else if (board[2][1] === 0) {
                return [2, 1];
            }
            else if (board[1][0] === 0) {
                return [1, 0];
            }
            else {
                throw "Something went wrong"
            }
        }
    }
}

function winCheck() {
    horizontalCheck();
    verticalCheck();
    diagonalCheck();
    drawCheck();
}

function horizontalCheck() {
    let currentPlayer = playerTurn;
    for (let i = 0; i < board.length; i++) {
        if (board[i][0] === currentPlayer && board[i][1] === currentPlayer && board[i][2] === currentPlayer) {
            youWin();
            break;
        }
    }
}

function verticalCheck() {
    let currentPlayer = playerTurn;
    for (let i = 0; i < board.length; i++) {
        if (board[0][i] === currentPlayer && board[1][i] === currentPlayer && board[2][i] === currentPlayer) {
            youWin();
            break;
        }
    }
}

function diagonalCheck() {
    let currentPlayer = playerTurn;
    if (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) {
        youWin();
    }
    else if (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer) {
        youWin();
    }
}

function drawCheck() {
    let movesLeft = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === 0) {
                movesLeft++;
            }
        }
    }
    if (movesLeft === 0) {
        youDraw();
    }
}

function youDraw() {
    winState++;
    reset.hidden = false;
    table.classList.toggle("disable-clicks");
    message.innerText = "Draw";
}

function youWin() {
    winState++;
    reset.hidden = false;
    table.classList.toggle("disable-clicks");

    if (playerTurn === 'x') {
        player1score++;
        document.getElementById('score1').innerText = player1score;
        player1name.style.color = 'green';
        player2name.style.color = 'blue';
        message.innerText = player1name.innerText + " Wins!";
    }
    else {
        player2score++;
        document.getElementById('score2').innerText = player2score;
        player1name.style.color = 'blue';
        player2name.style.color = 'green';
        message.innerText = player2name.innerText + " Wins!";
    }
}

function playAgain() {
    winState--;
    player1name.style.color = 'black';
    player2name.style.color = 'black';
    table.classList.toggle("disable-clicks");
    
    reset.hidden = true;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0) {
                continue;
            }
            else if (board[i][j] === 'x') {
                rows[i].getElementsByTagName("td")[j].classList.toggle('x');
            }
            else {
                rows[i].getElementsByTagName("td")[j].classList.toggle('o');
            }
        }
    }

    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];


    whoGoesFirst();
}