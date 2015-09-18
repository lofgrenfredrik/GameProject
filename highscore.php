<?php require_once('dbconnect.php');?>
    <?php

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
    <link href='https://fonts.googleapis.com/css?family=Abril+Fatface' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="css/style.css" charset="utf-8">
</head>
<body class="highScoreBody">


<div id="highScoreTable">

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

