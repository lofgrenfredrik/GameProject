



function init() {

  var canvas = document.getElementById('myCanvas').getContext('2d');
  var HEIGHT = 650;
  var WIDTH = 800;
  var playerX = WIDTH / 2;
  var shotList = [];
  // intervall som uppdateringsfunktionen körs
  setInterval(update,20);

  // Function som rensar canvasen och ritar sedan upp spelarboxen med uppdaterad position
  function update(){
    canvas.clearRect(0,0,WIDTH,HEIGHT);
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

  // Ritar upp spelarboxen
  function playerBox(){
    canvas.fillStyle = "purple";
    canvas.fillRect(playerX,550,50,50);
  }

  var player = {
    x: playerX,
    y: 550,
    width: 50,
    height: 50,
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
      player.x -=20; //fart på spelaren
    }
    if(player.right){
      player.x +=20; //fart på spelaren
    }
    // Spelaren kan inte röra sig utanför spelplane
    if(player.x < 0){
      player.x = 0;
    }
    if(player.x > WIDTH - player.width){
      player.x = WIDTH - player.width;
    }
  }

  // END ****Tar emot tangent input och förflyttar spelaren****************************

  // Skapar ett nytt skott och pushar in det i en array
  function generateShot(playerX){
    var shot = {
      x: playerX + 20,
      y: 550,
      width: 10,
      height: 10,
      color: "black"
    }
    shotList.push(shot);
  };

  // Ritar upp skotten i arrayen
  function drawObjects(object){
    canvas.fillStyle = object.color;
    canvas.fillRect(object.x,object.y,object.width,object.height);
  }

  // Förflyttar skotten i y-axeln och om det går utanför y axeln så tas de bort ur arrayen
  function animateShots(object){

    // Skott som en linje
    object.height -=30;
    // if(object.height < -900){

    // // skott som en punkt
    object.y -= 20; //fart på skotten
    if(object.y < 0){
      shotList.shift();
    }
  }

}
