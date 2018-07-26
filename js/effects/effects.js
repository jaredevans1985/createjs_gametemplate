// Steps for using particle effects
// -----------------------------------
// 1) 	You MUST have an array in an app object that will hold references to your emitters
//		See the getNewEmitter and clearAllParticles functions below for an example.
//		By default, they look for an app.particleEmitters array
// 2)	In your main update call, you must loop through this array and update the emitters.
//		For example:
//		for (var i = 0; i < app.particleEmitters.length; i++)
//		{
//			app.particleEmitters[i].update(dt);            
//		}
// 3)	In getNewEmitter, make sure that your default parent, emitterArray, and assetList are all correct.
// 4)	Look at the example functions below, both the commented out reference and the usable function
//		Find one you like or make your own.
//		Then, whenever you want to create an effect, simply call the function that builds it.
//		For example, effects.basicBurst({ x: 100, y: 100}); would make a burst effect at 100, 100

// This effects object contains functions to build all of our effects as needed
var effects = {
	// Add a new emitter to the particle system and return the new object
	// This is used by the example functions below when they're creating new particle systems
	getNewEmitter: function()
	{
		var newEmitter = new Emitter();
		newEmitter.parent = app.stage;	// Setting a default parent
		newEmitter.emitterArray = app.particleEmitters;	// What array will hold a reference to this emitter
		newEmitter.assetList = assets;	// What object holds the loaded results from PreloadJS
		app.particleEmitters.push( newEmitter );
		return newEmitter;
	},

	// Clear all particles from the particle system
	// Useful when you are changing screens or modes and need to get rid of all particles
	clearAllParticles: function()
	{
		app.particleEmitters.forEach(emitter => {
			emitter.kill();
		});
	},

	/* Example emitter creator functions
	// --------------
	//
	// Feel free to copy and uncomment this example function to create your own
	//
	// To use it, simply call the function from anywhere,
	// and a new emitter will be added to the app particle system.
	//
	//exampleEmitter: function(position)	// You can add more arguments. Position can be an object reference for tracking
	//{
	//	// Get a new emitter
	//	var newEmitter = this.getNewEmitter();
	//
	//	// Define the settings for this emitter and its particles
	//	// Note that almost all of these settings have defaults,
	//	// so omit the ones you don't need.
	//
	//	// Emitter settings	
	// 	this.maxParticleCount = 100;	// Maximum number of particles allowed in the system, default is 100
	// 	this.position = { x: 0, y: 0 };	// Where this emitter is, used as origin for particles
	// 	this.positionOffsetX = { min: 0, max: 0 };	// a range for how far from the emitter origin a particle can spawn
	// 	this.positionOffsetY = { min: 0, max: 0 };	// a range for how far from the emitter origin a particle can spawn
	//	this.emitterRotation = 0;	// The rotation of this emitter, applied to particles spawned from it
	// 	this.emitterLifetime = null;	// If this is set to a value, how many seconds should this emitter exist
	// 	this.rate = 1;	// The rate at which this emitter spawns particles
	//	this.parent	= <a createjs object with the addChild method> // Common examples are the createjs stage or a container
	// 	this.emitterArray = null;	// What array contains holds a reference to this emitter
	//	this.assetList = null;	// The stored asset list created by PreloadJS
	//							// If this is not set you cannot use bitmap or sprite particles
	//	this.burstCount = 0; 	// NOTE: If this is set, this emitter functions as a burst,
	// 							// spawning the number of particles in burst count at once,
	// 							// and dies when all of its particles are dead. It will not
	// 							// have the standard before of other emitters
	//	this.relativeTo = null;		// You can see this to a javascript object
	//								// If the object has a position: {x: 0, y: 0} object, the emitter will stay relative to that
	//								// If the object has a rotation: 0 property, partilces will spawn and move relative to the emitter's rotation
	//
	// 	// Particle settings
	// 	this.lifetime = { min: 1, max: 2 };		// a range of how long in seconds a particle can exist
	// 	this.velocityX = { min: 0, max: 0 };	// a range for x velocity assigned randomly on creation
	// 	this.velocityY = { min: 0, max: 0 };	// a range for y velocity assigned randomly on creation		
	//	this.rotation = { min: 0, max: 0 };		// a range for initial rotation (degrees)
	//	this.rotationRate = { min: 0, max: 0 };	// a range for the rate of rotation each frame (degrees)
	// 	this.size = { min: 5, max: 10 };		// a range of how big this particle can be (does not apply to sprites)
	// 	this.type = "circle";	// What kind of particle is it? "circle", "square", "bitmap", "sprite"
	//	this.imageID = "";		// Only used if type is "bitmap" or "sprite", used to get the image result from assets
	//	this.animID = "";		// Only used if type is "sprite"
	// 	this.gradientFill = false;	// If true, will use the start and end colors to create a gradient
	// 	this.startScale = 1;	// What scale these particles start at (1 = 100%)
	// 	this.endScale = 0;	// What scale these particles will interpolate to over their lifetime (1 = 100%)
	//
	// 	// A range of colors that this particle will start with
	// 	this.startColor = {
	// 		min: new RGBA(200,80,0,125),
	// 		max: new RGBA(255,160,0,125)
	// 	};
	//	
	// 	// A range of colors that this particle will end with
	// 	this.endColor = {
	// 		min: new RGBA(220,0,0,0),
	// 		max: new RGBA(255,0,0,0)
	// 	};
	//
	// },
	*/

	// This is a basic emitter that constantly creates particles at a given rate
	basicStream: function(position)
	{
		// Get a new emitter
		var newEmitter = this.getNewEmitter();

		// Define the settings for this emitter
		newEmitter.lifetime = { min: 1, max: 2 };
        newEmitter.position = position;
        newEmitter.positionOffsetX = { min: -3, max: 3 };
        newEmitter.positionOffsetY = { min: -3, max: 3 };
        newEmitter.velocityY = { min: -100, max: 100 };
        newEmitter.velocityX = { min: -100, max: 100 };
        newEmitter.size = { min: 10, max: 15 };
		newEmitter.rate = 10;

        newEmitter.startColor = {
            min: new RGBA(230,50,0,255),
            max: new RGBA(255,230,0,255)
        };
        
        newEmitter.endColor = {
            min: new RGBA(255,255,255,0),
            max: new RGBA(255,255,255,0)
		};
		
		return newEmitter;
	},

	// A basic burst that creates a given number of particles all at once and dies when those particles do
	basicBurst: function(position)
	{
		// Find where our new emitter should go and create it
		var newEmitter = this.getNewEmitter();

		// Define the settings for this emitter
		// Because we define a burstCount for this emitter, it will function as a burst
		// The emitter will automatically kill itself after its particles are dead
		newEmitter.burstCount = 15;
		newEmitter.lifetime = { min: 1, max: 2 };
		newEmitter.type = "square";
        newEmitter.position = position;
        newEmitter.positionOffsetX = { min: -3, max: 3 };
        newEmitter.positionOffsetY = { min: -3, max: 3 };
        newEmitter.velocityY = { min: -100, max: 100 };
        newEmitter.velocityX = { min: -100, max: 100 };
		newEmitter.size = { min: 10, max: 15 };
		newEmitter.emitterRotation = 45;
		newEmitter.rotation = { min: 0, max: 360 };
		newEmitter.rotationRate = { min: 90, max: 180 };
		newEmitter.endScale = 0.75;

        newEmitter.startColor = {
            min: new RGBA(0,50,230,255),
            max: new RGBA(0,230,255,255)
        };
        
        newEmitter.endColor = {
            min: new RGBA(255,255,255,0),
            max: new RGBA(255,255,255,0)
		};
		
		return newEmitter;
	},

	// A basic image particle stream that uses a preloaded bitmap image instead of a shape
	basicImageStream: function(position, type, imageID, animID = "none")
	{
		// Get a new emitter
		var newEmitter = this.getNewEmitter();

		// Define the settings for this emitter
		// This particle uses an image
		// The type must be set to either "bitmap" or "sprite"
		// You must then provide a valid asset ID
		newEmitter.type = type;
		newEmitter.imageID = imageID;
		newEmitter.animID = animID;
		newEmitter.lifetime = { min: 2, max: 3 };
        newEmitter.position = position;
        newEmitter.positionOffsetX = { min: -3, max: 3 };
        newEmitter.positionOffsetY = { min: -3, max: 3 };
        newEmitter.velocityY = { min: -50, max: 50 };
        newEmitter.velocityX = { min: -50, max: 50 };
        newEmitter.radius = { min: 30, max: 45 };
		newEmitter.rate = 10;
		newEmitter.rotation = { min: 0, max: 360 };
		newEmitter.rotationRate = { min: 90, max: 180 };
		newEmitter.startScale = 0.6;

		// Note: even though we don't need a color, the alpha value is used to fade the image
		newEmitter.startColor = {
            min: new RGBA(255,255,255,0.5),
            max: new RGBA(255,255,255,0.5)
		};
		
        newEmitter.endColor = {
            min: new RGBA(255,255,255,0),
            max: new RGBA(255,255,255,0)
		};
		
		return newEmitter;
	},

	// An image particle stream that follows stays relative to an objects rotation and position
	basicRelativeImageStream: function(relativeObject, type, imageID, animID = "none")
	{
		// Get a new emitter
		var newEmitter = this.getNewEmitter();

		// Define the settings for this emitter
		// This particle uses an image
		// The type must be set to either "bitmap" or "sprite"
		// You must then provide a valid asset ID
		newEmitter.type = type;
		newEmitter.imageID = imageID;
		newEmitter.animID = animID;
		newEmitter.relativeTo = relativeObject;
		newEmitter.lifetime = { min: 1, max: 2 };
        newEmitter.positionOffsetX = { min: -55, max: -50 };
        newEmitter.velocityX = { min: -100, max: -75 };
        newEmitter.radius = { min: 30, max: 45 };
		newEmitter.rate = 5;
		newEmitter.rotation = { min: 0, max: 360 };
		newEmitter.rotationRate = { min: 90, max: 180 };
		newEmitter.startScale = 0.75;
		newEmitter.endScale = 0;
		
		// Note: even though we don't need a color, the alpha value is used to fade the image
		newEmitter.startColor = {
            min: new RGBA(255,255,255,0.5),
            max: new RGBA(255,255,255,0.5)
		};
		
        newEmitter.endColor = {
            min: new RGBA(255,255,255,0),
            max: new RGBA(255,255,255,0)
		};
		
		return newEmitter;
	},

};