<?php
/**
 * define() defines a constant which unlike variables, can not be redefined.
 * Constants are also global meaning the can be reached in any scope.
 */
//Special cases MAMP

define("DSN", "mysql:host=localhost;dbname=game;");
define("USER", "root"); // FÖR ATT KÖRA LOKALT
define("PASS", "root"); // FÖR ATT KÖRA LOKALT

$opt = array(
    // any occurring errors will be thrown as PDOException
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    // an SQL command to execute when connecting
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'"
);
$db = new PDO(DSN, USER, PASS, $opt);
?>