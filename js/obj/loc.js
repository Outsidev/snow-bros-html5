var Loc = {
    
    MENU_PUSH_START : "",
    MENU_DESCRIPTION : "",
    MENU_1PLAYER : "",
    MENU_2PLAYER: "",
    PROLOG_1: "",
    PROLOG_2: "",
    PROLOG_3: "",
    TITLE_BAR_1P : "",    
    TITLE_BAR_2P : "",
    TITLE_BAR_HI : "",
    GAME_OVER : "",

    GetLangLines : function(langFile){
        var lines = langFile.split('\n');        
        for(var i=0; i<lines.length; i++){            
            var line = lines[i].replace(/<br>/g, '\n').replace(/<p>/g,'  ');
            var splitPos = line.indexOf('>');
            var id = line.substring(0, splitPos);
            var str = line.substring(splitPos+1);
            this[id] = str;
        }
    }
}