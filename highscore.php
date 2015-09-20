<?php require_once('dbconnect.php');

function get_all_from_highscores()
{
    try
    {
        global $db;
        $query = "SELECT * FROM highscore";
        $ps = $db->prepare($query);
        $ps->execute();
    }
    catch (Exception $e)
    {
        echo $e->getMessage();
    }
    return $ps->fetchAll(PDO::FETCH_ASSOC);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ballbusters - Highscore</title>
    <link rel="stylesheet" href="css/style.css" charset="utf-8">
    <link rel="shortcut icon" href="images/guySmile.ico" />
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
<body class="highScoreBody">

<div id="highScoreTable">
    <div id="guySmile" class="col_4"></div>
    <div id="highscoreHeader" class="col_8">
    <h1>Ballbusters High Scores</h1>
    <p>A Javascript Game by <a href="http://lofgrenfredrik.github.io/"target="_blank">Fredrik Löfgren</a> & <a href="http://vilhelmfalkenmark.se/"target="_blank">Vilhelm Falkenmark</a></p>
    <div class="link"><a href="index.php">Play the game</a></div>
</div>
    <div class="space40"></div>

    <table>
    <thead><td class="align-left">Placement</td><td class="align-left">Player Name</td><td>Accuracy</td><td>Shots fired</td><td>Shotgun</td><td>Pistol</td><td>Date</td></thead>
<?php
$highscores = get_all_from_highscores();

    usort($highscores, function($a, $b) {
        return $b['accuracy'] - $a['accuracy'];
    });
$rowCounter = 1;

foreach($highscores as $highscore)
{
    echo "<tr>";

    echo "<td>$rowCounter</td>";
    echo "<td class='align-left'>{$highscore['player']}</td>";
    echo "<td>{$highscore['accuracy']} %</td>";
    echo "<td>{$highscore['totalShots']}</td>";
    echo "<td>{$highscore['shotgunShots']}</td>";
    echo "<td>{$highscore['pistolShots']}</td>";
    echo "<td>{$highscore['highscoreDate']}</td>";
    echo "</tr>";

    $rowCounter++;
}
?>


    </table>

</div>
</body>

</html>

