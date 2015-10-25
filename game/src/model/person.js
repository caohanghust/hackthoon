var Person = cc.Class.extend({
    spriteSheet:null,
    shape:null,
    space:null,
    sprite:null,
    runningAction:null,
    runUnderAction:null,
    jumpUpAction:null,
    jumpDownAction:null,
    jumpState:null,
    /*1:桥上跑,2:桥下跑,3:滞空向上，4：滞空向下*/
    state:1,
    init: function (spriteSheet,space) {
        //人物初始化
        this.space = space;
        this.spriteSheet = spriteSheet;
        var position = {x: 100, y: 200};
        var body = new cp.Body(10, cp.momentForBox(10000, 100, 100));
        body.setPos(position);  //set body's position   
        //body.v = new cp.Vect(100, 0);      //set body's velocity, (v along x axis, y)                                 
        space.addBody(body);

        //add the this.shape   
        this.shape = new cp.BoxShape(body, 100, 100);
        this.shape.setCollisionType(PERSON_COLLISION_TYPE);
        this.shape.setElasticity(0);
        this.shape.setFriction(1);
        //this.shape.setCollisionType(BALL_COLLISION_TYPE);
        space.addShape(this.shape);


        this.sprite = new cc.PhysicsSprite(person);
        this.sprite.setScale(1);
        this.sprite.setBody(body);
        this.sprite.setAnchorPoint(0, 0);
        this.sprite.setPosition(cc.p(position.x, position.y));

        spriteSheet.addChild(this.sprite, 1);

        this.shape.getSprite = function(){
            //this.sprite.run();
            this.run();
        }.bind(this);

        this.animateArray = new Array(4);
        //桥上跑动作
        var runAnimation = new cc.Animation();
        runAnimation.addSpriteFrameWithFile(person);
        runAnimation.addSpriteFrameWithFile(person2);
        runAnimation.addSpriteFrameWithFile(person3);
        runAnimation.addSpriteFrameWithFile(person4);
        runAnimation.setDelayPerUnit(0.05);           //设置两个帧播放时间
        this.animateArray[1]=runAnimation;

        //this.runningAction = cc.repeatForever(cc.animate(runAnimation));

        //桥下跑动作
        var runUnderAnimation = new cc.Animation();
        runUnderAnimation.addSpriteFrameWithFile(person_under);
        runUnderAnimation.addSpriteFrameWithFile(person2_under);
        runUnderAnimation.addSpriteFrameWithFile(person3_under);
        runUnderAnimation.addSpriteFrameWithFile(person4_under);
        runUnderAnimation.setDelayPerUnit(0.05);           //设置两个帧播放时间
        this.animateArray[2]=runUnderAnimation;

        //跳起动作
        var jumpUpAnimation = new cc.Animation();
        jumpUpAnimation.addSpriteFrameWithFile(jump_up);
        jumpUpAnimation.setDelayPerUnit(0.05);
        this.animateArray[3]=jumpUpAnimation;

        //落地动作
        var jumpDownAnimation = new cc.Animation();
        jumpDownAnimation.addSpriteFrameWithFile(jump_down);
        jumpDownAnimation.setDelayPerUnit(0.05);
        this.animateArray[4]=jumpDownAnimation;

        //this.runUnderAction = cc.repeatForever(cc.animate(runUnderAnimation));

    },
    run: function () {
        this.sprite.stopAllActions();
        this.runningAction = cc.repeatForever(cc.animate(this.animateArray[1]));
        switch (this.state) {
            //当在桥上跑时，按1接着在地上跑
            case 1:
                this.sprite.runAction(this.runningAction);
                break;
            //按2桥下跑
            case 2:
                this.sprite.runAction(new cc.MoveBy(0.1, cc.p(0, 400)));
                this.sprite.runAction(this.runningAction);
                break;
            //跳跃落地
            case 4:
                this.sprite.runAction(this.runningAction);
                break;
            default :
                this.sprite.runAction(this.runningAction);
                break;
        }
        this.state = 1;
    },
    runUnder: function () {
        this.sprite.stopAllActions();
        this.runUnderAction = cc.repeatForever(cc.animate(this.animateArray[2]));
        switch (this.state) {
            case 1:
                this.sprite.runAction(new cc.MoveBy(0.1, cc.p(0, -100)));
                this.sprite.runAction(this.runUnderAction);
                break;
            default :
                //this.sprite.runAction(this.runUnderAction);
                break;
        }
        this.state = 2;
    },
    goRight:function(){
        this.sprite.runAction(new cc.MoveBy(0.5, cc.p(50, 0)));
    },
    goLeft:function(){
        this.sprite.runAction(new cc.MoveBy(0.1, cc.p(-50, 0)));
    },
    jump:function(){
        this.sprite.stopAllActions();
        this.jumpUpAction = cc.repeatForever(cc.animate(this.animateArray[3]));
        switch (this.state){
            //只有在地上跑时才能跳
            case 1:
                this.sprite.runAction(new cc.MoveBy(0.2, cc.p(0, 300)));
                setTimeout((function(){
                    this.drop();
                }).bind(this),200);
                this.sprite.runAction(this.jumpUpAction);
                break;
            case 4:
                this.sprite.runAction(new cc.MoveBy(0.2, cc.p(0, 300)));
                setTimeout((function(){
                    this.drop();
                }).bind(this),200);
                this.sprite.runAction(this.jumpUpAction);
                break;
        }
        this.state = 3;
        cc.audioEngine.pa
    },
    drop:function(){
        this.sprite.stopAllActions();
        this.jumpDownAction = cc.repeatForever(cc.animate(this.animateArray[4]));
        this.sprite.runAction(this.jumpDownAction);
        this.state = 4;
        //setTimeout(function(){
        //    this.run();
        //}.bind(this),500)
    },
    throw:function(){

        var dart = new Darts();
        var position = this.sprite.getBoundingBox();
        dart.init(this.spriteSheet,position,this.space);
        cc.audioEngine.playEffect(dart_v);
    }
})

var Darts = cc.Class.extend({
    spriteSheet:null,
    sprite:null,
    init:function(spriteSheet,position,space){
        this.spriteSheet = spriteSheet;
        var body = new cp.Body(100, cp.momentForBox(100, 87, 33));
        body.setPos(position);  //set body's position   
        //body.v = new cp.Vect(100, 0);      //set body's velocity, (v along x axis, y)                                 
        space.addBody(body);
        //add the shape   
        var shape = new cp.BoxShape(body, 87, 33);
        shape.setElasticity(0);
        shape.setFriction(1);
        //shape.setCollisionType(BALL_COLLISION_TYPE);
        space.addShape(shape);

        this.sprite = new cc.PhysicsSprite(dart);
        this.sprite.setScale(1);
        this.sprite.setBody(body);
        this.sprite.setAnchorPoint(0, 0);
        this.sprite.setPosition(cc.p(position.x+100, position.y+50));
        spriteSheet.addChild(this.sprite, 1);
        this.fly();
    },
    fly:function(){
        this.sprite.runAction(new cc.MoveBy(1, cc.p(600,0)));
        //移除
        setTimeout(function(){
            this.spriteSheet.removeChild(this.sprite);
            this.sprite=null;
        }.bind(this),1000)
    },
})