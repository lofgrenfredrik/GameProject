<?php require_once('dbconnect.php');?>
<?php
    $message ="";
    if(isset($_POST["signUp"]))
        if(empty($_POST["playerName"]))
        {
            $message = "<p class='errorMessage'>Please write your name</p>";
        }
        else
        {
            {
                try{
                    $query = "INSERT INTO highscore(player, accuracy, totalShots, shotgunShots,pistolShots,highscoreDate) ";
                    $query .= "VALUES (:player, :accuracy, :totalShots, :shotgunShots,:pistolShots, NOW())";
                    $ps = $db->prepare($query);
                    $ps->bindValue("player", $_POST["playerName"]);
                    $ps->bindValue("accuracy",  $_POST["accuracy"]);
                    $ps->bindValue("totalShots",  $_POST["totalShots"]);
                    $ps->bindValue("shotgunShots",  $_POST["shotgunShots"]);
                    $ps->bindValue("pistolShots",  $_POST["pistolShots"]);
                    if($ps->execute())
                    {
                        $message = "<p class='successMessage'>Your High Score is submitted</p>";
                    }
                }
                catch (Exception $e)
                {
                    echo $e->getMessage();
                }
            }
        }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ballbuster</title>
    <link rel="shortcut icon" href="images/guySmile.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Ballbuster! A Javascript and HTML5 game developed by Fredrik Löfgren & Vilhelm Falkenmark.">
    <meta name="author" content="Vilhelm Falkenmark and Fredrik Löfgren">
    <link rel="stylesheet" href="css/style.css" charset="utf-8">
    <!--Start Google Analytics!-->
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-49166471-3', 'auto');
        ga('send', 'pageview');
    </script>
    <!--End Google Analytics!-->
</head>
<body>
<div id="mainContainer">
<div id="intro-container">
    <h1>Welcome to Ballbuster!</h1>
    <div class="width90">
<!--        <p>The rules are simple</p>-->
        <p id="animate1" class="introText"><span class="red">Gameplay: </span>X amount of Balls will be generated on each level where X increases for each level.
            Your job is to shoot the balls. You will receive two pistol shots every tenth second.
            Ammo packs  will be generated every Y second where Y increases for each level.
            The first health pack will be generated after you´ve taken damage, after that they will be generated after the same principle as the ammo packs.
            Keep your eye on the timer because all upgrades will be deleted from the playfield every tenth second.
            There are a total of four levels.
        </p>
        <p id="animate2" class="introText"><span class="red">Controllers: </span>Use your <span class="red">left</span> and <span class="red">right</span> Arrow keys to move Guy around. Use your <span class="red">up</span>
            arrow key to switch between weapons. Fire with the <span class="red">space</span> key. <br> <br>Good Luck!</p>
        <div id="animate3">

            <p>A game written in pure Javascript by:</p>
            <div class="portrait" id="villeFace"></div>
            <div class="portrait" id="guyFace"></div>
            <div class="portrait" id="fredrikFace"></div>
            <div class="portfolioLink"><a href="http://vilhelmfalkenmark.se/"target="_blank">Vilhelm Falkenmark</a></div>
            <div class="portfolioLink"><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">Guy</a></div>
            <div class="portfolioLink"><a href="http://lofgrenfredrik.github.io/"target="_blank">Fredrik Löfgren</a></div>
        </div>
        <div id="animate4"><div class="button" id="startGame"><div>Start Game</div></div></div>
        <div id="linktoHighscore"><a href="highscore.php" target="_blank">View Highscorelist</a></div>
    </div>
</div>
<div id="game-container">
    <div id="canvasContainer">
        <canvas id="playField" width="1000" height="550"></canvas>
        
        <div id="infoContainer">
            <div id="levelInfo">
                <p class="header"><span id="statusText"></span></p>
                <p>LEVEL: <span id="level">1</span></p>
                <p>Accuracy: <span id="accuracy"></span>%</p>
                <p>Total amount of shots fired: <span id="totalShotsFired">0</span></p>
                <p>Pistol shots fired: <span id="shotsFired">0</span></p>
                <p>Shotgun shots fired <span id="specialShotsFired">0</span></p>
                <p>Balls destroyed: <span id="collisionCounter">0</span></p>
                <div id="buttonSelector" class="button"><div id="buttonText"></div></div>
            </div>

            <div id="highscoreSignUpContainer">
                <p class="header">You finished the Game!</p>

                <p>Accuracy: <span id="accuracyHS">0</span>%</p>
                <p>Total amount of shots fired: <span id="totalShotsFiredHS">0</span></p>
                <p>Pistol shots fired: <span id="pistolShotsFiredHS">0</span></p>
                <p>Shotgun shots fired <span id="specialShotsFiredHS">0</span></p>
                <p>Balls destroyed: <span id="collisionCounterHS">0</span></p>

                <form action="" method="post">
                    <input type="hidden" name="accuracy" id="hiddenAccuracy" value="">
                    <input type="hidden" name="totalShots" id="hiddenTotalShotsFired" value="">
                    <input type="hidden" name="shotgunShots" id="hiddenSpecialShotsFired" value="">
                    <input type="hidden" name="pistolShots" id="hiddenPistolShotsFired" value="">
                    <input type="text" class="input" name="playerName" placeholder="Your name" maxlength="20">
                    <?php echo $message ?>
                    <input type="submit" id="submitButton" name="signUp" value="Add me to High Score List">
                </form>
                <div class="link"><a href="highscore.php">View HighScore</a></div>
            </div>
        </div>
    </div>
    <div id="gameInfoContainer">
        <div class="col_12">
            <div class="health-bar-container">
                <div id="health-bar"><div id="health">0</div>%</div>
            </div>
        </div>
        <div class="space"></div>

        <div class="col_3">
            <div id="soundController" class="soundOnButton">
                <div id="toggleSoundText">Sound On</div>
            </div>
        </div>


        <div class="col_3">
            <div id="timerContainer" class="center">
                <div class="greenText">Timer: &nbsp<span id="timer">0</span></div>
            </div>
        </div>

        <div class="col_3">
            <div id="ammoSelect" class="center">

                <img src="images/ammoCropped.png">


                <p class="info" id="ammoSelectColor">&nbsp;X&nbsp;<span id="ammo-info"></span></p>
            </div>
        </div>

        <div class="col_3">
            <div id="specialAmmoSelect" class="center">

                <img src="images/specialammoCropped.png">

                <p class="info" id="specialAmmoSelectColor">&nbsp;X&nbsp;<span id="power-ammo-info"></span></p>
            </div>
        </div>


        <div class="col_4 left-corner">
            <div>Bollar i omlopp: <span id="ballCounter"></span></div>
            <div>Ammunition: <span id="ammoCounter"></span></div>
            <div>Powershots: <span id="powerShotsCounter"></span></div>
            <div>Hit per level: <span id="swag">0</span></div>
            <div>Framecount: <span id="frame">0</span></div>
        </div>
    </div>
</div>
</div>
<!-- END MAIN CONTAINER-->
<div id="phoneContainer">
    <div id="sorry">
        <p>Hi!<br><br>It looks like your screen is too small for this Game :(</p>
        <p>Please come back when you are sitting in front of a computer. If you are sitting in front of a computer
            please extend your browser window so it is wider than 960px.</p>
        <p>Best Regards! / Vilhelm Falkenmark & Fredrik Löfgren - The Ballbusters</p>
    </div>
</div>

<img src="images/health.png" id="healthImage">
<img src="images/shot.png" id="shotImage">
<img src="images/specialShot.png" id="specialShotImage">

<img src="images/specialammo.png" id="powerAmmoImage">
<img src="images/ammo2.png" id="ammoImage">


</body>
<script src="js/main.js" charset="utf-8"></script>
<script src="js/jquery.js"></script>
<script src="js/intro.js" charset="utf-8"></script>

</html>
