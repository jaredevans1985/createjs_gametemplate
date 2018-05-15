class LoadingScreen extends ScreenBase
{
     constructor()
     {
        super();

        //Create a text object
        myText = new createjs.Text("I'm a loadin'", "12px Titan One", ui.colors.text);  //creates text object
        myText.x = 10; //positions the text
        myText.y = 50; 
        this.container.addChild(myText);  //adds the text object to the stage
     }
}

//  // Create a text object
//  myText = new createjs.Text("Hello World", "12px Titan One", "#ff00ff");  //creates text object
//  myText.x = 10; //positions the text
//  myText.y = 50; 
//  this.stage.addChild(myText);  //adds the text object to the stage
 
//  // Create a container
//  var containerObj = new createjs.Container();
//  this.stage.addChild(containerObj);
//  containerObj.setTransform(100,100);

//  // Draw a circle
//  var circle = new createjs.Shape();  //creates object to hold a shape
//  circle.graphics.beginFill("#A66").drawCircle(0, 100, 40);  //creates circle at 0,0, with radius of 40
//  circle.x = circle.y = 50;  //this just sets the x and y equal to 50
//  containerObj.addChild(circle);  //add the circle to the stage but it is not apparent until the stage is updated
//  //circle.visible = false;
//  this.GameObjects[0] = circle;
//  console.log(this.GameObjects[0].x);

//  // Draw un rectangulo
//  var rectangle = new createjs.Shape();
//  rectangle.graphics.beginFill('#447').drawRect(200, 200, 50, 50);
//  rectangle.setBounds(0, 0, 50, 50);
//  rectangle.regX = rectangle.getBounds.width/2;
//  rectangle.regY = rectangle.getBounds.height/2;
//  containerObj.addChild(rectangle);

//  // Basic hit testing
//  if(circle.hitTest(-40, 100))
//  {
//      console.log("circle hit");
//  }
//  else
//  {
//      console.log("no hit");
//  }

 
//  circle.on("click", function(evt) { console.log("Clicked"); });        
//  circle.on("mouseover", function(evt) { console.log("Mouse Over"); });        
//  circle.on("mouseout", function(evt) { console.log("Mouse Out"); });        
//  circle.on("mousedown", function(evt) { console.log("Mouse Down"); }); 