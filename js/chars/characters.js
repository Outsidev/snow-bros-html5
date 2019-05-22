AnimStateEnums = {
    IDLE: 0,
    WALK: 1,
    ONAIR: 2,
    ATTACK: 3,
    DIE: 4,
    JUMP: 5,
    FROZEN: 6,
};

Char.prototype = Object.create(Phaser.Sprite.prototype);
Char.prototype.constructor = Char;
function Char(game, x, y, key, baseName){
    Phaser.Sprite.call(this, game, x, y, key, baseName+'/idle/1');    

    this.baseName = baseName;
    this.animState = AnimStateEnums.IDLE;
    
    this.facing = 1;//1right,-1left
    this.moveSpeed = 50;
    this.jumpPower = 190;

    this.anchor.set(0.5,0);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    
    game.add.existing(this);
}

Char.prototype.Flip = function(){
    this.facing *=-1;
    this.scale.x *=-1; 
}

Char.prototype.SetFacing = function(dir){    
    if(this.facing != dir){
        this.facing = dir;
        this.scale.x *=-1;
    }
}

Char.prototype.Move = function(dir=0){
    if(dir!=0){
        this.SetFacing(dir);
    }    
    this.body.velocity.x = this.facing * this.moveSpeed; 

}

Char.prototype.Jump = function(){
    if(this.body.onFloor()){
        this.body.velocity.y = -this.jumpPower;        
    }    

}

Char.prototype.DecideAnimState = function(){
    
    switch(this.animState){
        
        case AnimStateEnums.IDLE:

            if(this.body.onFloor() && this.body.velocity.x != 0){
                this.animState = AnimStateEnums.WALK;
            }
            else if(!this.body.onFloor()){
                this.animState = AnimStateEnums.ONAIR;
            }

        break;
        
        case AnimStateEnums.WALK:
            
            if(this.body.onFloor() && this.body.velocity.x == 0){
                this.animState = AnimStateEnums.IDLE;
            }else if(!this.body.onFloor()){
                this.animState = AnimStateEnums.ONAIR;
            }
        break;        

        case AnimStateEnums.ONAIR:
            
            if(this.body.onFloor()){
                this.animState = AnimStateEnums.IDLE;
            }else if(this.body.velocity.y < 0){
                this.animState = AnimStateEnums.JUMP;
            }
        break;

        case AnimStateEnums.JUMP:

            if(this.body.velocity.y >= 0 && this.animations.currentAnim.isFinished || this.body.onFloor()){       
                this.animState = AnimStateEnums.ONAIR;
            }
        break;

        case AnimStateEnums.ATTACK:
            if(this.animations.currentAnim.isFinished){
                this.animState = AnimStateEnums.IDLE;
            }
        break;
        case AnimStateEnums.DIE:
            
        break;

    }

    //console.log("ONFLOR: "+this.body.onFloor());
    
    this.y = Phaser.Math.ceilTo(this.y); 
    //console.log("Velo:"+this.body.velocity.x);

}

Char.prototype.playAnims = function(){

    switch(this.animState){
        case AnimStateEnums.IDLE:
            this.animations.play('idle');
            break;
        case AnimStateEnums.WALK:
            this.animations.play('walk');
            break;
        case AnimStateEnums.ONAIR:
            this.animations.play('onair');
            break;
        case AnimStateEnums.JUMP:
            this.animations.play('jump');            
            break;
        case AnimStateEnums.ATTACK:
            this.animations.play('attack');
            break;
        case AnimStateEnums.DIE:
            this.animations.play('die');
            break;
        
    }    
}

Char.prototype.AdjustBodybyFrame = function(){
    var newy = this.body.offset.y - (this.height - this.body.height);
    this.body.offset.set(0, this.height - this.body.height);
    this.body.y += newy;
}

Char.prototype.enableKeys = function(){
    if (Keys.LEFT.isDown) {
        //console.log("LEFT:");
        this.Move(-1);
    }
    else if (Keys.RIGHT.isDown) {
        //console.log("RIGHT:");
        this.Move(1);
    }
    if (Keys.BUT_B.downDuration(1)) {
        //console.log("RIGHT:");
        this.Jump();
    }
    else if (Keys.BUT_A.downDuration(1)) {
        this.Attack();
    }
}


SnowBro.prototype = Object.create(Char.prototype);
SnowBro.prototype.constructor = SnowBro;
function SnowBro(game, x, y){
    Char.call(this, game, x, y, 'chars', 'snowbro');
    this.body.setSize(this.width, 16, 0, this.height-17);

    this.jumpPower = 210;

    this.animations.add('idle', generateFrames('snowbro/idle/', [1]), 7, false);
    this.animations.add('walk', generateFrames('snowbro/walk/', [1,2,3,2]), 7, true);
    this.animations.add('onair', generateFrames('snowbro/jump/', [1]), 7, false);
    this.animations.add('jump', generateFrames('snowbro/jump/', [1, 1, 2, 3, 4]), 10, false);
    this.animations.add('attack', generateFrames('snowbro/atak/', [2, 1]), 10, false);
    this.animations.add('die', generateFrames('snowbro/atak/', [1, 2, 1, 2, 1, 2, 3, 3, 3, 3]), 7, false);

    this.attackDelay = 305;

    this.emitter = game.add.emitter(0, 0, 50);
    this.emspeed = 250;
    this.emitter.setYSpeed(0, 0);
    this.emitter.setRotation(0, 0);

    this.emitter.particleClass = SnowArc;
    this.emitter.makeParticles('chars', 0, this.emitter.maxParticles, true);
    this.emitter.children.forEach(function(a){
        a.mainParent = this;
    }, this);

}

SnowBro.prototype.update = function(){

    Char.prototype.update.call(this);

    this.emitter.x = this.centerX;
    this.emitter.y = this.centerY;

    this.body.velocity.x = 0;
    this.enableKeys();

    this.DecideAnimState();
    this.playAnims();
    this.AdjustBodybyFrame();
}

SnowBro.prototype.Attack = function(){
    this.animState = AnimStateEnums.ATTACK;
    this.emitter.setXSpeed(this.emspeed*this.facing, this.emspeed*this.facing);
    this.emitter.emitParticle();
}

function generateFrames(path, nums){
    var frames = [];
    for(var i=0; i<nums.length; i++){
        frames.push(path+nums[i]);
    }
    return frames;
}

function showAnimState(guy){
    return Object.keys(AnimStateEnums)[guy.animState];       
}