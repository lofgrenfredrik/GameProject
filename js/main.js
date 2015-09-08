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
var firstBallSpeed = Math.floor((Math.random() * 6) + 1);


var collisionCounter = document.getElementById("collisionCounter");
var ammoCounter = document.getElementById("ammoCounter");
var ammoLeft = 10;
var time = 1;



function updateTime()
{
    time++;
    document.getElementById("timer").innerHTML = time;
    if(time%10==0)
    {
        ammoLeft++;
    }
    return time;
}


var numberOfCollisions = 0;

var ballColors = ["#C0392B", "#E4F1FE", "#336E7B", "#4ECDC4", "#3D4A5D", "#26A65B","#79FF85"];
//document.getElementById("startGame").addEventListener("click", startGame);
var speed = 5;
function startGame() {

    function bouncingBall(ballSize, startX, startY,speedX) {

        this.ballRadius = ballSize;
        this.PositionValueX = startX;
        this.PositionValueY = startY;
        this.speedXAxis = speedX;
        this.speedYAxis =  Math.floor((Math.random() * speed) + 1);
        /*this.speedXAxis = xSpeed;
        this.speedYAxis = ySpeed;*/
        this.hexColorCode = ballColors[ Math.floor((Math.random() * ballColors.length) + 1)];


       // this.ballRadius = Math.ceil((Math.random() * 50) + 10); //
      /*  this.PositionValueX = Math.floor(Math.random() * ((playfieldWidth-this.ballRadius*2) - this.ballRadius*2 + 1)) + this.ballRadius*2;
        this.PositionValueY = Math.floor(Math.random() * ((playfieldHeight-playerSafetyDistanceY-this.ballRadius*2) - this.ballRadius*2 + 1)) + this.ballRadius*2;
        this.speedXAxis = Math.floor((Math.random() * 6) + 1);
        this.speedYAxis =  Math.floor((Math.random() * 6) + 1);
        this.hexColorCode = ballColors[ Math.floor((Math.random() * ballColors.length) + 1)];*/
    }
    var bouncingBalls = {};

    document.getElementById("moreBalls").addEventListener("click", addBalls);

   // console.log(bouncingBalls);
    var i = 0;
    function addBalls(sizeofHitBall, startX, startY, speedX)
    {
        bouncingBalls["ball"+i] = new bouncingBall(sizeofHitBall, startX, startY,speedX);
        i++;
    }


    addBalls(bigBallRadius, 100, 100, firstBallSpeed); // Skapar den första bollen så att spelet kommer igång!
   // console.log(updateTime)




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
        PositionValueX: 100,
        PositionValueY: playfieldHeight-50, // Sätt fasta färdet här på samma höjd som spelaren.
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

            if(ammoLeft>0)
            {
                generateShot(player.PositionValueX);
            ammoLeft--
            }
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
            player.PositionValueX -=10; //fart på spelaren
        }
        if(player.right){
            player.PositionValueX +=10; //fart på spelaren
        }
        // Spelaren kan inte röra sig utanför spelplane
        if(player.PositionValueX < 0){
            player.PositionValueX = 0;
        }
        if(player.PositionValueX > playfieldWidth - player.width){
            player.PositionValueX = playfieldWidth - player.width;
        }
    }
// END ****Tar emot tangent input och förflyttar spelaren****************************

    function drawPlayer(object)
    {
        playField.fillStyle = object.color;
        playField.fillRect(object.PositionValueX,object.PositionValueY,object.width,object.height);
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

//        shot.ammo--;


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

        object.PositionValueY -= 10; //fart på skotten
    }

    function update() {

        //generateShot.shot.ammo -1;

        playField.clearRect(0, 0, playfieldWidth, playfieldHeight);
       // document.getElementById("shotLocation").innerHTML = shotList[key];
       // drawEntity(solidPoint);

        collisionCounter.innerHTML = numberOfCollisions;
        ammoCounter.innerHTML = ammoLeft;




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
            var touchPlayer = testCollisionEntity(player,bouncingBalls[key]);
              if(touchPlayer){
                console.log("TRÄFF!!");
              }
            for(var k in shotList)
            {
                var isColliding = testCollisionEntity(shotList[k],bouncingBalls[key]);
                if(isColliding){
                    if(bouncingBalls[key].ballRadius == 60)
                    {
                        addBalls(mediumBallRadius, bouncingBalls[key].PositionValueX+15,bouncingBalls[key].PositionValueY,bouncingBalls[key].speedXAxis);
                        addBalls(mediumBallRadius, bouncingBalls[key].PositionValueX-15,bouncingBalls[key].PositionValueY, (bouncingBalls[key].speedXAxis)*-1);

                    }
                    if(bouncingBalls[key].ballRadius == 40)
                    {
                        addBalls(smallBallRadius, bouncingBalls[key].PositionValueX+10,bouncingBalls[key].PositionValueY,bouncingBalls[key].speedXAxis);
                        addBalls(smallBallRadius, bouncingBalls[key].PositionValueX-10,bouncingBalls[key].PositionValueY,(bouncingBalls[key].speedXAxis)*-1);

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
    setInterval(update, 20);

    setInterval(function(){
        //updateTime()
        if(updateTime() % 10 == 0)
        {
            addBalls(bigBallRadius, 100, 100, firstBallSpeed);
        }
    },1000);
}
startGame();
