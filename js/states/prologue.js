var prologueCutsceneState = {
    
    create: function(){
        state = this;
        var csPosx = this.game.width * 0.5;
        var csPosY = this.game.height * 0.3;
        csImg = this.add.image(csPosx, csPosY, 'sprites', 'cs1');
        csImg.anchor.x = 0.5;        
        csImg.anchor.y = 0.5;     

        var fontDict = "'.!?1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        storyFont = new StoryFont(state.game.width * 0.2, state.game.height * 0.6, '0xa8e4fc', "", fontDict);
        sceneCounter=0;
        fadeSpeed = 600;
        textSpeed = 50;

        cutSceneList = [new Cutscene1(), new Cutscene2(), new Cutscene3()];
        cutSceneList[0].startScene();
    }, 
}

function Cutscene(_firstFrame, _secondFrame, _storyText, _nextScene=""){    
    this.firstFrame = _firstFrame;
    this.secondFrame = _secondFrame;
    this.storyText = _storyText;
    this.nextScene = _nextScene;

    this.textTimer = state.time.create(true);
    this.imageTimer = state.time.create(true);
    this.textTimer.onComplete.addOnce(this.onTextComplete, this);
    this.textTimer.start();                
    this.imageTimer.start();                        
}

Cutscene.prototype.startScene = function(){
        csImg.frameName = this.firstFrame;
        state.camera.flash('#000000', fadeSpeed);        
        this.runStoryText();
};
    
Cutscene.prototype.blinkSequence = function() {
},

Cutscene.prototype.swapBlink = function (img, frameName1, frameName2, flashCount, speedUp = 10) {
    this.imageTimer.repeat(100, flashCount, function () {
        this.imageTimer.delay -= speedUp;
        switch (img.frameName) {
            case frameName1:
                img.frameName = frameName2;
                break;
            case frameName2:
                img.frameName = frameName1
                break;
        }
    }, this);
};

Cutscene.prototype.runStoryText = function () {        

        this.wordbyword = function(textBlock) {
            wordCountInLine++;
            storyFont.font.text += textBlock[++wordIndex];            
            if (checkIndexes.includes(textBlock[wordIndex])) {
                var nextWCount = this.getNextWordLength(textBlock, wordIndex + 1) + wordCountInLine;
                if (nextWCount > 20 && textBlock[wordIndex] != '\n') {
                    storyFont.font.text += '\n';
                }
            }

            if (storyFont.font.text[storyFont.font.text.length - 1] == "\n") {
                wordCountInLine = 0;
            }

            if (storyFont.font.text.length > 100) {
                storyFont.font.text = storyFont.font.text.substring(storyFont.font.text.indexOf('\n') + 1);
            }

        };

        this.getNextWordLength = function(text, startPos) {
            var wordEndPos = 9999;
            for (var i = 0; i < checkIndexes.length; i++) {
                var ind = text.indexOf(checkIndexes[i], startPos);
                if (ind != -1 && ind < wordEndPos) {
                    wordEndPos = ind;
                }
            }
            return wordEndPos - startPos;
        };
        
        storyFont.font.text = "";
        storyFont.image.visible = true;        
        wordIndex = -1;
        wordCountInLine = 0;
        checkIndexes = [' ', '.', '?', '!', '\n'];

        this.textTimer.repeat(textSpeed, this.storyText.length, this.wordbyword, this, this.storyText);        
};

Cutscene.prototype.onTextComplete = function(){
        this.textTimer.add(1000, function(){
            storyFont.image.visible = false;            
        }, this);
        this.textTimer.add(2000, this.onSceneComplete, this);
};

Cutscene.prototype.onSceneComplete = function() {
        state.camera.fade('#000000', fadeSpeed);
        state.camera.onFadeComplete.addOnce(function(){
            
            this.textTimer.destroy();
            this.imageTimer.destroy();
            if(this.nextScene == null){
                game.state.start("play");
            }else{
                cutSceneList[this.nextScene].startScene();
            }            
        }, this);
};


Cutscene1.prototype = Object.create(Cutscene.prototype);
Cutscene1.prototype.constructor = Cutscene1;
function Cutscene1(){
    Cutscene.call(this, 'cs1', 'cs2', Loc.PROLOG_1, 1);      
};
Cutscene1.prototype.startScene = function () {
    Cutscene.prototype.startScene.call(this);    
    this.imageTimer.loop(2400, this.blinkSequence, this);
    this.blinkSequence();
};
Cutscene1.prototype.blinkSequence = function () {
    this.imageTimer.add(0, this.swapBlink, this, csImg, this.firstFrame, this.secondFrame, 6);
    this.imageTimer.add(1200, this.swapBlink, this, csImg, this.firstFrame, this.secondFrame, 2);
};

Cutscene2.prototype = Object.create(Cutscene.prototype);
Cutscene2.prototype.constructor = Cutscene2;
function Cutscene2(){
    Cutscene.call(this, 'cs3', 'cs4', Loc.PROLOG_2, 2);  
};
Cutscene2.prototype.startScene = function () {
    Cutscene.prototype.startScene.call(this);
    this.imageTimer.add(2400, this.blinkSequence, this);
};
Cutscene2.prototype.blinkSequence = function () {
    this.imageTimer.add(0, this.swapBlink, this, csImg, 'cs3', 'cs4', 15);
};


Cutscene3.prototype = Object.create(Cutscene.prototype);
Cutscene3.prototype.constructor = Cutscene3;
function Cutscene3(){    
    Cutscene.call(this, 'cs5', '', Loc.PROLOG_3, null);
};
Cutscene3.prototype.startScene = function(){
    Cutscene.prototype.startScene.call(this);
}