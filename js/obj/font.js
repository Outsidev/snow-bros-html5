MenuFont = function(x, y, color, text="", visible=true) {
    
    this.font = game.add.retroFont('font-menu', 8, 8, Phaser.RetroFont.TEXT_SET2);
    this.font.multiLine = true;
    this.font.align = Phaser.RetroFont.ALIGN_CENTER;
    this.font.text = text;

    this.bitmapD = game.make.bitmapData()
    this.bitmapD.load(this.font)       
    this.bitmapD.setHSL(color);

    this.image = game.add.image(x, y, this.bitmapD);
    this.image.anchor.x = 0.5;
    this.image.anchor.y = 1;
    this.image.visible = visible;    

}

MenuFont.prototype.SetText = function (text, color = 0.1) {
    this.font.text = text;
    this.bitmapD.load(this.font)
    this.bitmapD.update();
    this.bitmapD.setHSL(color);
}

MenuFont.prototype.SetPosition = function(x, y){
    this.image.x = x;
    this.image.y = y;   
}

MenuFont.prototype.Hide = function () {
    this.image.visible = false;
}

MenuFont.prototype.Show = function () {
    this.image.visible = true;
}

MenuFont.prototype.SwapVisible = function () {
    this.image.visible = !this.image.visible;
}

TEXT_SET_CUSTOM = "'.!?1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
StoryFont = function(x,y, color, text, fontDict = TEXT_SET_CUSTOM){
    this.font = game.add.retroFont('font-story', 8, 7, fontDict);
    this.font.customSpacingX = 1;
    this.font.customSpacingY = 8;
    this.font.multiLine = true;
    this.font.align = Phaser.RetroFont.LEFT;
    this.font.text = text;

    this.image = game.add.image(x, y, this.font);
    this.image.tint = color;
}

StoryFont.prototype.SetText = function(text){
    this.font.text = text;
}

StoryFont.prototype.SetPosition = function(x, y){
    this.image.x = x;
    this.image.y = y;
}