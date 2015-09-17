var playField = document.getElementById("playField").getContext("2d");
playField.font = '30px Arial';

var playfieldHeight = document.getElementById("playField").height;
var playfieldWidth = document.getElementById("playField").width;

var redColor = "#E74C3C";
var greenColor = "#1BBC9B";

var specialAmmoSelectColor = document.getElementById("specialAmmoSelectColor"); // Infon nedanför healthbar som säger hur mycket skott man har kvar
var ammoSelectColor =   document.getElementById("ammoSelectColor"); // Infon nedanför healthbar som säger hur mycket skott man har kvar


var shotList = {};
var powerShotList = {};
var powerShotAvailabe = 600;
var powerUp = false;

var bigBallRadius = 60;
var mediumBallRadius = 40;
var smallBallRadius = 20;

var typeOfShot = "pistol";
var ammoSelect = document.getElementById('ammoSelect');
var SpecialAmmoSelect = document.getElementById('SpecialAmmoSelect');
var restart = false;


/**
 *
 *  Variabler som ändras när man klarar en bana!
 *
 **/
var ballSpeed = 0.2;
var healthGenerate = 12;
var ammoGenerate = 11;
var specialAmmoGenerate = 13;
var ballSpawnInterval = 10;



var collisionCounter = document.getElementById("collisionCounter");
var ammoCounter = document.getElementById("ammoCounter");
var powerShotsCounter = document.getElementById("powerShotsCounter");
var displayAmmo = document.getElementById("ammo-info");
var displayPowerAmmo = document.getElementById("power-ammo-info");
var ammoLeft = 10;
var time = 0;
var healthCounter = document.getElementById("health");
var frameCount = 0;
var groundHeight = 32; // Höjden på marken i bilden.
var ballCounter = document.getElementById("ballCounter");
var accuracy = document.getElementById("accuracy");
var healthBar = document.getElementById("health-bar");
var levelCounter = document.getElementById("level");
var level = 1;
var j = 0; //variabel för att begränsa hur många bollar som genereras per bana
var levelInfo = document.getElementById('levelInfo');
var statusTetxt = document.getElementById('statusTetxt');
var button = document.getElementById('buttonSelector');
var buttonText = document.getElementById('buttonText');
var levelComplete = false;
var backGrounds = ["pixelBG2.jpg", "fantasy.png", "forest.png", "desert.png"];
// Sounds ********************
var pop = new Audio();
//pop.src = "sound/pop.wav";
var shotSound = new Audio();
//shotSound.src = "sound/bang.wav";
var specialShotSound = new Audio();
//specialShotSound.src = "sound/loudgun.wav";
//var reload = new Audio();
//reload.src = "sound/reload.wav";
//var healthSound = new Audio();
//healthSound.src = "sound/yes.wav";
var backgroundSound = new Audio();
//backgroundSound.src = "sound/retro.mp3";

var playFieldBackground = document.getElementById("playField");
var shotsFired = document.getElementById("shotsFired");
var specialShotsFired = document.getElementById("specialShotsFired");
var totalShotsFired = document.getElementById("totalShotsFired");

var ammoImage = document.getElementById("ammoImage");
var powerAmmoImage = document.getElementById("powerAmmoImage");
var healthImage = document.getElementById("healthImage");
var shotImage = document.getElementById("shotImage");
var specialShotImage = document.getElementById("specialShotImage");
ammoSelect.style.backgroundColor = greenColor;
// ammoImage.style.display ="none";
healthImage.style.display ="none";
shotImage.style.display ="none";
specialShotImage.style.display ="none";

var hitPerLevel = 0;
var swag = document.getElementById("swag");

var frame = document.getElementById("frame");

// powerAmmoImage.style.display ="none";
var gameTime = document.getElementById('gameTime');
var player = new Image();
player.src = "images/villeSprite2.png";  // WTF?! Varför utgår man från vart html-filen ligger och inte JS filen?
player.left = false;
player.right = false;
player.health = 100;
player.height = 75;
player.width = 65; //
player.PositionValueX = 100;
player.PositionValueY = playfieldHeight - 75 - groundHeight;
player.animateX = (player.width) - 25;
player.animateY = player.height;

var strafeX = 260;
var bouncingBalls = {};

//document.getElementById("changeLevel").addEventListener("click",changeLevel);

function startGame() {

    /**
     *
     *<======= STARTA TIMERS! =======>
     *
     */
    function updateTime() {
        time++;
        document.getElementById("timer").innerHTML = time;
        if (time % 10 === 0) {
            ammoLeft += 2;
        }
        return time;
    }

    function updateFrameCount() {
        frameCount++;
        frame.innerHTML = frameCount;
        return frameCount;
    }




    setInterval(function () {
        hit = false;
        player.color = "#fff";
    }, 400);
    function playerHit(hit) {
        if (hit) {
            healthBar.className = "";
            player.color = "red";
            player.health--;
            checkHealth(player.health);
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
        if (player.right === false && player.left === false) {
             strafeX = 260;
        }

        // Shoot spacebar
        if (keyPress.keyCode === 32) {
          shoot(typeOfShot);
        }
        // Shoot selector uparrow
        if (keyPress.keyCode === 38) {
          typeOfShot === "pistol" ?

          (typeOfShot = "shotgun",
           ammoSelect.style.backgroundColor = "#fff",
           ammoSelectColor.style.color =greenColor,
           specialAmmoSelect.style.backgroundColor = greenColor,
           specialAmmoSelectColor.style.color = "#fff",

           strafeX = 260+(65*6))
              :
           (typeOfShot = "pistol",
               ammoSelectColor.style.color = "#fff",

               ammoSelect.style.backgroundColor = greenColor,
            specialAmmoSelect.style.backgroundColor = "#fff",
               specialAmmoSelectColor.style.color = greenColor,

               strafeX = 260+(65*5));





        }


    };

    document.onkeyup = function (keyPress) {
        if (keyPress.keyCode === 37) {
            // Move left
            player.left = false;
            strafeX = 260;

        }
        if (keyPress.keyCode === 39) {
            // Move right
            player.right = false;
            strafeX = 260;

        }
    };
    function playerPosition() {
        if (player.left) {
            player.PositionValueX -= 10; //fart på spelaren

            strafeX = 65*frameCount;

            if(frameCount>=4)
            {
                frameCount = 0;
            }

            /*if(frameCount % 2 === 0) {
                strafeX = 65*6;
            }
            else
            {
                strafeX = 65*3;

            }*/



        }
        if (player.right) {
            player.PositionValueX += 10; //fart på spelaren

            strafeX = (65*frameCount)+260;

            if(frameCount>=4)
            {
                frameCount = 0;
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

    function bouncingBall(ballSize, startX, startY,speedX) {

        this.ballRadius = ballSize;
        this.PositionValueX = startX;
        this.PositionValueY = startY;
        this.speedXAxis = speedX;
        this.speedYAxis = Math.round((Math.random() * ballSpeed) + 1);
        this.hexColorCode = ballColors[Math.floor((Math.random() * ballColors.length) + 1)];
       // this.hypo = Math.sqrt(Math.pow(ballSize,2)*2);
      //  this.img = image;
       // this.isStuck = false;
    }

    var i = 0;

    function addBalls(sizeofHitBall, startX, startY,speedX) {
        bouncingBalls["ball" + i] = new bouncingBall(sizeofHitBall, startX, startY,speedX);
        i++;
    }


    function updateEntity(ball) {
        ball.PositionValueX += ball.speedXAxis;
        ball.PositionValueY += ball.speedYAxis;

        playField.beginPath();

        playField.fillStyle = ball.hexColorCode;


        playField.arc(ball.PositionValueX, ball.PositionValueY, ball.ballRadius, 0, Math.PI * 2, true);


        playField.closePath();
        playField.fill();



        var bounceBordersX = ball.PositionValueX < ball.ballRadius || ball.PositionValueX > playfieldWidth - ball.ballRadius;
        var bounceBordersY = ball.PositionValueY < ball.ballRadius || ball.PositionValueY > playfieldHeight - ball.ballRadius - groundHeight;
        var playerGetsHit = (ball.PositionValueY > playfieldHeight - player.height - ball.ballRadius && ((player.PositionValueX + player.width / 2) > ball.PositionValueX - ball.ballRadius && (player.PositionValueX + player.width / 2) < ball.PositionValueX + ball.ballRadius));

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
     function shoot(type){
       if(type === "pistol"){
         if (ammoLeft > 0) {
             generateShot(player.PositionValueX);
             ammoLeft--;
             shotSound.play();
             shotSound.currentTime=0;
             strafeX = 260+(65*5)
         }
       }
       else if(type === "shotgun"){
         if (powerShotAvailabe > 0) {
             generatePowerShot(player.PositionValueX);
             powerShotAvailabe--;
             specialShotSound.play();
             specialShotSound.currentTime=0;
             strafeX = 260+(65*6)
            // powerShotsCounter.innerHTML = powerShotAvailabe;
         }
       }
     }
    var shotNr = 0;

    function generateShot(playerX) {
        var shot =
        {
            PositionValueX: playerX + 11,
            PositionValueY: playfieldHeight - groundHeight-player.height-10,
            width: 12,
            height: 20,
            color: "black",
            img: shotImage
        };
        shotList["shot" + shotNr] = shot;

        if(player.health>0)
        {
        shotNr++;
        shotsFired.innerHTML = shotNr;
        }
        countTotal()
    }

    var PowershotNr = 0;
    function generatePowerShot(playerX) {
        var powerShot1 = {
            id: 1,
            PositionValueX: playerX+20,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            img: specialShotImage
        };
        var powerShot2 = {
            id: 2,
            PositionValueX: playerX+10,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            img: specialShotImage
        };
        var powerShot3 = {
            id: 3,
            PositionValueX: playerX+15,
            PositionValueY: playfieldHeight - groundHeight-player.height,
            width: 10,
            height: 10,
            //color: "black"
            img: specialShotImage

        };
        powerShotList["PowerShot" + PowershotNr] = powerShot1;
        PowershotNr++;

        powerShotList["PowerShot" + PowershotNr] = powerShot2;
        PowershotNr++;
        powerShotList["PowerShot" + PowershotNr] = powerShot3;
        PowershotNr++;
        specialShotsFired.innerHTML = (PowershotNr/3);

        countTotal()
    }

    function countTotal()
    {
        totalShotsFired.innerHTML = parseInt(specialShotsFired.innerHTML)+parseInt(shotsFired.innerHTML);
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
                  pop.currentTime=0;
                    if (object[key].ballRadius == 60) {
                        addBalls(mediumBallRadius, object[key].PositionValueX + 20, object[key].PositionValueY, (Math.random() * object[key].speedXAxis) + 1);
                        addBalls(mediumBallRadius, object[key].PositionValueX - 20, object[key].PositionValueY, ((Math.random() * object[key].speedXAxis) + 1) * -1);
                    }
                    if (object[key].ballRadius == 40) {
                        addBalls(smallBallRadius, object[key].PositionValueX + 10, object[key].PositionValueY, (Math.random() * object[key].speedXAxis) + 1);
                        addBalls(smallBallRadius, object[key].PositionValueX - 10, object[key].PositionValueY, ((Math.random() * object[key].speedXAxis) + 1)* -1);
                    }
                    delete object[key]; // Tar bort bollen som träffar texten!
                    delete list[k]; // Tar bort bollen som träffar texten!
                    numberOfCollisions++;
                    hitPerLevel++;
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
    function upgrade(width, height, type,/* color,*/img) {
        this.width = width;
        this.height = height;
        this.type = type;
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

  /* function drawBalls(ball)
    {
        playField.drawImage(ball.img,ball.PositionValueX,ball.PositionValueY);
    }*/

    /**
     *
     *<======= UPPDATERING SOM KÖRS VAR 20 millisekund =======>
     *
     */


    function update() {
        playFieldBackground.style.background = 'url("images/' + backGrounds[level-1] + '")';
        ballCounter.innerHTML = Object.keys(bouncingBalls).length; // Kollar hur många bollar som är på planen för att avgöra när man klarat en bana!
        playField.clearRect(0, 0, playfieldWidth, playfieldHeight);
        //Kontrolerar så att hälsan inte kan bli mer än 100
        if(player.health > 100){
          player.health = 100;
        }
        //Uppdaterar hälsan


        healthBar.style.width = player.health + "%";

       // console.log(player.health);


        collisionCounter.innerHTML = numberOfCollisions;
        var accuracyCounter = ((collisionCounter.innerHTML)/(totalShotsFired.innerHTML)*100).toFixed(0);

        if(shotNr == 0 && PowershotNr == 0)
        {
            accuracy.innerHTML = 0;
        }
        else if(accuracyCounter<=100)
        {
            accuracy.innerHTML = accuracyCounter
        }
        else if(accuracyCounter>100)
        {
            accuracy.innerHTML = 100;
        }

        swag.innerHTML = hitPerLevel;


        var accuracyCounter = ((collisionCounter.innerHTML)/(totalShotsFired.innerHTML)*100).toFixed(0);

        if(shotNr == 0 && PowershotNr == 0)
        {
            accuracy.innerHTML = 0;
        }
        else if(accuracyCounter<=100)
        {
        accuracy.innerHTML = accuracyCounter
        }
        else if(accuracyCounter>100)
        {
            accuracy.innerHTML = 100;
        }

        ammoCounter.innerHTML = ammoLeft;
        powerShotsCounter.innerHTML = powerShotAvailabe;
        displayAmmo.innerHTML = ammoLeft;
        displayPowerAmmo.innerHTML = powerShotAvailabe;

        healthCounter.innerHTML = player.health;
        levelCounter.innerHTML = level;

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
              //  reload.play();
               // reload.currentTime=0;
                delete upgrades[item];
            }
            else if(distanceBetweenPlayerAndUpgrade>-marginal && distanceBetweenPlayerAndUpgrade<marginal && upgrades[item].type === "Health")
            {
                healthBar.className = "smoothTrans";
                console.log("Health!");
                player.health += 20;
                //healthSound.play();
                //healthSound.currentTime=0;
                delete upgrades[item];
            }
            else if(distanceBetweenPlayerAndUpgrade>-marginal && distanceBetweenPlayerAndUpgrade<marginal && upgrades[item].type === "PowerShot")
            {
                console.log("PowerShot!");
                powerShotAvailabe += 8; // HUR MÅNGA POWERSHOTS MAN FÅR VID UPPGRADERING!
                delete upgrades[item];
                hitPerLevel = 0;
            }
        }
        //UPPDATERAR SKOTTPOSITIONEN FÖR VARJE SKOTT I OBJEKTET
        for(var shot in shotList){
            animateShots(shotList[shot]);
        }



        // RITA UT SKOTTEN
        for(var key in shotList){
            drawImages(shotList[key]);
        }


        for(var power in powerShotList){
            animateShots(powerShotList[power]);
        }
        // RITA UT SKOTTEN
        for(var powerS in powerShotList){
            drawImages(powerShotList[powerS]);
        }
        // RITA UT BOLLARNA SAMT KOLLAR OM SKOTTEN TRÄFFAR
        TestShotHits(shotList,bouncingBalls);
        TestShotHits(powerShotList,bouncingBalls);

          // Kontrolerar om banan är avklarad
          if(Object.keys(bouncingBalls).length === 0 && levelComplete === true){
            levelInfo.style.display = "block";
            statusText.innerHTML = "Level complete!";
            levelInfo.style.backgroundColor = greenColor;
            buttonText.innerHTML = "Next Level";
          }

        TestShotHits(shotList,bouncingBalls);
        TestShotHits(powerShotList,bouncingBalls);
    }
    function checkHealth(health)
    {
        if(health < 0)
        {
            clearInterval(startUpdate);
            clearInterval(startTime);
            levelInfo.style.display = "block";
            statusText.innerHTML = "You died!";
            levelInfo.style.backgroundColor = redColor;
            buttonText.innerHTML = "Restart";
            restart = true;
        }
    }
    var startUpdate = setInterval(update, 20);
    var startTime = setInterval(function(){
        if(updateTime() === 1)
        {
          for(var l = 0; l < level; l++){
            addBalls(bigBallRadius, (Math.floor(Math.random() * 9) + 1) *100, 100, ballSpeed);
          }
        }
        if(timer.innerHTML % 10 === 0 && j <= level)
        {
            addBalls(bigBallRadius, (Math.floor(Math.random() * 9) + 1) *100, 100, ballSpeed);
            j++;
        }
        else if(timer.innerHTML % ammoGenerate === 0 && levelComplete != true)
        {
            addUpgrades(50, 50, "Ammo", ammoImage);
        }
        else if(timer.innerHTML % healthGenerate === 0 && player.health < 100 && levelComplete != true)
        {
            addUpgrades(50, 50, "Health", healthImage);
        }
        if(timer.innerHTML % specialAmmoGenerate === 0 && levelComplete != true && hitPerLevel>10)
        {
            addUpgrades(50, 50, "PowerShot", powerAmmoImage);
        }
        else if(timer.innerHTML % 5 === 0)
        {
           deleteUpgrades();
        }
        else if(j === level + 1 && Object.keys(bouncingBalls).length === 0){
          levelComplete = true;
        }

    },1000);

    setInterval(function(){
        updateFrameCount();
    },100);
}
startGame(1);
button.addEventListener("click", function(){
  if(restart === true){
    location.reload();
  }
  else{
    level++;
    bouncingBalls = {};
    time = 0;
    j = 0;
    levelComplete = false;
    levelInfo.style.display = "none";
    ballSpeed +=1;
    healthGenerate +=10;
    ammoGenerate +=10;
    specialAmmoGenerate +=10;
  }



});
