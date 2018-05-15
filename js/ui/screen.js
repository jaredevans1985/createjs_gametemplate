class ScreenBase extends createjs.Shape
{
     constructor(c, w, h)
     {
        super();    

        var width = w != null ? w : app.SCREEN_WIDTH;
        var height = h != null ? h : app.SCREEN_WIDTH;
        var color = c != null ? c : ui.colors.background;

        // Create a background that new elements are appended to
        this._container = new createjs.Container();
        this._container.setBounds(0, 0, width, height);
        app.stage.addChild(this._container);

        // Create a shape to fill it
        this._fillShape = new createjs.Shape();
        this._fillShape.graphics.beginFill(color).drawRect(0, 0, app.SCREEN_WIDTH, app.SCREEN_HEIGHT);
        this._container.addChild(this._fillShape);
     }

     get container()
     {
         return this._container;
     }

     set container(containerObj)
     {
         this._container = containerObj;
     }

     setColor(color)
     {
        this._fillShape.graphics.beginFill(color);
     }
}