// Define and create a single particle object
function Particle () {
	this.parent = null;
	this.assetList = null;
	this.lifetime = 100;
	this.startingLifetime = 0;
	this.size = 10;
	this.startScale = 1;
	this.endScale = 0;
	this.startColor = new RGBA(255,0,0,255);
	this.endColor = new RGBA(255,0,0,0);
	this.position = { x: 0, y: 0 };
	this.velocity = { x: 0, y: 0 };
	this.emitterRotation = 0;
	this.rotation = 0;
	this.rotationRate = 0;
	this.type = "circle";	// "circle", "square", "bitmap", "sprite"
	this.imageID = "";
	this.animID = "";		// Only used for "sprite" types
	this.gradientFill = false;
	this.particleVisual = null;
	
	this.isDead = function() {
		var isDead = this.lifetime <= 0 || (this.shape != null && this.shape.scale <= 0) ;
		return isDead;
	};
	
	this.update = function(dt) {

		this.lifetime -= 1* dt;

		// Initial setup (only run once)
		if (this.particleVisual == null)
		{
			// If this is a shape, set up the shape
			if(this.type == "circle" || this.type == "square")
			{
				// Make a new shape
				this.particleVisual = new createjs.Shape();
				
				// If we're using our start and end colors for a gradient, do that once here
				if (this.gradientFill)
				{
					if(this.type == "square")
					{
						this.particleVisual.graphics.beginLinearGradientFill([this.startColor.str(), this.endColor.str()], [0, 1], this.size*2, this.size*2, 0, this.size*2, this.size*2, this.size);
					}
					else
					{
						this.particleVisual.graphics.beginRadialGradientFill([this.startColor.str(), this.endColor.str()], [0, 1], this.size*2, this.size*2, 0, this.size*2, this.size*2, this.size);
					}

					if(this.type == "square")
					{
						this.particleVisual.graphics.drawRect(0, 0, this.size, this.size);
					}
					else
					{
						this.particleVisual.graphics.drawCircle(0, 0, this.size / 2);
					}
				}
			}
			// If this isn't a shape, but a bitmap, create it here
			// Note: this.imageID must be valid
			else if (this.type == "bitmap")
			{
				if(this.assetList === null) { console.log("ERROR: Trying to make bitmap particle but no asset list is available"); };
				this.particleVisual = new createjs.Bitmap(this.assetList.getResult(this.imageID));
			}
			// If this isn't a shape or a bitmap, but a sprite from a spritemap, create it here
			// Note: this.imageID must be valid
			else if (this.type == "sprite")
			{
				if(this.assetList === null) { console.log("ERROR: Trying to make sprite particle but no asset list is available"); };
				this.particleVisual = new createjs.Sprite(this.assetList.getResult(this.imageID));

				// Play the specified animation for this sprite
				this.particleVisual.gotoAndPlay(this.animID);
			}

			// Set our bounds and registration point
			if(this.particleVisual.getBounds() == null) // Bitmaps and Sprites already have bounds
			{
				this.particleVisual.setBounds(0, 0, this.size, this.size);
			}

			// Don't do this for spritesheets should have a registration point already
			if(this.type != "sprite")
			{
				this.particleVisual.regX = this.particleVisual.getBounds().width / 2;
				this.particleVisual.regY = this.particleVisual.getBounds().height / 2;
			}

			// Set this up for later lerping!
			this.startingLifetime = this.lifetime;

			// Set the initial alpha
			this.particleVisual.alpha = this.startColor.a;

			// Set up our alpha fade over time using tweens
			createjs.Tween.get(this.particleVisual)
				.to({ alpha: this.endColor.a, useTicks: true }, this.lifetime * 1000);

			this.parent.addChild(this.particleVisual);
		}
		
		// If we don't have a gradient fill, and we're a shape, then we need to clear 
		// and redraw the visual each frame.
		// This is not ideal, so if we didn't have to do this each frame, it'd be better no to.
		if(!this.gradientFill &&  (this.type == "circle" || this.type == "square"))
		{
			this.particleVisual.graphics.clear();
			this.particleVisual.graphics.beginFill(lerpColor(this.endColor, this.startColor, this.lifetime / this.startingLifetime).str());
			
			if(this.type == "square")
			{
				this.particleVisual.graphics.drawRect(0, 0, this.size, this.size);
			}
			else
			{
				this.particleVisual.graphics.drawCircle(0, 0, this.size / 2);
			}
		}

		// Scale over time
		var curScale = lerp(this.endScale, this.startScale, this.lifetime / this.startingLifetime);
		this.particleVisual.scaleX = curScale;
		this.particleVisual.scaleY = curScale;

		// Update our position based on our velocity
		// This will be based on the emitter rotation when this particle was created
		var newPoint = new createjs.Point(this.velocity.x * dt, this.velocity.y * dt);
		var transformMatrix = new createjs.Matrix2D();
		transformMatrix.rotate(this.emitterRotation);
		
		transformMatrix.transformPoint(newPoint.x, newPoint.y, newPoint);
		this.position.x += newPoint.x;
		this.position.y += newPoint.y;
		
		// Update our rotation
		this.rotation += this.rotationRate * dt;

		// Set our position and rotation for the visual component
		this.particleVisual.x = this.position.x;
		this.particleVisual.y = this.position.y;
		this.particleVisual.rotation = this.rotation;
	};
	
	// Remove this object from the stage
	this.dispose = function() {
		this.parent.removeChild(this.particleVisual);
	};
}

// This object is the emitter that contains all of our particles, and is tracked in app.js
function Emitter () {

	// Emitter settings
	this.particles = [];
	this.maxParticleCount = 100;
	this.parent = null;
	this.emitterArray = null;
	this.assetList = null;
	this.relativeTo = null;
	this.emitterRotation = 0;
	this.positionOffsetX = { min: 0, max: 0 };
	this.positionOffsetY = { min: 0, max: 0 };
	this.emitterLifetime = null;
	this.rate = 1;
	this.timeSinceLastSpawn = 0;
	this.burstCount = 0; // NOTE: If this is set, this emitter functions as a burst, and dies when its particles are dead
	this.hasSpawnedAParticle = false;	// Tracks if we've spawn anything yet, used for bursts and spawning the first particle in a stream

	// Particle settings
	this.lifetime = { min: 1, max: 2 };
	this.velocityX = { min: 0, max: 0 };
	this.velocityY = { min: 0, max: 0 };
	this.position = { x: 0, y: 0 };
	this.rotation = { min: 0, max: 0 };
	this.rotationRate = { min: 0, max: 0 };
	this.size = { min: 5, max: 10 }
	this.type = "circle";	// "circle", "square", "bitmap", "sprite"
	this.imageID = "";		// only used if type is "bitmap" or "sprite", must be valid preloaded asset id
	this.animID = "";		// only used if type is "sprite"
	this.gradientFill = false;
	this.startScale = 1;
	this.endScale = 0;

	this.startColor = {
		min: new RGBA(200,80,0,125),
		max: new RGBA(255,160,0,125)
	};
	
	this.endColor = {
		min: new RGBA(220,0,0,0),
		max: new RGBA(255,0,0,0)
	};
	
	// Make a particle based on our settings
	this.spawnParticle = function()
	{
		var p = new Particle();
		p.parent = this.parent;
		p.assetList = this.assetList;
		p.lifetime = rand(this.lifetime.min, this.lifetime.max);
		
		// Set the initial position, taking into account the emitter's rotation for the offset
		var offset = new createjs.Point(rand(this.positionOffsetX.min, this.positionOffsetX.max), rand(this.positionOffsetY.min, this.positionOffsetY.max));
		var rotationMatrix = new createjs.Matrix2D();
		rotationMatrix.rotate(this.emitterRotation);
		rotationMatrix.transformPoint(offset.x, offset.y, offset);
		p.position = { x: this.position.x + offset.x, y: this.position.y + offset.y };
		
		p.emitterRotation = this.emitterRotation;
		p.rotation = this.emitterRotation + rand(this.rotation.min, this.rotation.max);
		p.rotationRate = rand(this.rotationRate.min, this.rotationRate.max);
		p.size = rand(this.size.min, this.size.max);
		p.startScale = this.startScale;
		p.endScale = this.endScale;
		p.velocity = { x: rand(this.velocityX.min, this.velocityX.max),
					y: rand(this.velocityY.min, this.velocityY.max) }
		
		p.startColor = randColor(this.startColor.min, this.startColor.max);
		p.endColor = randColor(this.endColor.min, this.endColor.max);
		
		p.type = this.type;
		p.imageID = this.imageID;
		p.animID = this.animID;
		p.gradientFill = this.gradientFill;

		this.particles.push(p);
	}

	// This is the update function for our emitter
	this.update = function(dt) {

		// If we have an object to be relative to, update our position and rotation based on that
		if(this.relativeTo !== null)
		{
			// Update our position (if it exists)
			if(this.relativeTo.position !== null && this.relativeTo.position !== undefined )
			{
				this.position.x = this.relativeTo.position.x !== null ? this.relativeTo.position.x : this.position.x;
				this.position.y = this.relativeTo.position.y !== null ? this.relativeTo.position.y : this.position.y;
			}
			else if (this.relativeTo.pos !== null && this.relativeTo.pos !== undefined )
			{
				this.position.x = this.relativeTo.pos.x !== null ? this.relativeTo.pos.x : this.position.x;
				this.position.y = this.relativeTo.pos.y !== null ? this.relativeTo.pos.y : this.position.y;
			}
			else
			{
				console.log("WARNING: A particle emitter with a relativeTo object cannot find a position: {x:0, y:0} or a pos: {x:0, y:0} property on the relativeTo object.");
			}
			
			// Update our rotation (if it exists)
			if(this.relativeTo.rotation !== null && this.relativeTo.rotation !== undefined )
			{
				this.emitterRotation = this.relativeTo.rotation;
			}
			else
			{
				console.log("WARNING: A particle emitter with a relativeTo object cannot find a rotation property on that object.");
			}
		}

		// Update each of our particles, and clean them up if they're dead
		for (var i = this.particles.length - 1; i >= 0; i-- )
		{
			if (this.particles[i].isDead()) {
				this.particles[i].dispose();
				this.particles.splice(i,1);
			} else {
				this.particles[i].update(dt);
			}
		}

		
		// How long since the last particle was spawned
		this.timeSinceLastSpawn += 1 * dt;

		// Only run this logic if we're a burst
		if(this.burstCount > 0)
		{
			// Only run this 
			if (this.particles.length <= 0 && !this.hasSpawnedAParticle)
			{
				this.hasSpawnedAParticle = true;
				for (var i = 0; i < this.burstCount; i++)
				{
					this.spawnParticle();
				}
			}
		}
		// Spawn particles to match our rate, but don't go over our limit
		else if(this.particles.length < this.maxParticleCount && this.timeSinceLastSpawn >= 1 / this.rate)
		{
			this.timeSinceLastSpawn = 0;

			this.spawnParticle();
		}
		// If we're here, create the first particle for our stream
		// Otherwise the stream wouldn't spawn a particle right away
		else if (!this.hasSpawnedAParticle)
		{
			this.hasSpawnedAParticle = true;

			this.spawnParticle();
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

		// Check to see if this is a burst emitter whose particles are all dead
		else if(this.burstCount > 0 && this.particles.length <= 0)
		{
			this.kill();
		}
	};

	// When called, this function kills all of the particles for this emitter, and then destroys the emitter
	this.kill = function()
	{
		// Clear up all of the particles
		for (var i = this.particles.length - 1; i >= 0; i-- )
		{
			this.particles[i].dispose();
			this.particles.splice(i,1);
		}

		if(this.emitterArray !== null)
		{
			var myIndex = this.emitterArray.indexOf(this);
			this.emitterArray.splice(myIndex, 1);
		}
		else
		{
			console.log("ERROR: Cannot delete emitter because emitterArray is not set");
		}
	};

	// When this is called, keep the emitter around until all its current particles are dead
	this.killWhenCurrentParticlesDie = function()
	{
		// Basically we're turning this emitter into a burst emitter
		// This keeps the particles around until the emitter goes away
		this.burstCount = this.particles.length;
	};
}

// Give us a random number between a minimum and maximum
// TODO: Put this in a utils file or something
function rand(min, max) {
	return (Math.floor(Math.random() * (max*1000 - min*1000 + 1)) + min*1000)/1000;
}

// Give us a random RGBA color between a min and max RGBA color
function randColor (min, max) {
	return new RGBA(
		rand(min.r, max.r),
		rand(min.g, max.g),
		rand(min.b, max.b),
		rand(min.a, max.a)
	);
}

// Lerp between two colors
function lerpColor(colorA, colorB, value)
{
	// Interpolate between all of the values
	var r = lerp(colorA.r, colorB.r, value);
	var g = lerp(colorA.g, colorB.g, value);
	var b = lerp(colorA.b, colorB.b, value);
	var a = lerp(colorA.a, colorB.a, value);

	// Return our new color
	return new RGBA(r, g, b, a);
}

function lerp(valA, valB, value)
{
	// Clamp the value
	value = value > 1 ? 1 : value;
	value = value < 0 ? 0 : value;
	return valA * (1 - value) + valB * value;
}

// Return a color defined in RGBA format
function RGBA (r,g,b,a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
	this.str = function() {
		return "rgba("+Math.round(this.r)+","+Math.round(this.g)+","+Math.round(this.b)+","+Math.round(this.a)+")";
	};
}