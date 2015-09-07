var playField = document.getElementById("playField").getContext("2d");
playField.font = '30px Arial';

var playfieldHeight = document.getElementById("playField").height;
var playfieldWidth = document.getElementById("playField").width;

var playerX = playfieldWidth / 2;
var shotList = {};
// intervall som uppdateringsfunktionen körs

var playerSafetyDistanceY = 300; // Marginalen på Y axeln som bollarna kommer generas ovanför.

//console.log(playfieldHeight + " är Höjden");
//console.log(playfieldWidth + " är Bredden");

var bigBallRadius = 60;
var mediumBallRadius = 40;
var smallBallRadius = 20;


var collisionCounter = document.getElementById("collisionCounter");
var numberOfCollisions = 0;

var ballColors = ["#C0392B", "#E4F1FE", "#336E7B", "#4ECDC4", "#3D4A5D", "#26A65B","#79FF85"];

//document.getElementById("startGame").addEventListener("click", startGame);

function startGame() {

    function bouncingBall(ballSize) {

        this.ballRadius = ballSize;
       // this.ballRadius = Math.ceil((Math.random() * 50) + 10); //
        this.PositionValueX = Math.floor(Math.random() * ((playfieldWidth-this.ballRadius*2) - this.ballRadius*2 + 1)) + this.ballRadius*2;
        this.PositionValueY = Math.floor(Math.random() * ((playfieldHeight-playerSafetyDistanceY-this.ballRadius*2) - this.ballRadius*2 + 1)) + this.ballRadius*2;
        this.speedXAxis = Math.floor((Math.random() * 6) + 1);
        this.speedYAxis =  Math.floor((Math.random() * 6) + 1);
        this.hexColorCode = ballColors[ Math.floor((Math.random() * ballColors.length) + 1)];
    }
    var bouncingBalls = {};

    document.getElementById("moreBalls").addEventListener("click", addBalls);

   // console.log(bouncingBalls);

    var i = 0;
    function addBalls(sizeofHitBall)
    {
        bouncingBalls["ball"+i] = new bouncingBall(sizeofHitBall);
        i++;
    }

    addBalls(bigBallRadius);


    function getDistanceBetweenEntity(shot,ball){     //return distance (number)
        var vx = shot.PositionValueX - ball.PositionValueX;
        var vy = shot.PositionValueY - ball.PositionValueY;
        return Math.sqrt(vx*vx+vy*vy);
    }

    function testCollisionEntity(shot,ball){  //return if colliding (true/false)
        var distance = getDistanceBetweenEntity(shot,ball);
        return distance < ball.ballRadius;
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

  /* var solidPoint = {
        PositionValueY:playfieldHeight/2,
        PositionValueX:playfieldWidth/2,
        name:'Träffa mig!'
    };*/



    var player = {
        width: 50,
        height: 50,
        x: 100,
        y: playfieldHeight-50, // Sätt fasta färdet här på samma höjd som spelaren.
        color: "#fff",
        left: false,
        right: false
    };


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
    };
    document.onkeyup = function(keyPress) {
        if(keyPress.keyCode === 37){
            // Move left
            player.left = false;
        }
        if(keyPress.keyCode === 39){
            // Move right
            player.right = false;
        }
    };
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

    function drawPlayer(object)
    {
        playField.fillStyle = object.color;
        playField.fillRect(object.x,object.y,object.width,object.height);
    }

    var shotNr = 0;
// Skapar ett nytt skott och pushar in det i en array
    function generateShot(playerX){
        var shot = {
            PositionValueX: playerX + 20,
            PositionValueY: playfieldHeight-60,
            width: 10,
            height: 10,
            color: "black"
            };
        shotList["shot"+shotNr] = shot;
        shotNr++;
    }



// Ritar upp skotten i arrayen
    function drawShots(object){
        playField.fillStyle = object.color;
        playField.fillRect(object.PositionValueX,object.PositionValueY,object.width,object.height);
    }

// Förflyttar skotten i y-axeln och om det går utanför y axeln så tas de bort ur arrayen
    function animateShots(object){

        // Skott som en linje
        // object.height -=30;
        // if(object.height < -900){
        // // skott som en punkt

        object.PositionValueY -= 5; //fart på skotten
    }

    function update() {

        playField.clearRect(0, 0, playfieldWidth, playfieldHeight);
       // document.getElementById("shotLocation").innerHTML = shotList[key];
       // drawEntity(solidPoint);

        collisionCounter.innerHTML = numberOfCollisions;

        playerPosition(); //updaterar spelaren
       // drawObjects(player); //ritar ut spelaren
        drawPlayer(player);


        //uppdaterar skottposition för varje skott i listan
        for(var key in shotList){
            animateShots(shotList[key])
        };
        // Ritar ut varje skott i listan
        for(var key in shotList){
            drawShots(shotList[key])
        };

        for (var key in bouncingBalls) {
            updateEntity(bouncingBalls[key]);

            for(var k in shotList)
            {
                var isColliding = testCollisionEntity(shotList[k],bouncingBalls[key]);
                if(isColliding){
                    addBalls();

                    if(bouncingBalls[key].ballRadius == 60)
                    {
                        addBalls(mediumBallRadius);
                        addBalls(mediumBallRadius);
                    }
                    if(bouncingBalls[key].ballRadius == 40)
                    {
                        addBalls(smallBallRadius);
                        addBalls(smallBallRadius);
                    }

                    delete bouncingBalls[key]; // Tar bort bollen som träffar texten!


                   // addBalls(mediumBallRadius);
                    delete shotList[k]; // Tar bort bollen som träffar texten!
                    numberOfCollisions++;
                }
                else if (shotList[k].PositionValueY < 0)
                {
                    delete shotList[k]; // Tar bort bollen som träffar texten!
                }
            }
        }
    }
    //drawEntity(solidPoint);
    setInterval(update, 20)
}
startGame();
