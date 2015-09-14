var playField = document.getElementById("playField").getContext("2d");
playField.font = '30px Arial';

var playfieldHeight = document.getElementById("playField").height;
var playfieldWidth = document.getElementById("playField").width;

var shotList = {};
var powerShotList = {};
var powerShotAvailabe = 0;
// intervall som uppdateringsfunktionen körs

var playerSafetyDistanceY = 300; // Marginalen på Y axeln som bollarna kommer generas ovanför.

//console.log(playfieldHeight + " är Höjden");
//console.log(playfieldWidth + " är Bredden");

var bigBallRadius = 60;
var mediumBallRadius = 40;
var smallBallRadius = 20;
var firstBallSpeed = Math.floor((Math.random() * 6) + 1);
//var firstBallSpeed = 1;

var collisionCounter = document.getElementById("collisionCounter");
var ammoCounter = document.getElementById("ammoCounter");
var ammoLeft = 10;
var time = 0;
var healthCounter = document.getElementById("health");
var frameCount = 0;
var groundHeight = 32; // Höjden på marken i bilden.
var ballCounter = document.getElementById("ballCounter");
var accuracy = document.getElementById("accuracy");



var shotsFired = document.getElementById("shotsFired");

// Sounds ********************
var pop = new Audio();
pop.src = "sound/pop.wav";
var shotSound = new Audio();
shotSound.src = "sound/bang.wav";
var specialShotSound = new Audio();
specialShotSound.src = "sound/loudgun.wav";
var reload = new Audio();
reload.src = "sound/reload.wav";
var healthSound = new Audio();
healthSound.src = "sound/yes.wav"

function startGame() {

    /**
     *
     *<======= ALLTING SOM HAR MED SPELAREN ATT GÖRA =======>
     *
     */
    var player = new Image();
    player.src = "images/villeSprite.png";  // WTF?! Varför utgår man från vart html-filen ligger och inte JS filen?

    player.left = false;
    player.right = false;
    player.health = 5;
    player.height = 75;
    player.width = 65; //
    player.PositionValueX = 100;
    player.PositionValueY = playfieldHeight - 80 - groundHeight;
    player.animateX = (player.width) - 25;
    player.animateY = player.height;
// var ship_x = player.PositionValueX, ship_y =player.PositionValueY, ship_w = 65, ship_h = 85,
    var strafeX = 0;

    /**
     *
     *<======= STARTA TIMERS! =======>
     *
     */
    function updateTime() {
        time++;
        document.getElementById("timer").innerHTML = time;
        if (time % 10 == 0) {
            ammoLeft += 2;
        }
        return time;
    }

    function updateFrameCount() {
        frameCount++;
        return frameCount;
    }

    // playField.drawImage(player,srcX,srcY,player.width,player.height,player.PositionValueX,player.PositionValueY,player.width,player.height);

    // playField.drawImage(player,strafeX,0,player.width,player.height,player.PositionValueX,player.PositionValueY,player.width,player.height);

    // ship_x = (width / 2) - 25, ship_y = height - 85, ship_w = 65, ship_h = 85,

    /* KOLLAR OM SPELAREN BLIR TRÄFFAD */

    setInterval(function () {
        hit = false;
        player.color = "#fff";
    }, 400);
    function playerHit(hit) {
        if (hit) {
            player.color = "red";
            player.health--;
            checkHealth(player.health)
        }
    }

    /* FLYTTAR PÅ SPELAREN */
    document.onkeydown = function (keyPress) {
        if (keyPress.keyCode === 37) {
            // Move left
            player.left = true;

        }
        if (keyPress.keyCode === 39) {
            // Move right
            player.right = true;

        }
        if (player.right == false && player.left == false) {
            strafeX = 0;
        }
        // Shoot
        if (keyPress.keyCode === 32) {

            if (ammoLeft > 0) {
                generateShot(player.PositionValueX);
                ammoLeft--
                shotSound.play();
                shotSound.currentTime=0;

            }
            if (powerShotAvailabe > 0) {
                generatePowerShot(player.PositionValueX);
                powerShotAvailabe--
                specialShotSound.play();
                specialShotSound.currentTime=0;
            }
        }
    };
    document.onkeyup = function (keyPress) {
        if (keyPress.keyCode === 37) {
            // Move left
            player.left = false;
            strafeX = 0;

        }
        if (keyPress.keyCode === 39) {
            // Move right
            player.right = false;
            strafeX = 0;

        }
    };
    function playerPosition() {
        if (player.left) {
            player.PositionValueX -= 10; //fart på spelaren

            if (frameCount % 2 == 0) {
                strafeX = 65;
            }
            else {
                strafeX = 65 * 2;
            }
        }
        if (player.right) {
            player.PositionValueX += 10; //fart på spelaren
            strafeX = 195;
            if (frameCount % 2 == 0) {
                strafeX = 65 * 3;
            }
            else {
                strafeX = 65 * 4;
            }
        }
        // Spelaren kan inte röra sig utanför spelplane
        if (player.PositionValueX < 0) {
            player.PositionValueX = 0;
        }
        if (player.PositionValueX > playfieldWidth - player.width) {
            player.PositionValueX = playfieldWidth - player.width;
        }
    }

    /**
     *
     *<======= ALLTING SOM HAR MED BOLLARNA ATT GÖRA =======>
     *
     */
    var numberOfCollisions = 0;
    var ballColors = ["#C0392B", "#E4F1FE", "#336E7B", "#4ECDC4", "#3D4A5D", "#26A65B", "#79FF85"];
//document.getElementById("startGame").addEventListener("click", startGame);
    var speed = 5;

    function bouncingBall(ballSize, startX, startY, speedX) {

        this.ballRadius = ballSize;
        this.PositionValueX = startX;
        this.PositionValueY = startY;
        this.speedXAxis = speedX;
        this.speedYAxis = Math.floor((Math.random() * speed) + 1);
        this.hexColorCode = ballColors[Math.floor((Math.random() * ballColors.length) + 1)];

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

    function addBalls(sizeofHitBall, startX, startY, speedX) {
        bouncingBalls["ball" + i] = new bouncingBall(sizeofHitBall, startX, startY, speedX);
        i++;
    }

    addBalls(bigBallRadius, 100, 100, firstBallSpeed); // Skapar den första bollen så att spelet kommer igång!

    function updateEntity(ball) {
        ball.PositionValueX += ball.speedXAxis;
        ball.PositionValueY += ball.speedYAxis;

        playField.beginPath();
        playField.fillStyle = ball.hexColorCode;
        playField.arc(ball.PositionValueX, ball.PositionValueY, ball.ballRadius, 0, Math.PI * 2, true);
        playField.closePath();
        playField.fill();

        if (ball.PositionValueX < ball.ballRadius || ball.PositionValueX > playfieldWidth - ball.ballRadius) {
            ball.speedXAxis = -ball.speedXAxis;
        }
        if (ball.PositionValueY < ball.ballRadius + groundHeight || ball.PositionValueY > playfieldHeight - ball.ballRadius - groundHeight) {
            ball.speedYAxis = -ball.speedYAxis;
        }
        if (ball.PositionValueY > playfieldHeight - player.height - ball.ballRadius && ((player.PositionValueX + player.width / 2) > ball.PositionValueX - ball.ballRadius && (player.PositionValueX + player.width / 2) < ball.PositionValueX + ball.ballRadius)) {
            hit = true;
            playerHit(hit);
        }
    }

    function getDistanceBetweenEntity(shot, ball) {     //return distance (number)
        var vx = shot.PositionValueX - ball.PositionValueX;
        var vy = shot.PositionValueY - ball.PositionValueY;
        return Math.sqrt(vx * vx + vy * vy);
    }

    function testCollisionEntity(shot, ball) {  //return if colliding (true/false)
        var distance = getDistanceBetweenEntity(shot, ball);
        return distance < ball.ballRadius;
    }

    /**
     *
     *<======= ALLTING SOM HAR MED SKOTTEN ATT GÖRA =======>
     *
     */
    var shotNr = 0;
    // Skapar ett nytt skott och pushar in det i ett objekt
    function generateShot(playerX) {
        var shot =
        {
            PositionValueX: playerX + 10,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            color: "black"
        };
        shotList["shot" + shotNr] = shot;
        if(player.health>0)
        {
        shotNr++;
        }
        shotsFired.innerHTML = shotNr;

    }

    var PowershotNr = 0;
    // Skapar ett nytt skott och pushar in det i ett objekt
    function generatePowerShot(playerX) {
        var powerShot1 = {
            id: 1,
            PositionValueX: playerX,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            color: "black"
        };
        var powerShot2 = {
            id: 2,
            PositionValueX: playerX + 40,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            color: "black"
        };
        powerShotList["PowerShot" + PowershotNr] = powerShot1;
        PowershotNr++;
        powerShotList["PowerShot" + PowershotNr] = powerShot2;
        PowershotNr++;
    }

    // Förflyttar skotten i y-axeln och om det går utanför y axeln så tas de bort ur arrayen
    function animateShots(object) {
        object.PositionValueY -= 15; //fart på skotten
        if (object.id == 1) {
            object.PositionValueX -= 5;
        }
        if (object.id == 2) {
            object.PositionValueX += 5;
        }

    }

    function TestShotHits(list, object) {
        for (var key in object) {
            updateEntity(object[key]);

            // KOLLAR OM SKOTTEN TRÄFFAR
            for (var k in list) {
                var isColliding = testCollisionEntity(list[k], object[key]);
                if (isColliding) {
                  pop.play();
                  pop.currentTime=0
                    if (object[key].ballRadius == 60) {
                        addBalls(mediumBallRadius, object[key].PositionValueX + 15, object[key].PositionValueY, object[key].speedXAxis);
                        addBalls(mediumBallRadius, object[key].PositionValueX - 15, object[key].PositionValueY, (object[key].speedXAxis) * -1);
                    }
                    if (object[key].ballRadius == 40) {
                        addBalls(smallBallRadius, object[key].PositionValueX + 10, object[key].PositionValueY, object[key].speedXAxis);
                        addBalls(smallBallRadius, object[key].PositionValueX - 10, object[key].PositionValueY, (object[key].speedXAxis) * -1);
                    }
                    delete object[key]; // Tar bort bollen som träffar texten!
                    delete list[k]; // Tar bort bollen som träffar texten!
                    numberOfCollisions++;
                }
                else if (list[k].PositionValueY < 0) {
                    delete list[k]; // Tar bort bollen som träffas!
                }
            }
        }
    }

    /**
     *
     *<======= ALLTING SOM HAR MED UPPGRADERINGAR ATT GÖRA =======>
     *
     */
    function upgrade(width, height, type, color) {
        this.width = width;
        this.height = height;
        this.type = type;
        this.color = color;
        this.PositionValueX = Math.floor(Math.random() * ((playfieldWidth - this.width) - this.width)) + this.width;
        this.PositionValueY = playfieldHeight - this.height - groundHeight;
    }

    var upgrades = {};

    var upgradeCounter = 0;

    function addUpgrades(width, height, type, color) {
        upgrades["upgrade" + upgradeCounter] = new upgrade(width, height, type, color);
        upgradeCounter++;
    }

    function deleteUpgrades() {
        upgrades = {};
        // console.log(upgrades)
    }

    /**
     *
     *<======= RITA UT SKOTT, PLAYER & UPPGRADERING =======>
     *
     */
    function drawObject(object) {
        playField.fillStyle = object.color;
        playField.fillRect(object.PositionValueX, object.PositionValueY, object.width, object.height);
    }

    /* function drawPlayer(player)
     {
     playField.drawImage(player, player.PositionValueX,player.PositionValueY);
     }*/

    /**
     *
     *<======= UPPDATERING SOM KÖRS VAR 20 millisekund =======>
     *
     */


    /*

     var ballCounter = document.getElementById("ballCounter");

     var ballsInAction = 0;
     */
   // var ballCounter = 0;




    function update() {

        ballCounter.innerHTML = Object.keys(bouncingBalls).length; // Kollar hur många bollar som är på planen för att avgöra när man klarat en bana!

        playField.clearRect(0, 0, playfieldWidth, playfieldHeight);




        collisionCounter.innerHTML = numberOfCollisions;

        if(shotNr == 0)
        {
            accuracy.innerHTML = 0;
        }
        else
        {
        accuracy.innerHTML = ((collisionCounter.innerHTML)/(shotsFired.innerHTML)*100).toFixed(0);
        }
        ammoCounter.innerHTML = ammoLeft;
        healthCounter.innerHTML = player.health;


        for (var item in upgrades)
        {
            drawObject(upgrades[item]);
        }
        playerPosition(); //updaterar spelaren


        playField.drawImage(player,strafeX,0,player.width,player.height,player.PositionValueX,player.PositionValueY,player.width,player.height);

        for(var item in upgrades) {

            var distanceBetweenPlayerAndUpgrade = (playfieldWidth-player.PositionValueX)-(playfieldWidth-upgrades[item].PositionValueX);
            var marginal = 10; //
            if(distanceBetweenPlayerAndUpgrade>-marginal && distanceBetweenPlayerAndUpgrade<marginal && upgrades[item].type === "Ammo")
            {
                console.log("AMMO!");
                ammoLeft += 10;
                reload.play();
                reload.currentTime=0;
                delete upgrades[item]
            }
            else if(distanceBetweenPlayerAndUpgrade>-marginal && distanceBetweenPlayerAndUpgrade<marginal && upgrades[item].type === "Health")
            {
                console.log("Health!");
                player.health += 20;
                healthSound.play();
                healthSound.currentTime=0;
                delete upgrades[item]
            }
            else if(distanceBetweenPlayerAndUpgrade>-marginal && distanceBetweenPlayerAndUpgrade<marginal && upgrades[item].type === "PowerSot")
            {
                console.log("PowerShot!");
                powerShotAvailabe += 8; // HUR MÅNGA POWERSHOTS MAN FÅR VID UPPGRADERING!
                delete upgrades[item]
            }
        }
        //UPPDATERAR SKOTTPOSITIONEN FÖR VARJE SKOTT I OBJEKTET
        for(var shot in shotList){
            animateShots(shotList[shot])
        }
        // RITA UT SKOTTEN
        for(var key in shotList){
            drawObject(shotList[key])
        }
        for(var power in powerShotList){
            animateShots(powerShotList[power])
        }
        // RITA UT SKOTTEN
        for(var powerS in powerShotList){
            drawObject(powerShotList[powerS])
        }
        // RITA UT BOLLARNA SAMT KOLLAR OM SKOTTEN TRÄFFAR
        TestShotHits(shotList,bouncingBalls);
        TestShotHits(powerShotList,bouncingBalls);
    }
    function checkHealth(health)
    {
        if(health<0)
        {
            clearInterval(startUpdate);
            clearInterval(startTime);
            playField.fillStyle = "Red";
            playField.font = "bold 56px Arial";
            playField.textAlign = "center";
            playField.fillText("Game Over :(", playfieldWidth/2, playfieldHeight/2);
        }
    }
    var startUpdate = setInterval(update, 20);

    var startTime = setInterval(function(){
        if(updateTime() % 10 == 0)
        {
            addBalls(bigBallRadius, 100, 100, firstBallSpeed);

        }
        else if(timer.innerHTML % 7 == 0)
        {
            addUpgrades(50, 50, "Ammo", "#336E7B");
        }
        else if(timer.innerHTML % 13 == 0)
        {
            addUpgrades(50, 50, "Health", "#A2DED0");
        }
        else if(timer.innerHTML % 31 == 0)
        {
            addUpgrades(50, 50, "PowerSot", "#cfe25b");
        }
        else if(timer.innerHTML % 5 == 0)
        {
           deleteUpgrades();
        }
    },1000);

    setInterval(function(){
        updateFrameCount()
    },200);
}
startGame();
