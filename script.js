//###menu section###

//menu elements

const highScoreMenuElement = document.querySelector('.menu .high-score'),
difficultyBtn =document.querySelectorAll('.menu .difficulties button'),
colorBtn = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
wrapper = document.querySelector(".wrapper"),
play = document.querySelector(".play"),
menu = document.querySelector(".menu");

//menu variables

let highScore= localStorage.getItem('high-score') || 0,
difficulty = 125,
selectedColor = "#60CBFF";

//##menu logic##

//changing high score

highScoreMenuElement.innerText = `High Score: ${highScore}`;

//change color via color buttons

colorBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
    difficultyChange();
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    if(selectedColor === window.getComputedStyle(playBoard).getPropertyPriority('background-color') && selectedColor === '#FF003D'){
        selectedColor = '#60CBFF';
    }
});
});

//change color via color picker

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

//change difficulty

difficultyBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.menu .difficulties .active').classList.remove('active');
        btn.classList.add('active')
        difficultyChange();
        if(btn.id == 'easy'){
            difficulty = 175;
        } else if(btn.id == 'normal'){
            difficulty = 125;
        }else if(btn.id  == 'hard'){
            difficulty = 75;
        }else{
            difficulty = 50;
        }
    })
})

//start game

play.addEventListener("click", () => {
    wrapper.classList.add("active");
    menu.classList.add("hide");
    start();
    changeFoodPosition();
    initGame();
    startMoving();
});

//###game section###

//game elements

const highScoreFailElement = document.querySelector('.game-over .high-score'),
highScoreElement = document.querySelector('.wrapper .high-score'),
scoreFailElement = document.querySelector('.game-over .score'),
scoreElement = document.querySelector('.wrapper .score'),
controls = document.querySelectorAll('.controls i'),
playBoard = document.querySelector(".play-board"),
failScreen = document.querySelector('.game-over'),
winScreen = document.querySelector('.win')
restartBtn = document.querySelector('.game-over .restart'),
replayBtn = document.querySelector('.win .replay')
failText = document.querySelector('.game-over .message'),
winText = document.querySelector('.win .message')

//game variables

let velocityX = 0,velocityY = 0,
snakeX = 5,snakeY = 10,
foodX, foodY,
gameOver = false,
snakeBody = [],
score = 0;

//##game logic##

//changing high score

highScoreElement.innerText = `High Score: ${highScore}`

//editing game visuals

function initGame() {
    if(gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style=" grid-area: ${foodY} / ${foodX}">
    <img src="assets/images/apple.svg"></img>
    </div>`;

    if(snakeX === foodX && snakeY === foodY){
        snakeBody.push([foodX,foodY]);
        changeFoodPosition();
        eat();
        score++;
        console.log(score)
        if(score > 85 && score < 90) endOst();
        if(score >= 90) return end();
        scoreElement.innerText = `Score: ${score}`;
        highScore = score > highScore ? score : highScore;
        localStorage.setItem('high-score',highScore);
        highScoreElement.innerText = `High Score: ${highScore}`
    }

        for(let i = snakeBody.length -1; i > 0; i--){
            snakeBody[i] = snakeBody[i -1];
        }        

    snakeX += velocityX;
    snakeY += velocityY;
    snakeBody[0]=[snakeX,snakeY];

    if(snakeX <=0 || snakeX >30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    for(let i=0; i< snakeBody.length; i++){
        if(i > 0){
            htmlMarkup += `<div class="body" style=" background:${selectedColor}; grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;
        }else{
            htmlMarkup += `<div class="head" style=" background:${selectedColor}; grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;
        }
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}

//change food position

function changeFoodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

//moving snake on arrows and keys

function changeDirection(e){
    if(e.key === 'ArrowUp' && velocityY !== 1 || e.key === 'w' && velocityY !== 1 || e.key === 'ص' && velocityY !== 1){
        velocityX = 0;
        velocityY = -1;
    }else if(e.key === 'ArrowDown' && velocityY !== -1  || e.key === 's' && velocityY !== -1  || e.key === 'س' && velocityY !== -1 ){
        velocityX = 0;
        velocityY = 1;
    }else if(e.key === 'ArrowLeft' && velocityX !== 1  || e.key === 'a' && velocityX !== 1  || e.key === 'ش' && velocityX !== 1 ){
        velocityX = -1;
        velocityY = 0;
    }else if(e.key === 'ArrowRight' && velocityX !== -1 || e.key === 'd' && velocityX !== -1 || e.key === 'ي' && velocityX !== -1 ){
        velocityX = 1;
        velocityY = 0;
    }else{
        return;
    }
}

//##game over logic##

//game over variables

const failMessages = `
[Player] was distracted by a butterfly and forgot they were playing the game 
Didn't see that coming, didn't you?
You died.
Wasted.
[player] logged off from life.
جاك الموت يا تارك الصلاة
[Player] tried to break the second dimension.
[Player] Went to the shadow realm.
Mission failed we will eat him next time.
Game Over Yeeeaaaahhhhh.
لماذا نحن هنا
[director]: Cut, you weren't supposed to break the third wall.
Ah shit, here we go again.
`,
failMessagesLength = failMessages.split(/\r\n|\r|\n/).length -2;


function handleGameOver(){
    let failMessage = failMessages.split(/\r\n|\r|\n/)[Math.floor(Math.random() * (failMessagesLength - 1 + 1) + 1)];
    stopMoving();
    lose();
    scoreElement.innerText = "Score: 0";
    scoreFailElement.innerText = `Score: ${score}`;
    highScoreFailElement.innerText = `High Score: ${highScore}`;
    failText.innerText= failMessage;
    playBoard.innerHTML='';
    failScreen.classList.remove('hide');
    wrapper.classList.remove("active");
    gameOver = false;
    snakeBody = [];
    velocityX = 0;
    velocityY = 0;
    snakeY = 10;
    snakeX = 5;
    score = 0;
}

//restart

restartBtn.addEventListener('click',() => {
    failScreen.classList.add("hide");
    wrapper.classList.add("active");
    start();
    changeFoodPosition();
    initGame();
    startMoving();
});

//moving snake automatically

function stopMoving() {
    clearInterval(timer);
}

function startMoving() {
    timer = setInterval(initGame, difficulty);
}

//game events

//keyboard controls

document.addEventListener('keydown',changeDirection);

//touch controls

controls.forEach(key => {
    key.addEventListener('click',() => changeDirection({ key: key.dataset.key }));
});

//pause game

document.addEventListener("visibilitychange", () => {
    if(wrapper.classList.contains('active')){
        if (document.visibilityState == "visible") {
            stopMoving();
        } else {
            startMoving();
        }
    }
});

//win game

const winMessages = `
You won!
Congrats!
Victorious.
You have dominated the apples.
[reporter]: An apple pandemic is sweeping the world!
`,
winMessagesLength = winMessages.split(/\r\n|\r|\n/).length -2;

let winMessage = winMessages.split(/\r\n|\r|\n/)[Math.floor(Math.random() * (winMessagesLength - 1 + 1) + 1)];

function end(){
    winScreen.classList.remove('hide');
    wrapper.classList.add('active');
    stopMoving();
    win();
    winText.innerText= winMessage;
    playBoard.innerHTML='';
    gameOver = false;
    snakeBody = [];
    velocityX = 0;
    velocityY = 0;
    snakeY = 10;
    snakeX = 5;
    score = 0;
}

replayBtn.addEventListener('click',() => {
    winScreen.classList.add("hide");
    wrapper.classList.add("active");
    start();
    changeFoodPosition();
    initGame();
    startMoving();
})

//play sounds

let audio;

function pauseAudio() {
    if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
}


function eat(){
    pauseAudio();
    audio = new Audio("assets/audio/eat.mp3");
    audio.play();
}

function start(){
    pauseAudio();
    audio = new Audio("assets/audio/start.mp3");
    audio.play();
}

function difficultyChange(){
    pauseAudio();
    audio = new Audio("assets/audio/menu.mp3");
    audio.play();
}

function lose(){
    pauseAudio();
    audio = new Audio("assets/audio/lose.mp3");
    audio.play();
}

function endOst(){
    pauseAudio();
    audio = new Audio("assets/audio/ending.mp3");
    audio.play();
}

function win(){
    pauseAudio();
    audio = new Audio("assets/audio/win.mp3");
    audio.play();
}