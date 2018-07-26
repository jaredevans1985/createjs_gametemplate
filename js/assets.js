// This object manages our game assets and provides other functionality, such as preloading
var assets = {

    // This variable will store all of the results of our load, and can be queried later
    queue: null,

    // track our load progress to be used as needed
    loadPercentage : 0,

    // This is called from app.js and starts the load
    preloadAssets()
    {
        // Create our manifest of files to load
        // PreloadJS will try to automatically parse what kind of file we're loading 
        // We can consider making a seperate JSON file that has all of this info in it
        manifest = [
			{
                src: "../js/audio.js",
            },
			{
                src: "../js/utils.js",
            },
			{
                src: "../js/ui/screen.js",
            },
			{
                src: "../js/ui/mainmenu.js",
            },
			{
                src: "../js/ui/helpscreen.js",
            },
			{
                src: "../js/ui/gamescreen.js",
            },
			{
                src: "../js/ui/endscreen.js",
            },
			{
                src: "../js/ui/ui.js",
            },
			{
                src: "../js/effects/effects.js",
            },
            {
                src: "../js/effects/particle.js",
            },
			{
                src: "../js/gameobjects/actor.js",
            },
            {
                src: "../media/audio/click.mp3",
                id: "click"
            },
            {
                src: "../media/images/particle.png",
                id: "particle"
            },
            {
                src: "../media/images/pigsheet.json",
                id:"pig",
                type:"spritesheet",
                crossOrigin:true
            },
            {
                src: "../media/images/ui/soundbuttons.json",
                id:"soundui",
                type:"spritesheet",
                crossOrigin:true
            },
            {
                src: "../media/audio/music.mp3",
                id: "music"
            },
        ];

        // Set the root filepath for our assets
        this.queue = new createjs.LoadQueue(true);
    
        // Use the following to use 'mp3' if 'ogg' doesn't work on browser
        createjs.Sound.alternateExtensions = ["mp3"];

        // Be sure to install the createjs sound plugin or your sounds won't play
        this.queue.installPlugin(createjs.Sound);
        
        // Set some callbacks
        this.queue.on("progress", this.loadProgress, this);
        this.queue.on("fileload", this.fileLoaded, this);
        this.queue.on("complete", this.loadComplete, this);
        this.queue.loadManifest(manifest);
    },

    // When loading is finished, call this function
    loadComplete(event)
    {
        // Do something when loading is complete, for instance, switch the game state
        app.gotoScreen("mainmenu");

        // Start the music
        audio.toggleMusic(true);
    },

    // When an individual file is loaded, call this function
    fileLoaded(event)
    {
        // event.result is the final object that was created after loading 
        //console.log(event.result);   
    },

    // Updates us on the progress of a load
    loadProgress(event)
    {
        // event.loaded gives us the percentage of our load
        assets.loadPercentage = event.loaded / event.total;
    },

    // Return a result from queue (will return 'null' if no result was found with that ID)
    getResult(id)
    {
       var result = this.queue.getResult(id);  
       //console.log(result);
       return result;
    },

};

// This is here so that it's available while we're loading. Not ideal, I know
class LoadingScreen extends createjs.Container
{
     constructor()
     {
		super();
		 
		// Set my bounds and add me to the stage
        this.setBounds(0, 0, 800, 600);
        app.stage.addChild(this); 
		
		// Create a background shape
		this.fillShape = new createjs.Shape();
        this.fillShape.graphics.beginFill('#fff291').drawRect(0, 0, 800, 600);
        this.addChild(this.fillShape);
		
        //Create a text object
		var newText = new createjs.Text("LOADING", "40px Titan One", '#362868');
        newText.x = app.SCREEN_WIDTH /2; //positions the text
        newText.y = app.SCREEN_HEIGHT /2 - 50;
        newText.textAlign = "center";
        newText.textBaseline = "middle";
        this.addChild(newText);  //adds the text object to the stage

        // Add a fillbar
        var fillbarBack = new createjs.Shape();
        fillbarBack.graphics.beginFill('#362868').drawRect(app.SCREEN_WIDTH /2 - 105, app.SCREEN_HEIGHT /2 + 20, 210, 50);
        this.addChild(fillbarBack);

        this.fillbar = new createjs.Shape();
        this.fillbar.graphics.beginFill('#dad1f9').drawRect(app.SCREEN_WIDTH /2 - 100, app.SCREEN_HEIGHT /2 + 25, 0, 40);
        this.addChild(this.fillbar);

        // Add Percentage Text
		this.percentText = new createjs.Text("0%", "26px Titan One", '#362868');
        this.percentText.x = app.SCREEN_WIDTH / 2 + 5; //positions the text
        this.percentText.y = app.SCREEN_HEIGHT / 2 + 45;
        this.percentText.textAlign = "center";
        this.percentText.textBaseline = "middle";
        this.addChild(this.percentText);  //adds the text object to the stage
     }

     updateFillbar(percent)
     {
        this.fillbar.graphics.beginFill('#dad1f9').drawRect(app.SCREEN_WIDTH /2 - 100, app.SCREEN_HEIGHT /2 + 25, 200 * percent, 40);
        var nicePercent = (assets.loadPercentage * 100) | 0;
        this.percentText.text = nicePercent + "%";
    }

     update(dt)
     {
         this.updateFillbar(assets.loadPercentage);
     }
};
    