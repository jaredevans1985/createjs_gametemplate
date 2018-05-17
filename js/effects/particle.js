// Define and create a single particle object
function Particle () {
	this.lifetime = 100;
	this.startingLifetime
	this.size = 10;
	this.endScale = {x : 1, y : 1};
	this.startColor = new RGBA(255,0,0,255);
	this.endColor = new RGBA(255,0,0,0);
	this.position = { x: 0, y: 0 };
	this.velocity = { x: 0, y: 0 };
	this.type = "circle";	// "circle", "square"
	this.gradientFill = false;
	this.shape = null;
	
	this.isDead = function() {
		var isDead = this.lifetime <= 0 || (this.shape != null && this.shape.scale <= 0) ;
		return isDead;
	};
	
	this.update = function(dt) {

		this.lifetime -= 1* dt;

		// initial setup
		if (this.shape == null) {
			this.shape = new createjs.Shape();
			this.shape.setBounds(0, 0, this.size, this.size);

			// Set this up for later lerping!
			this.startingLifetime = this.lifetime;

			// If we're using our start and end colors for a gradient, do that once here
			if (this.gradientFill)
			{
				if(this.type == "square")
				{
					this.shape.graphics.beginLinearGradientFill([this.startColor.str(), this.endColor.str()], [0, 1], this.size*2, this.size*2, 0, this.size*2, this.size*2, this.size);
				}
				else
				{
					this.shape.graphics.beginRadialGradientFill([this.startColor.str(), this.endColor.str()], [0, 1], this.size*2, this.size*2, 0, this.size*2, this.size*2, this.size);
				}

				if(this.type == "square")
				{
					this.shape.graphics.drawRect(0, 0, this.size, this.size);
				}
				else
				{
					this.shape.graphics.drawCircle(0, 0, this.size / 2);
				}
			}

			// Set up any alpha fade and scaling over time
			createjs.Tween.get(this.shape)
				.to({ alpha: this.startColor.a, useTicks: true });

			createjs.Tween.get(this.shape)
				.to({ alpha: this.endColor.a, useTicks: true }, this.lifetime * 1000);

			app.stage.addChild(this.shape);
		}
		
		
		// If we don't have a gradient fill, then we need to clear and redraw the shape each frame
		// This is not ideal, so if we didn't have to do this each frame, it'd be better
		if(!this.gradientFill)
		{
			this.shape.graphics.clear();
			this.shape.graphics.beginFill(lerpColor(this.endColor, this.startColor, this.lifetime / this.startingLifetime).str());
			if(this.type == "square")
			{
				this.shape.graphics.drawRect(this.size*2, this.size*2, this.size, this.size);
			}
			else
			{
				this.shape.graphics.drawCircle(this.size*2, this.size*2, this.size);
			}
		}

		// Scale over time
		var curScale = lerp(0, 1, this.lifetime / this.startingLifetime);
		this.shape.scaleX = curScale;
		this.shape.scaleY = curScale;

		// Adjust for scaling to be centered
		this.shape.x = this.position.x + ((1 - curScale) * this.shape.getBounds().width * 2);
		this.shape.y = this.position.y + ((1 - curScale) * this.shape.getBounds().height * 2);
		
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
	this.rate = 1;
	this.timeSinceLastSpawn = 0;
	
	// Particle settings
	this.lifetime = { min: 10, max: 50 };
	this.velocityX = { min: 0, max: 0 };
	this.velocityY = { min: 0, max: 0 };
	this.position = { x: 0, y: 0 };
	this.size = { min: 5, max: 10 }
	this.type = "circle";
	this.gradientFill = false;
	this.endScale = {x : 0, y : 0};

	this.startColor = {
		min: new RGBA(200,80,0,125),
		max: new RGBA(255,160,0,125)
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
		
		// Spawn particles to match our rate, but don't go over our limit
		this.timeSinceLastSpawn += 1 * dt;
		if(this.particles.length < this.count && this.timeSinceLastSpawn >= 1 / this.rate)
		{
			this.timeSinceLastSpawn = 0;

			var p = new Particle();
			p.lifetime = rand(this.lifetime.min, this.lifetime.max);
			p.position = { x: this.position.x + rand(this.positionOffsetX.min, this.positionOffsetX.max),
						y: this.position.y + rand(this.positionOffsetY.min, this.positionOffsetY.max) };
			p.size = rand(this.size.min, this.size.max);
			p.endScale = this.endScale;
			p.velocity = { x: rand(this.velocityX.min, this.velocityX.max),
						y: rand(this.velocityY.min, this.velocityY.max) }
			
			p.startColor = randColor(this.startColor.min, this.startColor.max);
			p.endColor = randColor(this.endColor.min, this.endColor.max);
			
			p.type = this.type;
			p.gradientFill = this.gradientFill;

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
		app.particleSystem.push( new Emitter(app.particleSystem.length) );
		var newEmitter = app.particleSystem[app.particleSystem.length-1];

		// Define the settings for this emitter
		//newEmitter.emitterLifetime = 5;
		newEmitter.lifetime = { min: 1, max: 2 };
		//newEmitter.gradientFill = true;
		//newEmitter.type = "square";
        newEmitter.position = app.mousePos;
        newEmitter.positionOffsetX = { min: -3, max: 3 };
        newEmitter.positionOffsetY = { min: -3, max: 3 };
        newEmitter.velocityY = { min: -100, max: 100 };
        newEmitter.velocityX = { min: -100, max: 100 };
        newEmitter.radius = { min: 30, max: 45 };
        newEmitter.rate = 10;
        newEmitter.startColor = {
            min: new RGBA(230,50,0,255),
            max: new RGBA(255,230,0,255)
        };
        
        newEmitter.endColor = {
            min: new RGBA(255,255,255,0),
            max: new RGBA(255,255,255,0)
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