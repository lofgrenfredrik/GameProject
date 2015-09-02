//Create a stage by getting a reference to the canvas
    stage = new createjs.Stage("demoCanvas");
    //Create a Shape DisplayObject.
    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 40);
    //Set position of Shape instance.
    circle.x = 300;
    circle.y = 50;

    circle2 = new createjs.Shape();
    circle2.graphics.beginFill('blue').drawCircle(0,0,40);
    circle2.x = 50;
    circle2.x = 300;
    //Add Shape instance to stage display list.
    stage.addChild(circle);
    stage.addChild(circle2);
    //Update stage will render next frame
    stage.update();
