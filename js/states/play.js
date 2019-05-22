var playState = {

    create: function(){
        console.log("play on");
        game.physics.startSystem(Phaser.Physics.ARCADE);
        state = this;
        
        floor1 = game.add.tilemap('floor1');
        floor1.addTilesetImage('sbtileset'); 

        backgroundLayer = floor1.createLayer('Tile Layer 1');
        collisionLayer = floor1.createLayer('Collision Layer');
        backgroundLayer.resizeWorld();

        floor1.setCollisionBetween(1, 200, true, 'Collision Layer');
        for(var i=0; i<floor1.height; i++){
            for(var j=0; j<floor1.width; j++){
                var tile = floor1.getTile(i, j, 'Collision Layer');
                if(tile!=null){
                    tile.collideDown = false;
                    tile.collideLeft = false;
                    tile.collideRight = false;
                }
            }
        }
        
        game.physics.arcade.gravity.y = 400;
        snowBro = new SnowBro(game, 17, 25);
        redGuyGroup = this.add.group();
        for(var i=0; i<1; i++){
            redGuy = new Redguy(game, 100, 10);
            redGuyGroup.add(redGuy);
        }        

        debug_text = new StoryFont(10, 2, '0xff0683', "");
        debug_text.image.scale.set(0.5, 1);
        debug_text.font.customSpacingY = 2;
        debug_text.font.customSpacingX = 0;

        game.time.advancedTiming = true;

    },

    update: function(){
                
        game.physics.arcade.collide(snowBro, collisionLayer);
        game.physics.arcade.collide(redGuyGroup, collisionLayer);
        game.physics.arcade.collide(snowBro.emitter, collisionLayer, particleKill, null, this);
        game.physics.arcade.overlap(snowBro.emitter, redGuyGroup, particleKill, null, this);
        var status = redGuy.freezeTimer.ms+" ";
        if(redGuy.freezeTimer.paused){
            status += "paused";
        }else if(redGuy.freezeTimer.running){
            status += "running";
        }else{
            status += "Work on progress...";
        }        
        debug_text.SetText(status +" " +showAnimState(redGuy));
        /*debug_text.SetText("RedState.."+showAIState(redGuy) + "\nTileFr.."+redGuy.tileAhead+"!!Wall.."+redGuy.wallAhead+"!!TileUp.."+redGuy.tileAbove+"!!Bounds.."+redGuy.boundsAhead
        +"\nXPos.."+redGuy.x+"!!Riht.."+redGuy.right);*/
    },

    render: function(){
        
        showBodyDebug(snowBro);
        redGuyGroup.forEachAlive(showBodyDebug, this);
        game.debug.geom(new Phaser.Circle(redGuy.x, redGuy.y, 2), '#0000ff');
        game.debug.geom(new Phaser.Circle(redGuy.body.x, redGuy.body.y, 2), '#00ffff');
        game.debug.geom(new Phaser.Circle(redGuy.x, redGuy.body.bottom, 2), '#ff0000');
        //game.debug.geom(new Phaser.Circle(redGuy.body.x, redGuy.body.y, 2), '#00ffff');
        //game.debug.body(redGuy);
        //game.debug.geom(redGuy.rayAt);
    },        

}

function particleKill(a, b) {
    a.beforeKilled();
    if (b instanceof Redguy) {                
        b.Freeze();
    }
}

function showBodyDebug(guy) {
    game.debug.body(guy);
}