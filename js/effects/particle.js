// Define and create a single particle object
function Particle () {
	this.lifetime = 100;
	this.radius = 10;
	this.startColor = new RGBA(255,0,0,255);
	this.endColor = new RGBA(255,0,0,0);
	this.position = { x: 0, y: 0 };
	this.velocity = { x: 0, y: 0 };
	this.shape = null;
	
	this.isDead = function() {
		return this.lifetime < 1 || (this.shape != null && this.shape.scale >= 0);
	};
	
	this.update = function(dt) {
		this.lifetime -= 1* dt;
		
		if (this.shape == null) {
			this.shape = new createjs.Shape();
			this.shape.graphics.beginRadialGradientFill([this.startColor.str(), this.endColor.str()], [0, 1], this.radius*2, this.radius*2, 0, this.radius*2, this.radius*2, this.radius);
			this.shape.graphics.drawCircle(this.radius*2, this.radius*2, this.radius);
			
			createjs.Tween.get(this.shape)
				.wait(this.lifetime*.7)
				.to({ alpha: 0.5, useTicks: true }, this.lifetime);

			createjs.Tween.get(this.shape)
				.wait(this.lifetime*.5)
				.to({ scaleX: 0, useTicks: true }, this.lifetime);

			createjs.Tween.get(this.shape)
				.wait(this.lifetime*.5)
				.to({ scaleY: 0, useTicks: true }, this.lifetime);
			
			app.stage.addChild(this.shape);
		}
		
		this.shape.x = this.position.x;
		this.shape.y = this.position.y;
		
		this.position.x += this.velocity.x * dt;
		this.position.y += this.velocity.y * dt;
	};
	
	this.dispose = function() {
		app.stage.removeChild(this.shape);
	};
}

// This object is the emitter that contains all of our particles, and is tracked in app.js
function Emitter (index) {
	
	// What is my index in our particle system?
	this.particleSystemIndex = index;

	// Emitter settings
	this.particles = [];
	this.count = 100;
	this.positionOffsetX = { min: 0, max: 0 };
	this.positionOffsetY = { min: 0, max: 0 };
	this.emitterLifetime = null;
	
	// Particle settings
	this.lifetime = { min: 10, max: 50 };
	this.velocityX = { min: 0, max: 0 };
	this.velocityY = { min: 0, max: 0 };
	this.position = { x: 0, y: 0 };
	this.radius = { min: 5, max: 10 }
	
	this.startColor = {
		min: new RGBA(200,80,0,255),
		max: new RGBA(255,160,0,255)
	};
	
	this.endColor = {
		min: new RGBA(220,0,0,0),
		max: new RGBA(255,0,0,0)
	};
	
	this.update = function(dt) {
		
		// Update each of our particles, and clean them up if they're dead
		this.particles.forEach(function(p,i,array) {
			if (p.isDead()) {
				p.dispose();
				array.splice(i,1);
			} else {
				p.update(dt);
			}
		});
		
		// If our particle count is less than our max, make more
		if(this.particles.length < this.count) {
			var p = new Particle();
			p.lifetime = rand(this.lifetime.min, this.lifetime.max);
			p.position = { x: this.position.x + rand(this.positionOffsetX.min, this.positionOffsetX.max),
						y: this.position.y + rand(this.positionOffsetY.min, this.positionOffsetY.max) };
			p.radius = rand(this.radius.min, this.radius.max);
			p.velocity = { x: rand(this.velocityX.min, this.velocityX.max),
						y: rand(this.velocityY.min, this.velocityY.max) }
			
			p.startColor = randColor(this.startColor.min, this.startColor.max);
			p.endColor = randColor(this.endColor.min, this.endColor.max);
			
			this.particles.push(p);
		}

		// Check to see if this emitter is dead
		if (this.emitterLifetime)
		{
			this.emitterLifetime -= 1 * dt;
			if(this.emitterLifetime <= 0 )
			{
				this.kill();
			}
		}
	};

	this.kill = function()
	{
		this.particles.forEach(function(p,i,array) {
			p.dispose();
			array.splice(i,1);
		});

		app.particleSystem.splice(this.particleSystemIndex, 1);
	}
}

// This effects object contains functions to build all of our effects as needed
var effects = {

	basicTrail: function(position)
	{
		// Find where our new emitter should go and create it
		app.particleSystem[app.particleSystem.length] = new Emitter(app.particleSystem.length);
		var newEmitter = app.particleSystem[app.particleSystem.length-1];

		// Define the settings for this emitter
		//newEmitter.emitterLifetime = 5;
        newEmitter.lifetime = { min: 350, max: 600 };
        newEmitter.position = app.mousePos;
        newEmitter.positionOffsetX = { min: -3, max: 3 };
        newEmitter.positionOffsetY = { min: -3, max: 3 };
        newEmitter.velocityY = { min: -2, max: 2 };
        newEmitter.velocityX = { min: -2, max: 2 };
        newEmitter.radius = { min: 7, max: 12 };
        newEmitter.count = 500;
        newEmitter.startColor = {
            min: new RGBA(230,50,0,255),
            max: new RGBA(255,230,0,255)
        };
        
        newEmitter.endColor = {
            min: new RGBA(255,0,0,0),
            max: new RGBA(255,0,0,0)
        };
	},

};


// app.ps = new ParticleSystem();
// app.ps.lifetime = { min: 350, max: 600 };
// app.ps.position = { x: app.SCREEN_WIDTH / 2, y: 50 };
// app.ps.positionOffsetX = { min: -3, max: 3 };
// app.ps.positionOffsetY = { min: -3, max: 3 };
// app.ps.velocityY = { min: -2, max: 2 };
// app.ps.velocityX = { min: -2, max: 2 };
// app.ps.radius = { min: 7, max: 12 };
// app.ps.count = 500;
// app.ps.startColor = {
//     min: new RGBA(230,50,0,255),
//     max: new RGBA(255,230,0,255)
// };

// app.ps.endColor = {
//     min: new RGBA(255,0,0,0),
//     max: new RGBA(255,0,0,0)
// };

// Particle test code
        //app.ps.position = { x: app.stage.mouseX, y: app.stage.mouseY }; 
        //app.ps.update(app.stage);