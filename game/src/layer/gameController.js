var GameController = cc.Layer.extend({
    overImg:null,
    startImg:null,
    init : function(){
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();

    },
    gameOver:function(){
        //console.log('GAME OVER');

        this.removeChild(this.overImg);
        this.removeChild(this.startImg);

        this.overImg = new cc.Sprite(GAME_OVER);
        this.overImg.setAnchorPoint(0, 0);
        this.overImg.setPosition(0, 0);
        this.overImg.setScale(1);
        this.addChild(this.overImg, 1);
        //cc.audioEngine.playEffect(die_v);
    },
    gameStart:function(){
        //console.log('GAME START');

        this.removeChild(this.overImg);
        this.removeChild(this.startImg);

        this.startImg = new cc.Sprite(GAME_START);
        this.startImg.setAnchorPoint(0, 0);
        this.startImg.setPosition(0, 0);
        this.startImg.setScale(1);
        this.addChild(this.startImg, 1);
    },
    gameRun:function(){
        this.removeChild(this.overImg);
        this.removeChild(this.startImg);
        this.overImg =null;
        this.startImg = null;
    },
})