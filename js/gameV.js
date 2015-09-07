/**
 * Created by VilleFalkenmark on 15-09-07.
 */
var playField = document.getElementById("myCanvas").getContext("2d");
playField.font = '30px Arial';

var playfieldHeight = document.getElementById("myCanvas").height;
var playfieldWidth = document.getElementById("myCanvas").width;

var playerSafetyDistanceY = 300; // Marginalen på Y axeln som bollarna kommer generas ovanför.

//console.log(playfieldHeight + " är Höjden");
//console.log(playfieldWidth + " är Bredden");

var collisionCounter = document.getElementById("collisionCounter");
var numberOfCollisions = 0;

var ballColors = ["#C0392B", "#E4F1FE", "#336E7B", "#4ECDC4", "#3D4A5D", "#26A65B","#79FF85"];

document.getElementById("startGame").addEventListener("click", startGame);

function startGame() {

    function bouncingBall() {
        this.ballRadius = Math.ceil((Math.random() * 50) + 10); //
        this.PositionValueX = Math.floor(Math.random() * ((playfieldWidth-this.ballRadius*2) - this.ballRadius*2 + 1)) + this.ballRadius*2;
        this.PositionValueY = Math.floor(Math.random() * ((playfieldHeight-playerSafetyDistanceY-this.ballRadius*2) - this.ballRadius*2 + 1)) + this.ballRadius*2;
        this.speedXAxis = Math.floor((Math.random() * 6) + 1);
        this.speedYAxis =  Math.floor((Math.random() * 6) + 1);
        this.hexColorCode = ballColors[ Math.floor((Math.random() * ballColors.length) + 1)];
    }
    var bouncingBalls = {};

    document.getElementById("moreBalls").addEventListener("click", addBalls);

    console.log(bouncingBalls);

    var i = 0;
    function addBalls()
    {
        bouncingBalls["ball"+i] = new bouncingBall();
        i++;
    }
    function getDistanceBetweenEntity(entity1,entity2){     //return distance (number)
        var vx = entity1.PositionValueX - entity2.PositionValueX;
        var vy = entity1.PositionValueY - entity2.PositionValueY;
        return Math.sqrt(vx*vx+vy*vy);
    }

    function testCollisionEntity(entity1,entity2){  //return if colliding (true/false)
        var distance = getDistanceBetweenEntity(entity1,entity2);
        return distance < 30;
    }

    function updateEntity(ball) {
        ball.PositionValueX += ball.speedXAxis;
        ball.PositionValueY += ball.speedYAxis;

        playField.beginPath();
        playField.fillStyle = ball.hexColorCode;
        playField.arc(ball.PositionValueX, ball.PositionValueY, ball.ballRadius, 0, Math.PI * 2, true);
        playField.closePath();
        playField.fill();

        if (ball.PositionValueX < ball.ballRadius || ball.PositionValueX > playfieldWidth - ball.ballRadius)
        {
            ball.speedXAxis = -ball.speedXAxis;
        }
        if (ball.PositionValueY < ball.ballRadius || ball.PositionValueY > playfieldHeight - ball.ballRadius) {
            ball.speedYAxis = -ball.speedYAxis;
        }

    }
    var solidPoint = {
        PositionValueY:playfieldHeight/2,
        PositionValueX:playfieldWidth/2,
        name:'Träffa mig!'
    };

    function drawEntity(something){
        playField.fillText(something.name,something.PositionValueX,something.PositionValueY);
    }


    function update() {

        playField.clearRect(0, 0, playfieldWidth, playfieldHeight);

        drawEntity(solidPoint);


        for (var key in bouncingBalls) {
            updateEntity(bouncingBalls[key]);

            var isColliding = testCollisionEntity(solidPoint,bouncingBalls[key]);
            if(isColliding){

                delete bouncingBalls[key]; // Tar bort bollen som träffar texten!
                numberOfCollisions++;
            }
        }
        collisionCounter.innerHTML = numberOfCollisions;
    }
    //drawEntity(solidPoint);
    setInterval(update, 20);

}


/**
 * SLUT!
 *
 *
 * FUNGERANDE KODBLOCK NEDAN
 */



/*
 var bouncingBalls = {};

 var ball1 = {
 x: 173,
 y: 84,
 spdX:2, // Hastighet X-axel
 spdY: 1,  // Hastighet Y-axel
 name: "ball1",
 radius: 70,
 color: "#FFCA36", // Gult
 id: "idBall1"
 };
 bouncingBalls["idBall1"] = ball1;
 var ball2 = {
 x: playfieldWidth-73,
 y: playfieldHeight-344,
 spdX:3, // Hastighet X-axel
 spdY: 2,  // Hastighet Y-axel
 name: "ball2",
 radius: 20,
 color: "#3D4A5D", // Mörkblått
 id: "idBall2"
 };
 bouncingBalls["idBall2"] = ball2;

 var ball3 = {
 x: playfieldWidth-200,
 y: playfieldHeight-100,
 spdX:1, // Hastighet X-axel
 spdY: 2,  // Hastighet Y-axel
 name: "ball3",
 radius: 55,
 color: "#79FF85", // Turkost
 id: "idBall3"
 };
 bouncingBalls["idBall3"] = ball3;


 setInterval(update,20);

 function updateEntity(ball){
 ball.x += ball.spdX;
 ball.y += ball.spdY;

 playField.beginPath();
 playField.fillStyle=ball.color;
 // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
 playField.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true);
 playField.closePath();
 playField.fill();

 if(ball.x < ball.radius || ball.x > playfieldWidth-ball.radius){
 ball.spdX = -ball.spdX;
 }
 if(ball.y < ball.radius || ball.y > playfieldHeight-ball.radius){
 ball.spdY = -ball.spdY;
 }
 }

 function update(){

 playField.clearRect(0,0,playfieldWidth,playfieldHeight);
 // updateEntity(enemy);
 // updateEntity(enemy2);
 // updateEntity(player);
 for(var key in bouncingBalls){
 updateEntity(bouncingBalls[key]);
 }
 }

 */






/**
 * SLUT!
 *
 *
 * FUNGERANDE KODBLOCK NEDAN
 */



/*
 * var canvas = document.getElementById("myCanvas");

 var ballSize = 20;


 var canvasHeight = canvas.height;
 var canvasWidth = canvas.width;

 var playfield;
 var x=100;
 var y=200;
 var dx=5;
 var dy=5;

 console.log("canvas är "+canvasHeight+" pixlar hög och "+canvasWidth+" pixlar bred");

 function init()
 {
 playfield= myCanvas.getplayfield('2d');
 setInterval(draw,20); // Sätter hastigheten för hur snabbt något ska ritas om
 }

 function draw()
 {
 playfield.clearRect(0,0,canvasWidth,canvasHeight);
 playfield.beginPath();
 playfield.fillStyle="#000000";
 // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
 playfield.arc(x,y,ballSize,0,Math.PI*2,true);
 playfield.closePath();
 playfield.fill();
 // Boundary Logic
 if( x<ballSize || x>canvasWidth-ballSize) dx=-dx;
 if( y<ballSize || y>canvasHeight-ballSize) dy=-dy;
 x+=dx;
 y+=dy;
 }*/



