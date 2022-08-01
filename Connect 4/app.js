const message = document.getElementById('message');
const player1name = document.getElementById('player1');
const player2name = document.getElementById('player2');
const nameSubmission = document.getElementById('submit-names');
const buttons = document.getElementsByClassName('submit');
const reset = document.getElementById('reset');
let board = [[0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]]
let player1score = 0;
let player2score = 0;
let playerTurn;
let computerIntervalId;
let winState = 0;

nameSubmission.addEventListener('click', function() {
    initialize();
})

document.getElementById('player1name').addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      nameSubmission.click();
    }
});

document.getElementById('player2name').addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      nameSubmission.click();
    }
});

buttons[0].addEventListener('click', function() { addToken(0); })
buttons[1].addEventListener('click', function() { addToken(1); })
buttons[2].addEventListener('click', function() { addToken(2); })
buttons[3].addEventListener('click', function() { addToken(3); })
buttons[4].addEventListener('click', function() { addToken(4); })
buttons[5].addEventListener('click', function() { addToken(5); })
buttons[6].addEventListener('click', function() { addToken(6); })

reset.addEventListener('click', function() {
    playAgain();
})

for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
}
reset.hidden = true;

function initialize() {
    const textfield1 = document.getElementById('player1name');
    const textfield2 = document.getElementById('player2name');
    // a ? b : c
    //textfield1.value !== "" ? player1name.innerText = capitalize(textfield1.value) : "er beep b"
    if (textfield1.value !== "") {
        let name1 = capitalize(textfield1.value);
        player1name.innerText = name1;
    }
    else {
        return;
    }

    if (textfield2.value !== "") {
        let name2 = capitalize(textfield2.value);
        player2name.innerText = name2;
    }
    else {
        player2name.innerText = 'Computer'
    }
    message.innerText = "";
    textfield1.style.display = 'none';
    textfield2.style.display = 'none';
    nameSubmission.style.display = 'none';

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
    whoGoesFirst();
}

function capitalize(name) {
const lower = name.toLowerCase();
return name.charAt(0).toUpperCase() + lower.slice(1);
}

function whoGoesFirst() {
    playerTurn = Math.floor(Math.random() * 2 + 1);
    if (playerTurn === 1) {
        message.innerText = player1name.innerText + "'s Turn";
        for (let i = 1; i <= buttons.length; i++) {
            document.getElementById(`column${i}button`).style.backgroundColor = 'red';
        }
    }
    else {
        message.innerText = player2name.innerText + "'s Turn";
        for (let i = 1; i <= buttons.length; i++) {
            document.getElementById(`column${i}button`).style.backgroundColor = 'yellow';
        }
    }
    if (player2name.innerText === 'Computer' && playerTurn === 2) {
        for (let i = 1; i <= buttons.length; i++) {
            document.getElementById(`column${i}button`).style.backgroundColor = 'yellow';
        }
        computerThink();
    }
}

function addToken(column) {
    if (board[0][column] !== 0) {
        return;
    }
    for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][column] === 0) {
            board[i][column] = playerTurn;
            document.querySelector(`.row${i + 1} .column${column + 1}`).classList.toggle(`player${playerTurn}turn`);
            break;
        }
    }
    winCheck();
    drawCheck();
    if (winState === 0) {
        if (playerTurn === 1 && player2name.innerText === 'Computer') {
            changeTurn();
            computerThink();
        }
        else {
            changeTurn();
        }
    }
}

function computerThink() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
    computerIntervalId = setInterval(computerPause, 500);
}

function computerPause() {
    if (message.innerText === "Computer's Turn") {
        message.innerText = "Computer's Turn.";
    }
    else if (message.innerText === "Computer's Turn.") {
        message.innerText = "Computer's Turn..";
    }
    else if (message.innerText === "Computer's Turn..") {
        message.innerText = "Computer's Turn...";
    }
    else {
        clearInterval(computerIntervalId);
        computerIntervalId = null;
        computerTurn();
    }
}

function computerTurn() {
    let ready = false;
    let move;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                let tempMove = stopOpponent(i,j)
                if (board[0][tempMove] !== 0) {
                    continue;
                }
                else if (tempMove !== -1) {
                    move = tempMove;
                    ready = true;
                    break;
                }
            }
        }
    }
    if (!ready) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 2) {
                    let tempMove = winningMove(i,j)
                    if (board[0][tempMove] !== 0) {
                        continue;
                    }
                    else if (tempMove !== -1) {
                        move = tempMove;
                        ready = true;
                        break;
                    }
                }
            }
        }
    }
    if (!ready) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 2) {
                    let tempMove = bestMove(i,j)
                    if (board[0][tempMove] !== 0) {
                        continue;
                    }
                    else if (tempMove !== -1) {
                        move = tempMove;
                        ready = true;
                        break;
                    }
                }
            }
        }
    }
    if (!ready) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === 2) {
                    let tempMove = betterMove(i,j)
                    if (board[0][tempMove] !== 0) {
                        continue;
                    }
                    else if (tempMove !== -1) {
                        move = tempMove;
                        ready = true;
                        break;
                    }
                }
            }
        }
    }
    if (!ready) {
        let random = Math.floor(Math.random() * 7);
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
        addToken(random);
    }
    else {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
        addToken(move);
    }
}

function changeTurn() {
    if (winState !== 0) {
        return;
    }
    else if (playerTurn === 1) {
        playerTurn = 2;
        message.innerText = player2name.innerText + "'s Turn"
        for (let i = 1; i <= buttons.length; i++) {
            document.getElementById(`column${i}button`).style.backgroundColor = 'yellow';
        }
    }
    else {
        playerTurn = 1;
        message.innerText = player1name.innerText + "'s Turn"
        for (let i = 1; i <= buttons.length; i++) {
            document.getElementById(`column${i}button`).style.backgroundColor = 'red';
        }
    }
}

function winCheck() {
    horizontalCheck();
    verticalCheck();
    diagonalLeftCheck();
    diagonalRightCheck();
    drawCheck();
}

function horizontalCheck() {
    let currentPlayer = playerTurn;
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j <= board[i].length - 4; j++) {
            if (board[i][j] === currentPlayer && board[i][j + 1] === currentPlayer && board[i][j + 2] === currentPlayer && board[i][j + 3] === currentPlayer) {
                youWin();
                break;
            }
        }
    }
}

function verticalCheck() {
    let currentPlayer = playerTurn;
    for (let i = board.length - 1; i >= board.length - 3; i--) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === currentPlayer && board[i - 1][j] === currentPlayer && board[i - 2][j] === currentPlayer && board[i - 3][j] === currentPlayer) {
                youWin();
                break;
            }
        }
    }
}

function diagonalLeftCheck() {
    let currentPlayer = playerTurn;
    for (let i = board.length - 1; i >= 3; i--) {
        for (let j = board[i].length - 1; j >= 3; j--) {
            if (board[i][j] === currentPlayer && board[i - 1][j - 1] === currentPlayer && board[i - 2][j - 2] === currentPlayer && board[i - 3][j - 3] === currentPlayer) {
                youWin();
                break;
            }
        }
    }
}

function diagonalRightCheck() {
    let currentPlayer = playerTurn;
    for (let i = board.length - 1; i >= 3; i--) {
        for (let j = 0; j <= board[i].length - 4; j++) {
            if (board[i][j] === currentPlayer && board[i - 1][j + 1] === currentPlayer && board[i - 2][j + 2] === currentPlayer && board[i - 3][j + 3] === currentPlayer) {
                youWin();
                break;
            }
        }
    }
}

function drawCheck() {
    let movesLeft = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
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
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    reset.hidden = false;

    player1name.style.color = 'black';
    player2name.style.color = 'black';
    message.innerText = player1name.innerText + " Wins!";
}

function youWin() {
    winState++;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    reset.hidden = false;

    if (playerTurn === 1) {
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
    player1name.style.color = 'red';
    player2name.style.color = 'yellow';
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
    reset.hidden = true;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0) {
                continue;
            }
            else if (board[i][j] === 1) {
                document.querySelector(`.row${i + 1} .column${j + 1}`).classList.toggle(`player1turn`);
            }
            else {
                document.querySelector(`.row${i + 1} .column${j + 1}`).classList.toggle(`player2turn`);
            }
        }
    }

    board = [[0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]]


    whoGoesFirst();
}

function stopOpponent(yCoordinate,xCoordinate) {
    let north;
    let northeast;
    let east;
    let southeast;
    let south;
    let southwest;
    let west;
    let northwest;
    let deepEast;
    let deepWest;
    let farNortheast;
    let farEast;
    let farSoutheast;
    let farSouth;
    let farSouthwest;
    let farWest;
    let farNorthwest;
    if (yCoordinate === 0 && xCoordinate === 0) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (yCoordinate === 5 && xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 0 && xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 5 && xCoordinate === 6) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (yCoordinate === 0 && xCoordinate === 1) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (yCoordinate === 0 && xCoordinate === 5) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 0) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 1 && xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (yCoordinate === 1 && xCoordinate === 1) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (yCoordinate === 1 && xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 1 && xCoordinate === 5) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 1) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 4 && xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 4 && xCoordinate === 1) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 4 && xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (yCoordinate === 4 && xCoordinate === 5) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (yCoordinate === 4) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 5 && xCoordinate === 1) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 5 && xCoordinate === 5) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (yCoordinate === 5) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (xCoordinate === 1) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (xCoordinate === 5) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }

    if (farWest === 1 && west === 1 && east === 0 && southeast !== 0) {
        return xCoordinate + 1;
    }
    else if (farEast === 1 && east === 1 && west === 0 && southwest !== 0) {
        return xCoordinate - 1;
    }
    else if (farSouthwest === 1 && southwest === 1 && northeast === 0 && east !== 0) {
        return xCoordinate + 1;
    }
    else if (farSouth === 1 && south === 1 && north === 0) {
        return xCoordinate;
    }
    else if (farSoutheast === 1 && southeast === 1 && northwest === 0 && west !== 0) {
        return xCoordinate - 1;
    }
    else if (farNorthwest === 1 && northwest === 1 && southeast === 0 && deepEast !== 0) {
        return xCoordinate + 1;
    }
    else if (farNortheast === 1 && northeast === 1 && southwest === 0 && deepWest !== 0) {
        return xCoordinate - 1;
    }
    else if (west === 1 && farEast === 1 && east === 0 && deepEast !== 0) {
        return xCoordinate + 1;
    }
    else if (farWest === 1 && east === 1 && west === 0 && deepWest !== 0) {
        return xCoordinate - 1;
    }
    else if (northwest === 1 && farSoutheast === 1 && southeast === 0 && deepEast !== 0) {
        return xCoordinate + 1;
    }
    else if (farNorthwest === 1 && southeast === 1 && northwest === 0 && west !== 0) {
        return xCoordinate - 1;
    }
    else if (northeast === 1 && farSouthwest === 1 && southwest === 0 && deepWest !== 0) {
        return xCoordinate - 1;
    }
    else if (farNortheast === 1 && southwest === 1 && northeast === 0 && east !== 0) {
        return xCoordinate + 1;
    }
    else if (south === 1 && southeast === 1 && southwest === 0) {
        return xCoordinate - 1;
    }
    else if (south === 1 && southwest === 1 && southeast === 0) {
        return xCoordinate + 1;
    }
    else {
        return -1;
    }
}

function winningMove(yCoordinate,xCoordinate) {
    let north;
    let northeast;
    let east;
    let southeast;
    let south;
    let southwest;
    let west;
    let northwest;
    let deepEast;
    let deepWest;
    let farNortheast;
    let farEast;
    let farSoutheast;
    let farSouth;
    let farSouthwest;
    let farWest;
    let farNorthwest;
    if (yCoordinate === 0 && xCoordinate === 0) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (yCoordinate === 5 && xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 0 && xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 5 && xCoordinate === 6) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (yCoordinate === 0 && xCoordinate === 1) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (yCoordinate === 0 && xCoordinate === 5) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 0) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 1 && xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (yCoordinate === 1 && xCoordinate === 1) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (yCoordinate === 1 && xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 1 && xCoordinate === 5) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 1) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
    }
    else if (yCoordinate === 4 && xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 4 && xCoordinate === 1) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 4 && xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (yCoordinate === 4 && xCoordinate === 5) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (yCoordinate === 4) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 5 && xCoordinate === 1) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (yCoordinate === 5 && xCoordinate === 5) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (yCoordinate === 5) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
    }
    else if (xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (xCoordinate === 1) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
    }
    else if (xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else if (xCoordinate === 5) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }
    else {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        farNortheast = board[yCoordinate - 2][xCoordinate + 2];
        farEast = board[yCoordinate][xCoordinate + 2];
        farSoutheast = board[yCoordinate + 2][xCoordinate + 2];
        farSouth = board[yCoordinate + 2][xCoordinate];
        farSouthwest = board[yCoordinate + 2][xCoordinate - 2];
        farWest = board[yCoordinate][xCoordinate - 2];
        farNorthwest = board[yCoordinate - 1][xCoordinate - 1];
    }

    if (farWest === 2 && west === 2 && east === 0 && southeast !== 0) {
        return xCoordinate + 1;
    }
    else if (farEast === 2 && east === 2 && west === 0 && southwest !== 0) {
        return xCoordinate - 1;
    }
    else if (farSouthwest === 2 && southwest === 2 && northeast === 0 && east !== 0) {
        return xCoordinate + 1;
    }
    else if (farSoutheast === 2 && southeast === 2 && northwest === 0 && west !== 0) {
        return xCoordinate - 1;
    }
    else if (farNorthwest === 2 && northwest === 2 && southeast === 0 && deepEast !== 0) {
        return xCoordinate + 1;
    }
    else if (farNortheast === 2 && northeast === 2 && southwest === 0 && deepWest !== 0) {
        return xCoordinate - 1;
    }
    else if (farSouth === 2 && south === 2 && north === 0) {
        return xCoordinate;
    }
    else if (west === 1 && farEast === 1 && east === 0 && deepEast !== 0) {
        return xCoordinate + 1;
    }
    else if (farWest === 1 && east === 1 && west === 0 && deepWest !== 0) {
        return xCoordinate - 1;
    }
    else if (northwest === 1 && farSoutheast === 1 && southeast === 0 && deepEast !== 0) {
        return xCoordinate + 1;
    }
    else if (farNorthwest === 1 && southeast === 1 && northwest === 0 && west !== 0) {
        return xCoordinate - 1;
    }
    else if (northeast === 1 && farSouthwest === 1 && southwest === 0 && deepWest !== 0) {
        return xCoordinate - 1;
    }
    else if (farNortheast === 1 && southwest === 1 && northeast === 0 && east !== 0) {
        return xCoordinate + 1;
    }
    else {
        return -1;
    }
}

function bestMove(yCoordinate, xCoordinate) {
    let north;
    let northeast;
    let east;
    let southeast;
    let south;
    let southwest;
    let west;
    let northwest;
    let deepEast;
    let deepWest;
    let farNortheast;
    let farEast;
    let farSoutheast;
    let farSouthwest;
    let farWest;
    let farNorthwest;
    if (yCoordinate === 0 && xCoordinate === 0) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
    }
    else if (yCoordinate === 5 && xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
    }
    else if (yCoordinate === 0 && xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
    }
    else if (yCoordinate === 5 && xCoordinate === 6) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
    }
    else if (yCoordinate === 0) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
    }
    else if (yCoordinate === 5) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
    }
    else if (xCoordinate === 0 && yCoordinate < 4) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
    }
    else if (xCoordinate === 6 && yCoordinate < 4) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
    }
    else if (xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
    }
    else if (xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
    }
    else if (yCoordinate < 4) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
    }
    else {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
    }

    if (xCoordinate < 3) {
        if (southwest === 2 && northeast === 0 && east !== 0) {
            return xCoordinate + 1;
        }
        else if (southeast === 2 && northwest === 0 && west !== 0) {
            return xCoordinate - 1;
        }
        else if (west === 2 && east === 0 && southeast !== 0) {
            return xCoordinate + 1;
        }
        else if (east === 2 && west === 0 && southwest !== 0) {
            return xCoordinate - 1;
        }
        else if (south === 2 && north === 0) {
            return xCoordinate;
        }
        else if (northwest === 2 && southeast === 0 && deepEast !== 0) {
            return xCoordinate + 1;
        }
        else if (northeast === 2 && southwest === 0 && deepWest !== 0) {
            return xCoordinate - 1;
        }
        else if (southwest === 2 && farNorthwest === 0 && farWest !==0 && deepWest !== 0) {
            return xCoordinate + 1;
        } 
        else if (northeast === 2 && farSouthwest === 0 && deepWest === 0) {
            return xCoordinate - 1;
        }
        else if (southeast === 2 && farNortheast === 0 && farEast !== 0 && deepEast !== 0) {
            return xCoordinate - 1;
        }
        else if (northwest === 2 && farSoutheast === 0 && deepEast === 0) {
            return xCoordinate + 1
        }
        else {
            return -1;
        }
    }
    else {
        if (southeast === 2 && northwest === 0 && west !== 0) {
            return xCoordinate - 1;
        }
        else if (southwest === 2 && northeast === 0 && east !== 0) {
            return xCoordinate + 1;
        }
        else if (east === 2 && west === 0 && southwest !== 0) {
            return xCoordinate - 1;
        }
        else if (west === 2 && east === 0 && southeast !== 0) {
            return xCoordinate + 1;
        }
        else if (south === 2 && north === 0) {
            return xCoordinate;
        }
        else if (northeast === 2 && southwest === 0 && deepWest !== 0) {
            return xCoordinate - 1;
        }
        else if (northwest === 2 && southeast === 0 && deepEast !== 0) {
            return xCoordinate + 1;
        }
        else if (southeast === 2 && farNortheast === 0 && farEast !== 0 && deepEast !== 0) {
            return xCoordinate - 1;
        }
        else if (northwest === 2 && farSoutheast === 0 && deepEast === 0) {
            return xCoordinate + 1
        }
        else if (southwest === 2 && farNorthwest === 0 && farWest !==0 && deepWest !== 0) {
            return xCoordinate + 1;
        } 
        else if (northeast === 2 && farSouthwest === 0 && deepWest === 0) {
            return xCoordinate - 1;
        }
        else {
            return -1;
        }
    }
}

function betterMove(yCoordinate, xCoordinate) {
    let north;
    let northeast;
    let east;
    let southeast;
    let southwest;
    let west;
    let northwest;
    let deepEast;
    let deepWest;
    if (yCoordinate === 0 && xCoordinate === 0) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
    }
    else if (yCoordinate === 5 && xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
    }
    else if (yCoordinate === 0 && xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
    }
    else if (yCoordinate === 5 && xCoordinate === 6) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
    }
    else if (yCoordinate === 0) {
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
    }
    else if (yCoordinate === 5) {
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
    }
    else if (xCoordinate === 0 && yCoordinate < 4) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
    }
    else if (xCoordinate === 6 && yCoordinate < 4) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
    }
    else if (xCoordinate === 0) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
    }
    else if (xCoordinate === 6) {
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        north = board[yCoordinate - 1][xCoordinate];
    }
    else if (yCoordinate < 4) {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
        deepWest = board[yCoordinate + 2][xCoordinate - 1];
        deepEast = board[yCoordinate + 2][xCoordinate + 1];
    }
    else {
        north = board[yCoordinate - 1][xCoordinate];
        northeast = board[yCoordinate - 1][xCoordinate + 1];
        east = board[yCoordinate][xCoordinate + 1];
        southeast = board[yCoordinate + 1][xCoordinate + 1];
        south = board[yCoordinate + 1][xCoordinate];
        southwest = board[yCoordinate + 1][xCoordinate - 1]; 
        west = board[yCoordinate][xCoordinate - 1];
        northwest = board[yCoordinate - 1][xCoordinate - 1];
    }

    if (xCoordinate < 3) {
        if (northeast === 0 && east !== 0) {
            return xCoordinate + 1;
        }
        else if (northwest === 0 && west !== 0) {
            return xCoordinate - 1;
        }
        else if (east === 0 && southeast !== 0) {
            return xCoordinate + 1;
        }
        else if (west === 0 && southwest !== 0) {
            return xCoordinate - 1;
        }
        else if (north === 0) {
            return xCoordinate;
        }
        else if (southeast === 0 && deepEast !== 0) {
            return xCoordinate + 1;
        }
        else if (southwest === 0 && deepWest !== 0) {
            return xCoordinate - 1;
        }
        else {
            return -1;
        }
    }
    else {
        if (northwest === 0 && west !== 0) {
            return xCoordinate - 1;
        }
        else if (northeast === 0 && east !== 0) {
            return xCoordinate + 1;
        }
        else if (west === 0 && southwest !== 0) {
            return xCoordinate - 1;
        }
        else if (east === 0 && southeast !== 0) {
            return xCoordinate + 1;
        }
        else if (north === 0) {
            return xCoordinate;
        }
        else if (southwest === 0 && deepWest !== 0) {
            return xCoordinate - 1;
        }
        else if (southeast === 0 && deepEast !== 0) {
            return xCoordinate + 1;
        }
        else {
            return -1;
        }
    }
}