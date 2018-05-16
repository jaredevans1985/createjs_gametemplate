class Actor {
    constructor(parent, type, imageID, name = "actor", x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0)
    {
        // create and parent the image
        
        if(type == "image")
        {
            this._image = new createjs.Bitmap(assets.getResult(imageID));
        }
        else if (type == "sprite")
        {
            this._image = new createjs.Sprite(assets.getResult(imageID));
        }
        parent.addChild(this._image);

        // Set the name
        this._name = name;

        // Set the atributes of the image
        this._image.x = x;
        this._image.y = y;
        this._image.scaleX = scaleX;
        this._image.scaleY = scaleY;
        this._image.rotation = rotation;    // degrees
        this._image.regX = this._image.getBounds().width/2;
        this._image.regY = this._image.getBounds().height/2;
    }

    get image() { return this._image; }
    set image(i) { this._image = i; }

    get name() { return this._name; }
    set name(n) { this._name = n; }

    setPosition(x, y)
    {
        this._image.x = x;
        this._image.y = y;
    }

    addPosition(x, y)
    {
        this._image.x += x;
        this._image.y += y;
    }

    getPosition()
    {
        return { x: this._image.x, y: this._image.y };
    }

    setScale(scaleX, scaleY)
    {
        this._image.scaleX = scaleX;
        this._image.scaleY = scaleY;
    }
    
    setRotation(rotation)
    {
        this._image.rotation = rotation;    // degrees
    }

    getRotation()
    {
        return this._image.rotation;    // degrees
    }
    
    getRotationRadians()
    {
        return this._image.rotation / 360 * 2 * math.PI;    // degrees
    }

    addRotation(rotation)
    {
        this._image.rotation += rotation;    // degrees
    }

    update(dt)
    {

    }

    draw(dt)
    {

    }

}