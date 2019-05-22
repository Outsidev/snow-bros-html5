Redguy.prototype = Object.create(Char.prototype);
Redguy.prototype.constructor = Redguy;
function Redguy(game, x, y) {
  Char.call(this, game, x, y, "chars", "redguy");

  this.jumpPower = 170;

  this.animations.add("idle", generateFrames("redguy/idle/", [1]), 7, false);
  this.animations.add("walk", generateFrames("redguy/walk/", [1, 2]), 14, true);
  this.animations.add("onair", generateFrames("redguy/jump/", [2]), 7, false);
  this.animations.add("jump", generateFrames("redguy/jump/", [1]), 7, false);
  this.frozenFrames = generateFrames("other/snowball/build/", [1, 2, 3]);

  this.body.setSize(this.width - 2, 16);
  this.body.offset.set(0, this.height - this.body.height);
  this.body.collideWorldBounds = false;

  rayAt = new Phaser.Line();
  this.wallAhead = false;
  this.tileAhead = false;
  this.tileAbove = false;
  this.boundsAhead = false;

  this.frozenLevel = 0;
  this.freezeTimer = game.time.create(false);
  this.freezeTimer.loop(1000, this.Unfreeze, this);

  this.stateFinished = false;
  this.aiState = AIStateEnums.OnAir;
}

Redguy.prototype.update = function() {
  Char.prototype.update.call(this);

  this.body.velocity.x = 0;
  //this.enableKeys();
  this.DecideAIState();
  this.DoAction();

  this.DecideAnimState();
  this.playAnims();

  this.AdjustBodybyFrame();
};

Redguy.prototype.DecideAnimState = function() {
  Char.prototype.DecideAnimState.call(this);

  switch (this.animState) {
    case AnimStateEnums.FROZEN:
      if (this.frozenLevel <= 0) {
        this.animState = AnimStateEnums.IDLE;
      }
      break;
  }
};

Redguy.prototype.playAnims = function() {
  Char.prototype.playAnims.call(this);

  switch (this.animState) {
    case AnimStateEnums.FROZEN:
      this.frameName = this.frozenFrames[this.frozenLevel - 1];
      break;
  }
};

AIStateEnums = {
  Stop: 0,
  WalkToEnd: 1,
  JumpDownside: 2,
  JumpUpside: 3,
  Flip: 4,
  OnAir: 5,
  Frozen: 6
};

Redguy.prototype.AIFuncs = {
  touchingBounds: function(obj) {
    if (obj.right + 1 > game.width || obj.right - 1 < 0) {
      return true;
    }
    return false;
  },

  checkSurroundings: function(obj) {
    /*if (obj.tileHits) {
            for (var i = 0; i < obj.tileHits.length; i++) {
                obj.tileHits[i].debug = false;
            }
        }*/
    obj.rayAt = new Phaser.Line(
      obj.right,
      obj.bottom,
      obj.right + 4 * obj.facing,
      obj.bottom + 4
    );
    var tileHits = collisionLayer.getRayCastTiles(obj.rayAt, 1, true);
    obj.rayAt = new Phaser.Line(
      obj.right,
      obj.centerY,
      obj.right + 4 * obj.facing,
      obj.centerY
    );
    var wallHits = collisionLayer.getRayCastTiles(obj.rayAt, 1, true);
    obj.rayAt = new Phaser.Line(obj.centerX, obj.y, obj.centerX, obj.y - 2);
    var tileAboveHits = collisionLayer.getRayCastTiles(obj.rayAt, 1, true);
    /*for (var i = 0; i < tileHits.length; i++) {
            tileHits[i].debug = true;
        }
        for (var i = 0; i < tileAboveHits.length; i++) {
            tileAboveHits[i].debug = true;
        }
        collisionLayer.dirty = true;
        */
    obj.tileAhead = tileHits.length > 0 ? true : false;
    obj.wallAhead = wallHits.length > 0 ? true : false;
    obj.tileAbove =
      tileAboveHits.length > 0 && snowBro.y - obj.y < -1 ? true : false;
    obj.boundsAhead = obj.AIFuncs.touchingBounds(obj);
  }
};

Redguy.prototype.DecideAIState = function() {
  if (this.frozenLevel > 0) {
    this.aiState = AIStateEnums.Frozen;
  }

  if (!this.stateFinished) return;
  //console.log(showAIState(this)+" state finished....");
  switch (this.aiState) {
    case AIStateEnums.WalkToEnd:
      if (this.tileAbove) {
        this.aiState = AIStateEnums.JumpUpside;
      } else {
        var goDownChance = game.rnd.frac();
        if (
          !this.tileAhead &&
          !this.wallAhead &&
          !this.boundsAhead &&
          goDownChance > 0.5
        ) {
          this.aiState = AIStateEnums.JumpDownside;
        } else if (this.wallAhead || this.boundsAhead || goDownChance <= 0.5) {
          this.aiState = AIStateEnums.Flip;
        }
      }
      break;

    case AIStateEnums.JumpDownside:
      this.aiState = AIStateEnums.OnAir;
      break;

    case AIStateEnums.JumpUpside:
      this.aiState = AIStateEnums.OnAir;
      break;

    case AIStateEnums.Flip:
      this.aiState = AIStateEnums.WalkToEnd;
      break;

    case AIStateEnums.OnAir:
      this.aiState = AIStateEnums.WalkToEnd;
      break;

    case AIStateEnums.Frozen:
      this.aiState = AIStateEnums.WalkToEnd;
      break;
  }
};

Redguy.prototype.DoAction = function() {
  //console.log("running....");
  this.stateFinished = false;
  switch (this.aiState) {
    case AIStateEnums.Stop:
      break;
    case AIStateEnums.WalkToEnd:
      this.WalkToEnd();
      break;
    case AIStateEnums.JumpDownside:
      this.JumpDownside();
      break;
    case AIStateEnums.JumpUpside:
      this.JumpUpside();
      break;
    case AIStateEnums.Flip:
      this.Flip();
      break;
    case AIStateEnums.OnAir:
      this.LandOn();
      break;
    case AIStateEnums.Frozen:
      break;
  }

  //console.log(showAIState(this)+" state is running!");
};

Redguy.prototype.Freeze = function() {
  if (this.frozenLevel < 3) {
    this.frozenLevel++;
  }

  console.log("freeza -" + this.frozenLevel);

  this.freezeTimer.stop(false);
  this.freezeTimer.start();
  this.animState = AnimStateEnums.FROZEN;
};

Redguy.prototype.Unfreeze = function() {
  this.frozenLevel--;
  console.log("unfreeza -" + this.frozenLevel);

  if (this.frozenLevel <= 0) {
    this.stateFinished = true;
    this.freezeTimer.stop(false);
  }
};

Redguy.prototype.WalkToEnd = function() {
  this.AIFuncs.checkSurroundings(this);
  if (!this.tileAhead || this.wallAhead || this.boundsAhead || this.tileAbove) {
    this.stateFinished = true;
    return;
  }
  //console.log(this.tileHits.length);
  this.Move();
};

Redguy.prototype.LandOn = function() {
  if (this.body.onFloor()) {
    this.stateFinished = true;
    return;
  }
  //console.log(this.tileHits.length);
};

Redguy.prototype.Flip = function() {
  Char.prototype.Flip.call(this);
  this.stateFinished = true;
};

Redguy.prototype.JumpDownside = function() {
  if (!this.body.onFloor()) {
    this.stateFinished = true;
    return;
  }
  this.Move();
};

Redguy.prototype.JumpUpside = function() {
  if (!this.body.onFloor()) {
    this.stateFinished = true;
    return;
  }
  this.Jump();
};

function showAIState(guy) {
  return Object.keys(AIStateEnums)[guy.aiState];
}
