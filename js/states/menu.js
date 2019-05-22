var menuState = {

    create: function () {

        this.add.image(this.game.width * 0.1, 10, 'sprites', 'sbLogo')
        this.add.image(this.game.width * 0.1, 60, 'sprites', 'sbGuys')
        
        this.titleMusic = this.add.audio('title-music');
        this.titleMusic.volume = 0.2;
        this.titleMusic.play();
        this.titleMusic.loopFull();

        startText = new MenuFont(this.game.width * 0.5, this.game.height * 0.78, 0.1, Loc.MENU_PUSH_START);
        bottomText = new MenuFont(this.game.width * 0.5, this.game.height * 0.96, 0.6, Loc.MENU_DESCRIPTION);
        player1 = new MenuFont(this.game.width * 0.3, this.game.height * 0.90, 0.6, Loc.MENU_1PLAYER, false);
        player2 = new MenuFont(this.game.width * 0.75, this.game.height * 0.90, 0.6, Loc.MENU_2PLAYER, false);
        selector = new MenuFont(this.game.width * 0.1, this.game.height * 0.90, 0.6, ">", false);

        playerSelection = false;
        playerCount = 1;
        startFlashTimer = game.time.events.loop(Phaser.Timer.SECOND, this.flashText, this);
    },

    update: function () {

        if (playerSelection) {

            if (Keys.LEFT.downDuration(1)) {
                playerCount = 1;
                selector.SetPosition(this.game.width * 0.1, player1.image.y);
            } else if (Keys.RIGHT.downDuration(1)) {
                playerCount = 2;
                selector.SetPosition(this.game.width * 0.50, player1.image.y);
            }
            if (Keys.START.downDuration(1)) {
                this.fadeoutScreen();
            }

        }else{

            if (Keys.START.downDuration(1)) {            
                this.bringPlayerSelection();
                //this.fadeoutScreen();
            }
        }

    },

    startCutscene: function () {      
        this.titleMusic.stop();  
        game.state.start('prologue');        
    },


    flashText: function () {
        startText.SwapVisible();
    },

    bringPlayerSelection: function () {

        playerSelection = true;
        game.time.events.remove(startFlashTimer);
        startText.Show();
        bottomText.Hide();
        selector.Show();
        player1.Show();
        player2.Show();

    },
        
    fadeoutScreen: function(){
        this.camera.fade('#000000', 400);
        this.titleMusic.fadeOut(400);
        this.camera.onFadeComplete.addOnce(this.startCutscene, this);
    }

}