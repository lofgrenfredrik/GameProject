var playField = document.getElementById("playField").getContext("2d");
playField.font = '30px Arial';

var playfieldHeight = document.getElementById("playField").height;
var playfieldWidth = document.getElementById("playField").width;

var playerX = playfieldWidth / 2;
var shotList = [];
// intervall som uppdateringsfunktionen körs

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

        playerPosition(); //updaterar spelaren
        drawObjects(player); //ritar ut spelaren

        //uppdaterar skottposition för varje skott i listan
        for(var key in shotList){
            animateShots(shotList[key])
        };
        // Ritar ut varje skott i listan
        for(var key in shotList){
            drawObjects(shotList[key])
        };


    }
    //drawEntity(solidPoint);
    setInterval(update, 20)
}

//setInterval(update,20);

// Function som rensar playfielden och ritar sedan upp spelarboxen med uppdaterad position
/*function update(){
    playField.clearRect(0,0,playfieldWidth,playfieldHeight);
    playerPosition(); //updaterar spelaren
    drawObjects(player); //ritar ut spelaren

    //uppdaterar skottposition för varje skott i listan
    for(var key in shotList){
        animateShots(shotList[key])
    };
    // Ritar ut varje skott i listan
    for(var key in shotList){
        drawObjects(shotList[key])
    };

}*/

// Ritar upp spelarboxen
function playerBox(){
    playfield.fillStyle = "purple";
    playfield.fillRect(playerX,550,50,50);
}

var player = {
    width: 50,
    height: 50,
    x: playerX,
    y: playfieldHeight-50, // Sätt fasta färdet här på samma höjd som spelaren.
    color: "purple",
    left: false,
    right: false
}

// Tar emot tangent input och förflyttar spelaren****************************
document.onkeydown = function(keyPress) {
    if(keyPress.keyCode === 37){
        // Move left
        player.left = true;
    }
    if(keyPress.keyCode === 39){
        // Move right
        player.right = true;
    }
    // Shoot
    if(keyPress.keyCode === 32){
        generateShot(player.x);
    }
}
document.onkeyup = function(keyPress) {
    if(keyPress.keyCode === 37){
        // Move left
        player.left = false;
    }
    if(keyPress.keyCode === 39){
        // Move right
        player.right = false;
    }
}
function playerPosition(){
    if(player.left){
        player.x -=10; //fart på spelaren
    }
    if(player.right){
        player.x +=10; //fart på spelaren
    }
    // Spelaren kan inte röra sig utanför spelplane
    if(player.x < 0){
        player.x = 0;
    }
    if(player.x > playfieldWidth - player.width){
        player.x = playfieldWidth - player.width;
    }
}

// END ****Tar emot tangent input och förflyttar spelaren****************************

// Skapar ett nytt skott och pushar in det i en array
function generateShot(playerX){
    var shot = {
        x: playerX + 20,
        y: playfieldHeight-50,
        width: 10,
        height: 10,
        color: "black"
    }
    shotList.push(shot);
};

// Ritar upp skotten i arrayen
function drawObjects(object){
    playField.fillStyle = object.color;
    playField.fillRect(object.x,object.y,object.width,object.height);
}

// Förflyttar skotten i y-axeln och om det går utanför y axeln så tas de bort ur arrayen
function animateShots(object){

    // Skott som en linje
   // object.height -=30;
    // if(object.height < -900){

    // // skott som en punkt
    object.y -= 20; //fart på skotten
    if(object.y < 0){
        shotList.shift();
    }
}