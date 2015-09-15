var playField = document.getElementById("playField").getContext("2d");
playField.font = '30px Arial';

var playfieldHeight = document.getElementById("playField").height;
var playfieldWidth = document.getElementById("playField").width;

var obstacleCount = 0;

var shotList = {};
var powerShotList = {};
var powerShotAvailabe = 200;


// intervall som uppdateringsfunktionen körs

var playerSafetyDistanceY = 300; // Marginalen på Y axeln som bollarna kommer generas ovanför.

var bigBallRadius = 60;
var mediumBallRadius = 40;
var smallBallRadius = 20;
//var firstBallSpeed = Math.floor((Math.random() * 6) + 1);
var firstBallSpeed = 1;

var collisionCounter = document.getElementById("collisionCounter");
var ammoCounter = document.getElementById("ammoCounter");
var powerShotsCounter = document.getElementById("powerShotsCounter");

var ammoLeft = 10;
var time = 0;
var healthCounter = document.getElementById("health");
var frameCount = 0;
var groundHeight = 32; // Höjden på marken i bilden.
var ballCounter = document.getElementById("ballCounter");
var accuracy = document.getElementById("accuracy");
var healthBar = document.getElementById("health-bar");
var bana = document.getElementById("bana");
var level = 1;


var backGrounds = ["pixelBG2.jpg", "fantasy.png", "forest.png", "desert.png"];
// Sounds ********************
var pop = new Audio();
//pop.src = "sound/pop.wav";
var shotSound = new Audio();
//shotSound.src = "sound/bang.wav";
var specialShotSound = new Audio();
//specialShotSound.src = "sound/loudgun.wav";
var reload = new Audio();
//reload.src = "sound/reload.wav";
var healthSound = new Audio();
//healthSound.src = "sound/yes.wav";
var backgroundSound = new Audio();
//backgroundSound.src = "sound/retro.mp3";

var playFieldBackground = document.getElementById("playField");
var shotsFired = document.getElementById("shotsFired");



var ammoImage = document.getElementById("ammoImage");
var healthImage = document.getElementById("healthImage");

ammoImage.style.display ="none";
healthImage.style.display ="none";

var player = new Image();
player.src = "images/villeSprite.png";  // WTF?! Varför utgår man från vart html-filen ligger och inte JS filen?
player.left = false;
player.right = false;
player.health = 100;
player.height = 75;
player.width = 65; //
player.PositionValueX = 100;
player.PositionValueY = playfieldHeight - 75 - groundHeight;
player.animateX = (player.width) - 25;
player.animateY = player.height;
var strafeX = 0;

var bouncingBalls = {};

document.getElementById("startGame").addEventListener("click",startGame);

function startGame(numberOfBalls) {
    /**
     *
     *<======= ALLTING SOM HAR MED SPELAREN ATT GÖRA =======>
     *
     */
    playFieldBackground.style.background = 'url("images/' + backGrounds[level-1] + '")';
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
        // Shoot knapp S
        if (keyPress.keyCode === 83) {
            if (ammoLeft > 0) {
                generateShot(player.PositionValueX);
                ammoLeft--
                shotSound.play();
                shotSound.currentTime=0;

            }
        }
       // powerShotsCounter.innerHTML = powerShotAvailabe;

        // Power shot Knapp A
        if (keyPress.keyCode === 65) {
          if (powerShotAvailabe > 0) {
              generatePowerShot(player.PositionValueX);
              powerShotAvailabe--;
              specialShotSound.play();
              specialShotSound.currentTime=0;
             // powerShotsCounter.innerHTML = powerShotAvailabe;
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
    var ballColors = ["#000", "#E4F1FE", "#336E7B", "#4ECDC4", "#3D4A5D", "#26A65B", "#79FF85"];
    //document.getElementById("startGame").addEventListener("click", startGame);
    var speed = 4;

    function bouncingBall(ballSize, startX, startY, speedX) {

        this.ballRadius = ballSize;
        this.PositionValueX = startX;
        this.PositionValueY = startY;
        this.speedXAxis = speedX;
        this.speedYAxis = Math.floor((Math.random() * speed) + 1);
        this.hexColorCode = ballColors[Math.floor((Math.random() * ballColors.length) + 1)];
       // this.hypo = Math.sqrt(Math.pow(ballSize,2)*2);
        this.isStuck = false;
        // this.ballRadius = Math.ceil((Math.random() * 50) + 10); //
        /*  this.PositionValueX = Math.floor(Math.random() * ((playfieldWidth-this.ballRadius*2) - this.ballRadius*2 + 1)) + this.ballRadius*2;
         this.PositionValueY = Math.floor(Math.random() * ((playfieldHeight-playerSafetyDistanceY-this.ballRadius*2) - this.ballRadius*2 + 1)) + this.ballRadius*2;
         this.speedXAxis = Math.floor((Math.random() * 6) + 1);
         this.speedYAxis =  Math.floor((Math.random() * 6) + 1);
         this.hexColorCode = ballColors[ Math.floor((Math.random() * ballColors.length) + 1)];*/
    }

    // document.getElementById("moreBalls").addEventListener("click", addBalls);
    //document.getElementById("moreBalls").addEventListener("click", addBalls);

    // console.log(bouncingBalls);
    var i = 0;

    function addBalls(sizeofHitBall, startX, startY, speedX) {
        bouncingBalls["ball" + i] = new bouncingBall(sizeofHitBall, startX, startY, speedX);
        i++;
    }

    addBalls(bigBallRadius, (Math.floor(Math.random() * 9) + 1) *100, 100, firstBallSpeed); // Skapar den första bollen så att spelet kommer igång!

   for(var s=0;s<numberOfBalls;s++)
    {
        addBalls(bigBallRadius, 200, 100, firstBallSpeed); // Skapar den första bollen så att spelet kommer igång!
    }

    function updateEntity(ball,hinder) {
        ball.PositionValueX += ball.speedXAxis;
        ball.PositionValueY += ball.speedYAxis;
        playField.beginPath();
        playField.fillStyle = ball.hexColorCode;
       // playField.arc(ball.PositionValueX, ball.PositionValueY, ball.ballRadius, 0, Math.PI * 2, true);

        playField.arc(ball.PositionValueX, ball.PositionValueY, ball.ballRadius,0,2*Math.PI);
        playField.closePath();
        playField.fill();

        if(obstacleCount === 0){
            hinder.PositionValueY += hinder.speedYAxis;
            //console.log(hinder.speedXAxis
        }
        playField.fillStyle = hinder.color;
        playField.fillRect(hinder.PositionValueX, hinder.PositionValueY, hinder.width, hinder.height);
        obstacleCount++;

        if(obstacleCount === (ballCounter.innerHTML = Object.keys(bouncingBalls).length))
        {
            obstacleCount = 0;
        }

        var bounceBordersX = ball.PositionValueX < ball.ballRadius || ball.PositionValueX > playfieldWidth - ball.ballRadius;
        var bounceBordersY = ball.PositionValueY < ball.ballRadius || ball.PositionValueY > playfieldHeight - ball.ballRadius - groundHeight;
        var playerGetsHit = (ball.PositionValueY > playfieldHeight - player.height - ball.ballRadius && ((player.PositionValueX + player.width / 2) > ball.PositionValueX - ball.ballRadius && (player.PositionValueX + player.width / 2) < ball.PositionValueX + ball.ballRadius))
        var moveObstacle =  hinder.PositionValueY < 0 || hinder.PositionValueY > hinder.maxValue;

       // var collidewithObs = testCollisionEntityObstacle(hinders,ball);

      //  var hypo = Math.sqrt(Math.pow(ball.ballRadius,2)*2);
        //console.log(ball.ballRadius);
       // console.log(hypo);

            if(typeof hinder == "undefined")
            {
              //  console.log("DET STÄMMER");
            if (bounceBordersX) {
                ball.speedXAxis = -ball.speedXAxis;
            }

            if (bounceBordersY) {
                ball.speedYAxis = -ball.speedYAxis;
            }

                if(playerGetsHit)
                {
                    hit = true;
                    playerHit(hit);
                }
        }
        else
        {

            if(moveObstacle)
            {
                console.log("DET STÄMMER!");
                hinder.speedYAxis = -hinder.speedYAxis;

            }
            if (bounceBordersX)
            {
                ball.speedXAxis = -ball.speedXAxis;
            }

            if ((ball.PositionValueY > hinder.PositionValueY && ball.PositionValueY < hinder.PositionValueY+hinder.height))
            {

                // Studsa på vänster sida
                if((ball.PositionValueX+ball.ballRadius>=hinder.PositionValueX) && (ball.PositionValueX<=hinder.PositionValueX ) )
                {
                    ball.speedXAxis = -ball.speedXAxis;
                }
                 //Studsa på höger sida
                if((ball.PositionValueX-ball.ballRadius<=hinder.PositionValueX+hinders.width) && (ball.PositionValueX >= hinders.PositionValueX+hinder.width ) )
                {
                    ball.speedXAxis = -ball.speedXAxis;
                }
            }
            if ((ball.PositionValueX+ball.ballRadius > hinder.PositionValueX && ball.PositionValueX-ball.ballRadius < hinder.PositionValueX+hinder.width))
            {
                if((ball.PositionValueY-ball.ballRadius+5 < hinder.PositionValueY+hinder.height) && (ball.PositionValueY-ball.ballRadius+5>hinder.PositionValueY))
                {
                    ball.isStuck = true;
                  //  delete ball;
                   // console.log("Boll fastnat!")
                }
                if((ball.PositionValueY+ball.ballRadius-5 > hinder.PositionValueY) && (ball.PositionValueY+ball.ballRadius-5<hinder.PositionValueY+hinder.height))
                {
                    ball.isStuck = true;
                    console.log()
                }
                // console.log("innanför på X!");
               if((ball.PositionValueY+ball.ballRadius>=hinder.PositionValueY) && (ball.PositionValueY<=hinder.PositionValueY ) )
                {
                    ball.speedYAxis = -ball.speedYAxis;
                }
                if((ball.PositionValueY-ball.ballRadius<=hinders.PositionValueY+hinder.height) && (ball.PositionValueY>=hinder.PositionValueY ) )
                {
                    ball.speedYAxis = -ball.speedYAxis;
                }
            }
            if(bounceBordersY)
            {
                ball.speedYAxis = -ball.speedYAxis;
            }
            if(playerGetsHit)
            {
                hit = true;
                playerHit(hit);
            }
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
     *<======= ALLTING SOM HAR MED HINDREN ATT GÖRA =======>
     *
     */

    function createHinder(startX, startY, width, height, moving, speedY, max) {
        this.PositionValueX = startX;
        this.PositionValueY = startY;
        this.width = width;
        this.height = height;
        this.speedYAxis = speedY;
        this.moving = moving;
        this.maxValue = max; // Max hur långt den kan gå ner på x-axeln
        this.color = "#000";
    }
    var hinders = {};

    //document.getElementById("moreBalls").addEventListener("click", addBalls);

    // console.log(bouncingBalls);
    var hinderCounter = 0;
    function addHinder(startX, startY, width, height, moving, speedY, max) {
        hinders["hinder" + hinderCounter] = new createHinder(startX, startY, width, height, moving, speedY, max);
        hinderCounter++;
    }

    addHinder(0,0,0,0,true,0,playfieldHeight-200);
   // addHinder(400,300,220,10,true,2,playfieldHeight-300);

    console.log(hinders);

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
            color: "black",
            img: ammoImage
        };
        shotList["shot" + shotNr] = shot;
        if(player.health>0)
        {
        shotNr++;
        }

    }

    var PowershotNr = 0;
    // Skapar ett nytt skott och pushar in det i ett objekt
    function generatePowerShot(playerX) {
        var powerShot1 = {
            id: 1,
            PositionValueX: playerX + 10,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            //color: "black"
            img: ammoImage
        };
        var powerShot2 = {
            id: 2,
            PositionValueX: playerX,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            color: "black"
        };
        var powerShot3 = {
            id: 3,
            PositionValueX: playerX + 10,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            //color: "black"
            img: ammoImage

        };
        powerShotList["PowerShot" + PowershotNr] = powerShot1;
        PowershotNr++;

        powerShotList["PowerShot" + PowershotNr] = powerShot2;
        PowershotNr++;
        powerShotList["PowerShot" + PowershotNr] = powerShot3;
        PowershotNr++;

        shotsFired.innerHTML = shotNr;


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

    function TestShotHits(list, object, obstacles) {
        for (var key in object) {

            for(var thing in obstacles)
            {
            updateEntity(object[key],obstacles[thing]);

            if(object[key].isStuck == true)
            {
                //  delete object[key];
               // object[key].PositionValueY = object[key].PositionValueY+100;
              //  object[key].PositionValueY
            }

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
    }
    /**
     *
     *<======= ALLTING SOM HAR MED UPPGRADERINGAR ATT GÖRA =======>
     *
     */
    function upgrade(width, height, type,/* color,*/img) {
        this.width = width;
        this.height = height;
        this.type = type;
        //this.color = color;
        this.img = img;
        this.PositionValueX = Math.floor(Math.random() * ((playfieldWidth - this.width) - this.width)) + this.width;
        this.PositionValueY = playfieldHeight - this.height - groundHeight;
    }

    var upgrades = {};

    var upgradeCounter = 0;

    function addUpgrades(width, height, type, img) {
        upgrades["upgrade" + upgradeCounter] = new upgrade(width, height, type, img);
        upgradeCounter++;
    }
    function deleteUpgrades() {
        upgrades = {};// console.log(upgrades)
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
     function drawImages(item)
     {
     playField.drawImage(item.img, item.PositionValueX,item.PositionValueY);
     }

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


// backgroundSound.play();


    function update() {

        ballCounter.innerHTML = Object.keys(bouncingBalls).length; // Kollar hur många bollar som är på planen för att avgöra när man klarat en bana!

        playField.clearRect(0, 0, playfieldWidth, playfieldHeight);
        //Kontrolerar så att hälsan inte kan bli mer än 100
        if(player.health > 100){
          player.health = 100;
        }
        //Uppdaterar hälsan
        healthBar.style.width = player.health + "%";

     /*   for (var hinder in hinders)
        {
        drawObject(hinders[hinder]);
        }*/

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
        powerShotsCounter.innerHTML = powerShotAvailabe;

        healthCounter.innerHTML = player.health;
        bana.innerHTML = level;

        for (var upgrade in upgrades)
        {
            drawImages(upgrades[upgrade]);
        }

       // drawImages(shot);

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

      /*  if(Object.keys(bouncingBalls).length === 0){
          clearInterval(startUpdate);
          clearInterval(startTime);

         // Window.cancelAnimationFrame()
            //  clearInterval(update);
          playField.fillStyle = "green";
          playField.fillRect((playfieldWidth/2) - 150, (playfieldHeight/2) - 80, 300, 130);
          playField.fillStyle = "#fff";
          playField.font = "bold 56px Arial";
          playField.textAlign = "center";
          playField.fillText("Winning!!!", playfieldWidth/2, playfieldHeight/2);
          var next = document.getElementById('moreBalls');
          next.style.display = "block";
          bouncingBalls = {};
          time = 0;

          shotList = {};
          next.addEventListener("click", function(){
            level++;
            next.style.display = "none";
            startGame(level);
          })
        }*/

        TestShotHits(shotList,bouncingBalls, hinders);
        TestShotHits(powerShotList,bouncingBalls,hinders);
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
    var j = 0; //variabel för att begränsa hur många bollar som genereras per bana
    var startTime = setInterval(function(){
        if(updateTime() % 10 == 0 && j <= level)
        {
            addBalls(bigBallRadius, (Math.floor(Math.random() * 9) + 1) *100, 100, firstBallSpeed);
            j++;
        }
        else if(timer.innerHTML % 7 == 0)
        {
            addUpgrades(50, 50, "Ammo", ammoImage);
        }
        else if(timer.innerHTML % 13 == 0 && player.health < 100)
        {
            addUpgrades(50, 50, "Health", healthImage);
        }
        else if(timer.innerHTML % 31 == 0)
        {
            addUpgrades(50, 50, "PowerSot", ammoImage);
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
startGame(1);

