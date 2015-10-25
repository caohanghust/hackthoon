var BgLayer = cc.Layer.extend({
    nowBg:0,
    bgRepeatTime : 10,
    bgTime : 20,
    init : function(){
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();
        var bg = [];
        for(var i = 0;i<this.bgRepeatTime;i++){
            bg[i] = new cc.Sprite(background);
            bg[i].setAnchorPoint(0,0);
            bg[i].setPosition(3200*i,0);
            bg[i].setScale(1);
            this.addChild(bg[i],1);
            bg[i].runAction(new cc.MoveBy(this.bgTime*(i+1),cc.p(-3200*(i+1),0)));
        }
    },
})