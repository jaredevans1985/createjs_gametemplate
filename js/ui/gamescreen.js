class GameScreen extends ScreenBase
{
     constructor()
     {
        super();

        // Change the background color
        this.color = '#adff5b';

        // Make a title
        ui.makeText(this, "NumClicks: 0", 100, 25, ui.defaultFont.font, ui.defaultFont.color);
     }
}