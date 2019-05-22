var Keys = {

    UP : "",
    DOWN : "",
    LEFT : "",
    RIGHT : "",
    BUT_A : "",
    BUT_B : "",
    START : "",
    SELECT : "",

    GetKeys: function (keysFile) {
        var lines = keysFile.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i]
            var splitPos = line.indexOf('>');
            var id = line.substring(0, splitPos).toString();
            var key = line.substring(splitPos + 1).replace(/[\r\n]/g, "");
            this[id] = game.input.keyboard.addKey(Phaser.KeyCode[key]);
        }
    }    
}