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
    player: null,

    // Game state
    //  - loading
    //  - gameplay
    //  - mainmenu
    gamestate: "loading",

    // Track the particle emitters
    // We'll update this in update
    // Note that since our particles are createjs objects, createjs will do the drawing for us
    particleSystem: [],

    // Track the number of clicks during gameplay
    numClicks: 0,

    // Keyboard input info
    KEYCODE_LEFT : { code: 37, isPressed: false},
    KEYCODE_UP : { code: 38, isPressed: false},
    KEYCODE_RIGHT : { code: 39, isPressed: false},
    KEYCODE_DOWN : { code: 40, isPressed: false},
    KEYCODE_SPACEBAR : { code: 32, isPressed: false},

    // Mouse pos tracker
    mousePos: {x: 0, y: 0},

    // Player Movement Settings
    moveSpeed: 100,
    rotSpeed: 100,

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

        // Enable and track mouse input
        this.stage.enableMouseOver();
        
        this.stage.on("stagemousemove", function(evt) {
            app.mousePos.x = Math.floor(evt.stageX);
            app.mousePos.y = Math.floor(evt.stageY);
            //console.log("Mouse: ( " + app.mouseX + ", " + app.mouseY + " )");
        });
        this.stage.on("stagemousedown", function (evt) {
            app.handleMouseDown(evt);
        });

        // Set up our basic keyboard inputs 
        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;

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
        app.screen.update(dt); // update the current screen

        // Update all of our game objects
        for (var i = 0; i < app.gameObjects.length; i++)
        {
            app.gameObjects[i].update(dt);
        }

        // Particle test code
        for (var i = 0; i < app.particleSystem.length; i++)
        {
            app.particleSystem[i].update(dt);            
        }

        // Update our game to match the state
        if(app.state == "loading")
        {
            // If we're loading, update the screen fillbar
        }
        else if (app.state == "mainmenu")
        {
            //console.log("We're playing");
        }
        else if (app.state == "gameplay")
        {
            //console.log("We're playing");
            if(app.KEYCODE_LEFT.isPressed)
            {
                app.player.addRotation(-app.rotSpeed * dt); 
            }

            if(app.KEYCODE_RIGHT.isPressed)
            {
                app.player.addRotation(app.rotSpeed * dt);
            }

            if(app.KEYCODE_UP.isPressed)
            {
                var posX = app.moveSpeed * dt * math.cos(app.player.getRotationRadians());
                var posY = app.moveSpeed * dt * math.sin(app.player.getRotationRadians());
                app.player.addPosition(posX,posY);
            }

            if(app.KEYCODE_DOWN.isPressed)
            {
                var posX = app.moveSpeed * dt * math.cos(app.player.getRotationRadians());
                var posY = app.moveSpeed * dt * math.sin(app.player.getRotationRadians());
                app.player.addPosition(-posX,-posY);
            }

        }

        // Now that everything is updated, draw our game
        app.draw(dt); 
    },

    // Our game's draw function, which will be run every tick at the FPS we specified
    draw: function (dt)
    {
        //Draw all of our game objects
        for (var i = 0; i < app.gameObjects.length; i++)
        {
            app.gameObjects[i].draw(dt);
        }

        // Draw our game to match the state
        if(app.state == "loading")
        {
            // If we're loading, update the screen fillbar
        }
        else if (app.state == "mainmenu")
        {
            //console.log("We're playing");
        }
        else if (app.state == "gameplay")
        {
            //console.log("We're playing");
        }
    },

    // Given a screen id, change our screen to a new one, set the appropriate game state
    gotoScreen: function(screenType)
    {
        // In most cases, we clear all the children of the current screen 
        switch(screenType)
        {
            case "loading":
            this.screen.removeAllChildren();
            this.screen = new LoadingScreen();
            this.state = "loading";
            break;

            case "mainmenu":
            this.screen.removeAllChildren();
            this.screen = new MainMenu();
            this.state = "mainmenu";
            break;

            case "gameplay":
            this.screen.removeAllChildren();
            this.screen = new GameScreen();
            this.state = "gameplay";
            this.resetGame();
            break;

            default:
            console.log("ERROR: Cannot swap screen, invalid ID");
            break;
        }
    },

    handleKeyDown: function(evt)
    {
        if(!evt){ var evt = window.event; }  //browser compatibility
        
        switch(evt.keyCode) {
            case app.KEYCODE_LEFT.code:     app.KEYCODE_LEFT.isPressed = true; return false;
            case app.KEYCODE_RIGHT.code:    app.KEYCODE_RIGHT.isPressed = true; return false;
            case app.KEYCODE_UP.code:       app.KEYCODE_UP.isPressed = true; return false;
            case app.KEYCODE_DOWN.code:     app.KEYCODE_DOWN.isPressed = true; return false;
            case app.KEYCODE_SPACEBAR.code: app.KEYCODE_SPACEBAR.isPressed = true; return false;
        }
    },
        
    handleKeyUp: function (evt)
    {
        if(!evt) { var evt = window.event; }  //browser compatibility
        
        switch(evt.keyCode) {
            case app.KEYCODE_LEFT.code:     app.KEYCODE_LEFT.isPressed = false; break;
            case app.KEYCODE_RIGHT.code:    app.KEYCODE_RIGHT.isPressed = false; break;
            case app.KEYCODE_UP.code:       app.KEYCODE_UP.isPressed = false; break;
            case app.KEYCODE_DOWN.code:     app.KEYCODE_DOWN.isPressed = false; break;
            case app.KEYCODE_SPACEBAR.code: app.KEYCODE_SPACEBAR.isPressed = false; break;
        }
    },

    // When the mouse is clicked, pass it on to the appropriate places
    handleMouseDown: function(evt)
    {
        // Play a sound
        audio.playSound("click");

        // Create a burst effect
        effects.basicBurst(this.mousePos);

        if(app.state == "gameplay")
        {
            app.numClicks++;

            app.screen.clickUI.text = "NumClicks: " + app.numClicks;
        }
    },

    resetGame: function()
    {
        app.player = new Actor(app.stage, "bitmap", "pig", "player", app.SCREEN_WIDTH / 2, app.SCREEN_HEIGHT /2, 0.5, 0.5);
        app.gameObjects.push(app.player);
        effects.basicImageParticleStream(app.player.position);
    },

}
    