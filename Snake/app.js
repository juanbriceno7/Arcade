const grid = document.querySelector('.grid');
const score = document.querySelector('#current-score');
const highscore = document.querySelector('#highscore');
const popup1 = document.querySelector('.popup1');
const popup2 = document.querySelector('.popup2');
const wallsUp = document.querySelector('#walls-up');
const wallsDown = document.querySelector('#walls-down');
const reset = document.querySelector('#reset');
let gamemode;
let rows;
let snake;
let mushroomTailCount = 0;
let poisonCount = 0;
let direction;
let oldDirection;
let currentScore = 0;
let bestScore = 0;
let speed = 1;
let interval;
let intervalTime;

document.addEventListener('DOMContentLoaded', function() {
    popup2.style.display = 'none';
    createBoard();
    // startGame();
})

wallsUp.addEventListener('click', function() {
    popup1.style.display = 'none'
    gamemode = 0;
    startGame();
});

wallsDown.addEventListener('click', function() {
    popup1.style.display = 'none'
    gamemode = 1;
    startGame();
});

document.addEventListener("keyup", function(event) {
    changeDirection(event);
});

reset.addEventListener('click', function() {
    playAgain();
});

function createBoard() {
    for (let i = 0; i < 20; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < 20; j++) {
            let cell = document.createElement('td');
            if (i % 2 === 0) {
                if (j % 2 === 0) {
                    cell.classList.add('light')
                }
                else {
                    cell.classList.add('dark')
                }
            }
            else {
                if (j % 2 !== 0) {
                    cell.classList.add('light')
                }
                else {
                    cell.classList.add('dark')
                }
            }
            row.appendChild(cell);
        }
    grid.appendChild(row)
    }
}

function startGame() {
    rows = document.querySelectorAll('tr')
    direction = [0, 1];
    oldDirection = [0, 1];
    score.innerText = currentScore;
    highscore.innerText = bestScore;
    intervalTime = 500;
    snake = [[0, 2], [0, 1], [0, 0]];
    for (let i = 0; i < snake.length; i++) {
        rows[0].getElementsByTagName('td')[i].classList.add("snake");
    }
    popup2.style.display = 'none';
    randomApple();
    interval = setInterval(moveSnake, intervalTime / speed);
}

function changeDirection(event) {
    if (poisonCount === 0) {
        if (event.key === 'ArrowUp') {
            direction = [-1, 0];
        }
        else if (event.key === 'ArrowDown') {
            direction = [1,0];
        }
        else if (event.key === 'ArrowLeft') {
            direction = [0, -1];
        }
        else if (event.key === 'ArrowRight') {
            direction = [0, 1];
        }
        else if (event.key === 'w') {
            direction = [-1, 0];
        }
        else if (event.key === 's') {
            direction = [1, 0];
        }
        else if (event.key === 'a') {
            direction = [0, -1];
        }
        else if (event.key === 'd') {
            direction = [0, 1];
        }
    }
    else {
        poisonCount--;
        if (event.key === 'ArrowUp') {
            direction = [1, 0];
        }
        else if (event.key === 'ArrowDown') {
            direction = [-1,0];
        }
        else if (event.key === 'ArrowLeft') {
            direction = [0, 1];
        }
        else if (event.key === 'ArrowRight') {
            direction = [0, -1];
        }
        else if (event.key === 'w') {
            direction = [1, 0];
        }
        else if (event.key === 's') {
            direction = [-1, 0];
        }
        else if (event.key === 'a') {
            direction = [0, 1];
        }
        else if (event.key === 'd') {
            direction = [0, -1];
        }
    }
}

//keeps the snake from getting confused and eating its own neck
function getDirection() {
    if (arrayEquality(direction, [1,0]) && arrayEquality(oldDirection, [-1, 0])) {
        direction = oldDirection;
        return direction;
    }
    else if (arrayEquality(direction, [-1,0]) && arrayEquality(oldDirection, [1, 0])) {
        direction = oldDirection;
        return direction;
    }
    else if (arrayEquality(direction, [0,1]) && arrayEquality(oldDirection, [0, -1])) {
        direction = oldDirection;
        return direction;
    }
    else if (arrayEquality(direction, [0,-1]) && arrayEquality(oldDirection, [0, 1])) {
        direction = oldDirection;
        return direction;
    }
    else if (arrayEquality(direction, [1,0]) && arrayEquality(oldDirection, [-1, 0])) {
        direction = oldDirection;
        return direction;
    }
    else if (arrayEquality(direction, [-1,0]) && arrayEquality(oldDirection, [1, 0])) {
        direction = oldDirection;
        return direction;
    }
    else if (arrayEquality(direction, [0,1]) && arrayEquality(oldDirection, [0, -1])) {
        direction = oldDirection;
        return direction;
    }
    else if (arrayEquality(direction, [0,-1]) && arrayEquality(oldDirection, [0, 1])) {
        direction = oldDirection;
        return direction;
    }
    else {
        oldDirection = direction;
        return direction;
    }
}

function moveSnake() {
    let head;
    let tail;
    let currentDirection = getDirection();
    // moves snake to the bottom if you hit the top wall
    if (snake[0][0] - 1 < 0 && arrayEquality(currentDirection, [-1, 0])) {
        if (gamemode === 0) {
            youLose();
        }
        else {
            head = [snake[0][0] + 19, snake[0][1]]
            tail = snake.pop();
            snake.unshift(head);
            rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.add('snake');
            rows[tail[0]].getElementsByTagName('td')[tail[1]].classList.remove('snake');
        }
    }
    // moves snake to the top if you hit the bottom wall
    else if (snake[0][0] + 1 >= 20 && arrayEquality(currentDirection, [1, 0])) {
        if (gamemode === 0) {
            youLose();
        }
        else {
            head = [snake[0][0] - 19, snake[0][1]]
            tail = snake.pop();
            snake.unshift(head);
            rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.add('snake');
            rows[tail[0]].getElementsByTagName('td')[tail[1]].classList.remove('snake');
        }
    }
    // moves snake to the right if you hit the left wall
    else if (snake[0][1] - 1 < 0 && arrayEquality(currentDirection, [0, -1])) {
        if (gamemode === 0) {
            youLose();
        }
        else {
            head = [snake[0][0], snake[0][1] + 19]
            tail = snake.pop();
            snake.unshift(head);
            rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.add('snake');
            rows[tail[0]].getElementsByTagName('td')[tail[1]].classList.remove('snake');
        }
    }
    // moves snake to the left if you hit the right wall
    else if (snake[0][1] + 1 >= 20 && arrayEquality(currentDirection, [0, 1])) {
        if (gamemode === 0) {
            youLose();
        }
        else {
            head = [snake[0][0], snake[0][1] - 19]
            tail = snake.pop();
            snake.unshift(head);
            rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.add('snake');
            rows[tail[0]].getElementsByTagName('td')[tail[1]].classList.remove('snake');
        }
    }
    //loses the game if the snake tries to eat itself
    else if (rows[snake[0][0] + currentDirection[0]].getElementsByTagName('td')[snake[0][1] + currentDirection[1]].classList.contains('snake')) {
        youLose();
    }
    //moves the snake forward
    else {
        head = [snake[0][0] + currentDirection[0], snake[0][1] + currentDirection[1]]
        tail = snake.pop();
        snake.unshift(head);
        rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.add('snake');
        rows[tail[0]].getElementsByTagName('td')[tail[1]].classList.remove('snake');
    }
    
    // increases tail count if you ate a mushroom
    if (mushroomTailCount !== 0) {
        snake.push(tail)
        rows[tail[0]].getElementsByTagName('td')[tail[1]].classList.add('snake');
        mushroomTailCount--;
    }
    
    eatApple(tail);
    eatOrange();
    eatCherry();
    eatMushroom(tail);
    eatPoison();
}
function youLose() {
        popup2.style.display = 'flex'
        return clearInterval(interval);
}

function arrayEquality(array1, array2) {
    if (array1.length !== array2.length) {
        return false
    }
    
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}

function randomApple() {
    let appleIndex = Math.floor(Math.random() * 400);
    let appleY = Math.floor(appleIndex / 20);
    let appleX = appleIndex % 20;
    if (rows[appleY].getElementsByTagName('td')[appleX].classList.contains('snake') ||
        rows[appleY].getElementsByTagName('td')[appleX].classList.contains('cherry') ||
        rows[appleY].getElementsByTagName('td')[appleX].classList.contains('orange') ||
        rows[appleY].getElementsByTagName('td')[appleX].classList.contains('mushroom') ||
        rows[appleY].getElementsByTagName('td')[appleX].classList.contains('poison')) {
        randomApple();
    }
    else {
        rows[appleY].getElementsByTagName('td')[appleX].classList.add('apple');
    }
}

function eatApple(tail) { //tail is an array of 2 values [y, x]
    if (rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.contains('apple')) {
        rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.remove('apple');
        rows[tail[0]].getElementsByTagName('td')[tail[1]].classList.add('snake');
        snake.push(tail);
        randomApple();
        let random = Math.floor(Math.random() * 4)
        if (random === 0) {
            randomOrange();
        }
        else if (random === 1) {
            randomCherry();
        }
        else if (random === 2) {
            randomMushroom();
        }
        else {
            randomPoison();
        }
        currentScore++;
        score.innerText = currentScore;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            highscore.innerText = bestScore;
        }
        speed = speed * 1.1;
        clearInterval(interval);
        interval = setInterval(moveSnake, intervalTime / speed);
    }
}

function randomOrange() {
    orangeIndex = Math.floor(Math.random() * 400);
    let orangeY = Math.floor(orangeIndex / 20);
    let orangeX = orangeIndex % 20;
    if (rows[orangeY].getElementsByTagName('td')[orangeX].classList.contains('snake') ||
        rows[orangeY].getElementsByTagName('td')[orangeX].classList.contains('apple') ||
        rows[orangeY].getElementsByTagName('td')[orangeX].classList.contains('cherry') ||
        rows[orangeY].getElementsByTagName('td')[orangeX].classList.contains('mushroom') ||
        rows[orangeY].getElementsByTagName('td')[orangeX].classList.contains('poison')) {
        randomOrange();
    }
    else {
        rows[orangeY].getElementsByTagName('td')[orangeX].classList.add('orange');
    }
}

function eatOrange() { 
    if (rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.contains('orange')) {
        rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.remove('orange');
        speed = speed * 0.75;
        currentScore++;
        score.innerText = currentScore;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            highscore.innerText = bestScore;
        }
        clearInterval(interval);
        interval = setInterval(moveSnake, intervalTime / speed);
    }
}

function randomCherry() {
    cherryIndex = Math.floor(Math.random() * 400);
    let cherryY = Math.floor(cherryIndex / 20);
    let cherryX = cherryIndex % 20;
    if (rows[cherryY].getElementsByTagName('td')[cherryX].classList.contains('snake') ||
        rows[cherryY].getElementsByTagName('td')[cherryX].classList.contains('apple') ||
        rows[cherryY].getElementsByTagName('td')[cherryX].classList.contains('orange') ||
        rows[cherryY].getElementsByTagName('td')[cherryX].classList.contains('mushroom') ||
        rows[cherryY].getElementsByTagName('td')[cherryX].classList.contains('poison')) {
        randomCherry();
    }
    else {
        rows[cherryY].getElementsByTagName('td')[cherryX].classList.add('cherry');
    }
}

function eatCherry() { 
    if (rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.contains('cherry')) {
        rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.remove('cherry');
        speed = speed * 1.5;
        currentScore++;
        score.innerText = currentScore;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            highscore.innerText = bestScore;
        }
        clearInterval(interval);
        interval = setInterval(moveSnake, intervalTime / speed);
    }
}

function randomMushroom() {
    mushroomIndex = Math.floor(Math.random() * 400);
    let mushroomY = Math.floor(mushroomIndex / 20);
    let mushroomX = mushroomIndex % 20;
    if (rows[mushroomY].getElementsByTagName('td')[mushroomX].classList.contains('snake') ||
    rows[mushroomY].getElementsByTagName('td')[mushroomX].classList.contains('apple') ||
    rows[mushroomY].getElementsByTagName('td')[mushroomX].classList.contains('orange') ||
    rows[mushroomY].getElementsByTagName('td')[mushroomX].classList.contains('cherry') ||
    rows[mushroomY].getElementsByTagName('td')[mushroomX].classList.contains('poison')) {
        randomMushroom();
    }
    else {
        rows[mushroomY].getElementsByTagName('td')[mushroomX].classList.add('mushroom');
    }
}

function eatMushroom(tail) {
    if (rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.contains('mushroom')) {
        rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.remove('mushroom');
        rows[tail[0]].getElementsByTagName('td')[tail[1]].classList.add('snake');
        snake.push(tail);
        mushroomTailCount = 4;
        currentScore++;
        score.innerText = currentScore;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            highscore.innerText = bestScore;
        }
    }
}

function randomPoison() {
    poisonIndex = Math.floor(Math.random() * 400);
    let poisonY = Math.floor(poisonIndex / 20);
    let poisonX = poisonIndex % 20;
    if (rows[poisonY].getElementsByTagName('td')[poisonX].classList.contains('snake') ||
        rows[poisonY].getElementsByTagName('td')[poisonX].classList.contains('apple') ||
        rows[poisonY].getElementsByTagName('td')[poisonX].classList.contains('orange') ||
        rows[poisonY].getElementsByTagName('td')[poisonX].classList.contains('mushroom') ||
        rows[poisonY].getElementsByTagName('td')[poisonX].classList.contains('cherry')) {
        randomPoison();
    }
    else {
        rows[poisonY].getElementsByTagName('td')[poisonX].classList.add('poison');
    }
}

function eatPoison() {
    if (rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.contains('poison')) {
        rows[snake[0][0]].getElementsByTagName('td')[snake[0][1]].classList.remove('poison');
        poisonCount = 5;
        currentScore++;
        score.innerText = currentScore;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            highscore.innerText = bestScore;
        }
    }
}

function playAgain() {
    grid.innerHTML = "";
    currentScore = 0;
    speed = 1;
    createBoard();
    startGame();
}