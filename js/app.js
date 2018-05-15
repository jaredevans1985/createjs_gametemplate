// This is our global container for the entire app
var app = {
    // put any 'global' variables here, e.g. anything you want to access wherever you are

    // This will hold the stage variable needed for createJS
    stage: null,
 
    // Store a reference to the game canvas and the context
    canvas: null,
    ctx: null,

    // Screen settings and container
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600,
    screen: null,

    // Keep track of the elapsed game time and frame count
    elapsedTime: 0,

    // Game Settings
    FPS: 30,

    // Asset management
    gameObjects: [],
    gfx: null,

    // Game state
    //  - loading
    //  - playing
    gamestate: "loading",

    // Setup the canvas
    setupCanvas: function() {
      this.canvas = document.getElementById("game"); //get canvas with id='game'
      this.canvas.width = this.SCREEN_WIDTH;
      this.canvas.height = this.SCREEN_HEIGHT;
      this.ctx = this.canvas.getContext("2d");
      this.stage = new createjs.Stage(this.canvas); //makes stage object from the canvas
    },
    
    // Run once when the page loads
    init: function () {
        // Sets up the canvas and our screen
        this.setupCanvas(); 
        this.screen = new createjs.Container();
        this.screen.setBounds(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.stage.addChild(this.screen);

        //Create a text object
        myText = new createjs.Text("TOOTS", "12px Titan One", "#ff00ff");  //creates text object
        myText.x = 100; //positions the text
        myText.y = 200; 
        this.screen.addChild(myText);  //adds the text object to the stage
        // Create our graphics manager
        //this.gfx = new GraphicsManager();

        // Enable and track mouse input
        this.stage.enableMouseOver();
        
        this.mouseX, this.mouseY;
        this.stage.on("stagemousemove", function(evt) {
            app.mouseX = Math.floor(evt.stageX);
            app.mouseY = Math.floor(evt.stageY);
            //console.log("Mouse: ( " + app.mouseX + ", " + app.mouseY + " )");
        });

        // Set up our basic keyboard inputs
        var KEYCODE_LEFT = 37;
        var KEYCODE_UP = 38;
        var KEYCODE_RIGHT = 39;
        var KEYCODE_DOWN = 40;
        var KEYCODE_SPACEBAR = 32;
        
        function handleKeyDown(evt) {
        if(!evt){ var evt = window.event; }  //browser compatibility
            switch(evt.keyCode) {
                case KEYCODE_LEFT:  console.log(evt.keyCode+" down"); return false;
                case KEYCODE_RIGHT: console.log(evt.keyCode+" down"); return false;
                case KEYCODE_UP:  console.log(evt.keyCode+" down"); return false;
                case KEYCODE_DOWN:  console.log(evt.keyCode+" down"); return false;
                case KEYCODE_SPACEBAR:  console.log(evt.keyCode+" down"); return false;
            }
        }
        
        function handleKeyUp(evt) {
        if(!evt){ var evt = window.event; }  //browser compatibility
            switch(evt.keyCode) {
                case KEYCODE_LEFT:  console.log(evt.keyCode+" up"); break;
                case KEYCODE_RIGHT:   console.log(evt.keyCode+" up"); break;
                case KEYCODE_UP:    console.log(evt.keyCode+" up"); break;
                case KEYCODE_DOWN:  console.log(evt.keyCode+" up"); break;
                case KEYCODE_SPACEBAR:  console.log(evt.keyCode+" up"); break;
            }
        }
        
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        // Preload our game assets
        assets.preloadAssets();
        
        // Set up our game loop
        createjs.Ticker.addEventListener("tick", this.update);
        createjs.Ticker.setFPS(this.FPS);

        // Create the first screen
        this.gotoScreen("loading");

    },

    // Our game's update function, which will be run every tick at the FPS we specified
    update: function (event)
    {
        // Calculate our delta time
        var dt = event.delta / 1000;

        app.stage.update();  //updates the stage

        // Draw our game to match the state
        if(app.gamestate == "loading")
        {
            //console.log("We're loading");
        }
        else if (app.gamestate == "playing")
        {
            //console.log("We're playing");
        }
    },

    // Given a screen id, change our screen to a new one
    gotoScreen: function(screenType)
    {
        // In most cases, we clear all the children of the current screen 
        switch(screenType)
        {
            case "loading":
            this.screen.removeAllChildren();
            this.screen = new LoadingScreen();
            break;

            case "mainmenu":
            this.screen.removeAllChildren();
            this.screen = new MainMenu();
            break;

            default:
            console.log("ERROR: Cannot swap screen, invalid ID");
            break;
        }
    },

}
    