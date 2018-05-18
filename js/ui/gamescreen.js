class GameScreen extends ScreenBase
{
     constructor()
     {
        super();

        // Change the background color
        this.color = '#adff5b';

        // Make a ui entry to track the number of clicks
        this.clickUI = ui.makeText(this, "NumClicks: " + app.numClicks + "/" + app.maxClicks, 15, 25, ui.defaultFont.font, ui.defaultFont.color, "left");

        // Make a set of sound toggles
        ui.makeSoundButtons(this);
     }
}