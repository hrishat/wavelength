const can = document.getElementById("canvas");
const con = can.getContext("2d");

// image loading

let home = new Image();
let start = new Image();
let bg = new Image();
let bird = new Image();
let dragon = new Image();
let rhino = new Image();
let bottom = new Image();
let boost = new Image();
let gameOver = new Image();
let restart = new Image();

home.src = "images/home.jpg";
start.src = "images/start.png";
bg.src = "images/bg.jpg";
bird.src = "images/babylon.png";
dragon.src = "images/dragon.png";
rhino.src = "images/rhino.png";
bottom.src = "images/bottom.jpg";
boost.src = "images/boost.png";
gameOver.src = "images/gameOver.png";
restart.src = "images/restart.png";

//speed the bird drops
const gravity = 0.5;
//game over, retry function
var pause = false;
//score board
var score = 0;
let scoreBell = new Audio();
scoreBell.src = "sounds/score.mp3";

//creating dragon object
function DragonObject(L, R, T, B) {
    this.L = L + 25;
    this.R = R - 25;
    this.T = T + 25;
    this.B = B - 25;
}

//creating rhino object
function RhinoObject(L, R, T, B) {
    this.L = L + 100;
    this.R = R - 100;
    this.T = T + 100;
    this.B = B - 100;
}

//creating bird objects
function BirdObject(L, R, T, B) {
    this.L = L + 15;
    this.R = R - 15;
    this.T = T + 25;
    this.B = B - 25;
}

//creating a button object
function Button(L, R, T, B) {
    this.L = L;
    this.R = R;
    this.T = T;
    this.B = B;
}

Button.prototype.checkClicked = function () {
    if (this.L <= mouseX && mouseX <= this.R && this.T <= mouseY && mouseY <= this.B)
        return true;
}
//all three buttons
var startButton = new Button(93, 195, 379, 433);
var restartButton = new Button(117, 171, 298, 352);
var boostButton = new Button(107, 269, 445.5, 495.5);

//mouse location
var mouseX = 0;
var mouseY = 0;

//mouse clicking location
function mouseClicked(e) {
    mouseX = e.pageX - bg.offsetLeft;
    mouseY = e.pageY - bg.offsetTop;
    if (startButton.checkClicked()) {
        gamePage();
    } else if (boostButton.checkClicked()) {
        moveUp();
    } else if (restartButton.checkClicked()) {
        location.reload();
    }
}

//bird location on the canvas
var bX = 15;
var bY = 150;
let fly = new Audio();
fly.src = "sounds/fly.mp3";
//bird movement
function moveUp() {
    bY -= 50;
    fly.play();
}

//game obsticals
var beasts = [];

beasts[0] = {
    x: can.width,
    y: 0
};

//home page
function homePage() {
    con.drawImage(home, 0, 0);
    con.drawImage(start, 93, 379);
    document.addEventListener('click', mouseClicked, false);
}

//game screen
function gamePage() {
    con.drawImage(bg, 0, 0);
    con.drawImage(bird, bX, bY);
    //bottom score board
    con.drawImage(bottom, 0, 433);
    con.fillStyle = "gold";
    con.font = "18px Impact";
    con.fillText("Score : " + score, 25, 478);
    //boost button
    con.drawImage(boost, 107, 445.5);
    document.addEventListener('click', mouseClicked, false);

    //bird droping motion
    bY += gravity;

    //creating the beast's incoming
    for (var i = 0; i < beasts.length; i++) {
        con.drawImage(dragon, beasts[i].x + rhino.width, beasts[i].y);
        con.drawImage(rhino, beasts[i].x, 159);

        beasts[i].x--;

        if (beasts[i].x == 0 - dragon.width) {
            beasts.push({
                x: can.width,
                y: Math.floor(Math.random() * dragon.height) - dragon.height
            });
        }

        var birdO = new BirdObject(bX, bX + bird.width, bY, bY + bird.height);
        var dragonO = new DragonObject(beasts[i].x + rhino.width, beasts[i].x + rhino.width + dragon.width, beasts[i].y, beasts[i].y + dragon.height);
        var rhinoO = new RhinoObject(beasts[i].x, beasts[i].x + rhino.width, 159, 537);

        //game rules
        BirdObject.prototype.crash = function () {
            if ((birdO.R >= dragonO.L && birdO.R <= dragonO.R && birdO.T <= dragonO.B) ||
                (birdO.L <= dragonO.R && birdO.L >= dragonO.L && birdO.T <= dragonO.B) ||
                (birdO.R >= rhinoO.L && birdO.R <= rhinoO.R && birdO.B >= rhinoO.T) ||
                (birdO.L <= rhinoO.R && birdO.L >= rhinoO.L && birdO.B >= rhinoO.T) ||
                (birdO.T < 0 || birdO.B > 433)) {
                return true;
            }
        }

        if (birdO.crash()) {
            pause = true;
            tryAgain();
        }

        //scoring
        if (beasts[i].x == 5) {
            score++;
            scoreBell.play();
        }
    }

    //create a loop
    if (!pause) {
        requestAnimationFrame(gamePage);
    }

}

function tryAgain() {
    con.drawImage(bg, 0, 0);
    con.drawImage(gameOver, 41, 170);
    con.drawImage(restart, 117, 298);
    document.addEventListener('click', mouseClicked, false);
    // bottom score board
    con.fillStyle = "black";
    con.font = "18px Impact";
    con.fillText("Score : " + score, 32, 460);
}

homePage();