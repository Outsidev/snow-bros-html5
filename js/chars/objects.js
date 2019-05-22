SnowArc.prototype = Object.create(Phaser.Particle.prototype);
SnowArc.prototype.constructor = SnowArc; 
function SnowArc(game, x, y){
    Phaser.Particle.call(this, game, x, y, 'chars', 'other/snowarc/flash/1');    
    this.animations.add('flash', generateFrames('other/snowarc/flash/', [1,2]), 7, true);      
    this.animations.add('boom', generateFrames('other/snowarc/boom/', [1]), 7, false);   
    this.mainParent = null;   
    //this.events.onKilled.add(this.onKilled, this);    
}

SnowArc.prototype.onEmit = function(){
    this.scale.x = this.mainParent.facing;
    this.body.checkCollision.none = false;
    this.body.setSize(2,2);
    this.body.allowGravity = false;
    this.body.drag.x = 420;
    this.animations.play('flash');
    game.time.events.add(200, function(){this.body.allowGravity = true;}, this);
}

SnowArc.prototype.beforeKilled = function(){
    this.body.velocity.x = 0;        
    this.body.checkCollision.none = true;
    this.animations.play('boom', 24, false, true);
}