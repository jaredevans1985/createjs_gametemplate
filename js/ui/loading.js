class LoadingScreen extends ScreenBase
{
     constructor()
     {
        super();

        //Create a text object
        ui.makeText(this, "LOADING", app.SCREEN_WIDTH /2, app.SCREEN_HEIGHT /2 - 50, ui.titleFont.font, ui.titleFont.color);

        // Add a fillbar
        var fillbarBack = new createjs.Shape();
        fillbarBack.graphics.beginFill(ui.colors.dark).drawRect(app.SCREEN_WIDTH /2 - 105, app.SCREEN_HEIGHT /2 + 20, 210, 50);
        this.addChild(fillbarBack);

        this.fillbar = new createjs.Shape();
        this.fillbar.graphics.beginFill(ui.colors.light).drawRect(app.SCREEN_WIDTH /2 - 100, app.SCREEN_HEIGHT /2 + 25, 0, 40);
        this.addChild(this.fillbar);
     }

     updateFillbar(percent)
     {
        this.fillbar.graphics.beginFill(ui.colors.light).drawRect(app.SCREEN_WIDTH /2 - 100, app.SCREEN_HEIGHT /2 + 25, 200 * percent, 40);
     }

     update(dt)
     {
         this.updateFillbar(assets.loadPercentage);
     }
};