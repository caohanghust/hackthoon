var Coin = cc.Class.extend({
    sprite:null,
    shape:null,
    init:function(spriteSheet,position,space) {
        this.sprite = new cc.PhysicsSprite(coin);
        var body = new cp.Body(1, cp.momentForBox(1,30,30));
        body.f.y=200;
        body.setPos(position);
        space.addBody(body);

        this.shape=new cp.CircleShape(body,30,cp.v(0,0));
        this.shape.setCollisionType(6);
        //this.shape.setSensor(true);
        space.addShape(this.shape);

        this.sprite.setBody(body);
        this.sprite.setAnchorPoint(0, 0);
        this.sprite.setPosition(position.x, position.y);
        //this.sprite.setScale(0.4);
        spriteSheet.addChild(this.sprite, 1);
        this.move(position.x,position.y);

        this.shape.removeSprite = (function(){
            spriteSheet.removeChild(this.sprite);
            console.log(spriteSheet);
        }).bind(this,spriteSheet);
    },
    move:function(x,y){
        this.sprite.runAction(new cc.MoveTo((x+300)/160,cc.p(-300,y)));
    },
})