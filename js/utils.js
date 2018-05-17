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