var loadState = {
  preload: function() {
    var loadingLabel = this.add.text(80, 150, "loading...", {
      font: "30px Courier",
      fill: "#ffffff"
    });

    game.load.image("font-menu", "assets/sprites/font-nestype.png");
    game.load.image("font-story", "assets/sprites/font-story.png");
    game.load.atlas(
      "sprites",
      "assets/sprites/sprites.png",
      "assets/sprites/sprites.json"
    );
    game.load.atlas(
      "chars",
      "assets/sprites/chars.png",
      "assets/sprites/chars.json"
    );

    game.load.tilemap(
      "floor1",
      "assets/map/map1.json",
      null,
      Phaser.Tilemap.TILED_JSON
    );
    game.load.image("sbtileset", "assets/map/sbtileset.png");

    game.load.text("loc-txt", "assets/loc/tr.txt");
    game.load.text("keys", "assets/keys/keys.txt");

    game.load.audio("title-music", "assets/sound/title-final.mp3");

    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.scale.setUserScale(3, 3);
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    this.game.renderer.renderSession.roundPixels = true;
  },

  create: function() {
    Loc.GetLangLines(game.cache.getText("loc-txt"));
    Keys.GetKeys(game.cache.getText("keys"));
    game.state.start("menu");
  }
};
