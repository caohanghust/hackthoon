var PERSON_COLLISION_TYPE = 1;//人物碰撞
var BOTTOM_COLLISION_TYPE = 2;//地面碰撞
var CIRCLE_COLLISION_TYPE = 3;//怪兽碰撞
var BOX_COLLISION_TYPE = 4;//箱子碰撞
var TRIANGLE_COLLISION_TYPE = 5; //障碍物碰撞
var COIN_COLLISION_TYPE = 6; //金币碰撞

var MyLayer = cc.Layer.extend({
    person : null,
    coins : [],
    barrier1s:[],
    barrier2s:[],
    throns:[],
    monsters:[],
    init:function (space) {

        this._super();

        var size = cc.director.getWinSize();

        this.person = new Person();
        this.person.init(this,space);
        this.person.run();
        //this.person.runUnder();

        //金币
        for(var i =0;i< coindata.length;i++){
            var coin = new Coin();
            coin.init(this,coindata[i],space);
            this.coins.push(coin);
        }
        //单层障碍物
        for(var i = 0;i< barrier1data.length;i++){
            var barrier1 = new Barrier1();
            barrier1.init(this,barrier1data[i],space);
            this.barrier1s.push(barrier1);
        }
        //双层障碍物
        for(var i = 0;i< barrier2data.length;i++){
            var barrier2 = new Barrier2();
            barrier2.init(this,barrier2data[i],space);
            this.barrier2s.push(barrier2);
        }
        //尖刺障碍物
        for(var i = 0;i< throndata.length;i++){
            var thron = new Thron();
            thron.init(this,throndata[i],space);
            this.throns.push(thron);
        }
        //怪物
        for (var i = 0;i<monsterdata.length;i++){
            var monster = new Monster();
            monster.init(this,monsterdata[i],space);
            this.monsters.push(monster);
        }

    }
});

var MyScene = cc.Scene.extend({
    space:null,
    gameLayer:null,
    uiLayer:null,
    consotroller:null,
    gameState:0,
    initPhysicsWorld:function(){
        this.space = new cp.Space();
        //this.setupDebugNode();

        //set the gravity, the first parameter is the gravity along x axis,
        // the second is along y axis.
        this.space.gravity = cp.v(0, -200);

        //set space's edge.
        var staticBody = this.space.staticBody;
        var WIN_SIZE = cc.winSize;
        var BALL_COLLISION_TYPE = 1;
        var TOP_THREE_WALL_COLLISION_TYPE = 2;
        var BOTTOM_WALL_COLLISION_TYPE = 3;

        var wallBottom = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, 150),// start point
            cp.v(4294967295, 150),// MAX INT:4294967295
            0);// thickness of wall
        wallBottom.setCollisionType(BOTTOM_COLLISION_TYPE);
        wallBottom.setElasticity(0);
        wallBottom.setFriction(1);
        this.space.addStaticShape(wallBottom);

    },
    update: function (dt) {
        //invoke the method that update the interface in the engine
        //the timeStep is the interval.
        var timeStep = 0.03;
        this.space.step(timeStep);
        //tm is program's running time
        tm +=dt;
        var position = this.gameLayer.person.sprite.getBoundingBox();
        if(position.x<-100||position.y<0||position.x>800)
        {
            this.gameState = 1;
            this.controller.gameOver();
        }
    },
    onEnter:function () {
        this._super();
        tm = 0;
        this.initPhysicsWorld();
        this.scheduleUpdate();

        this.gameStart();

        cc.audioEngine.playMusic(bgm,true);

        //人物落地碰撞
        this.space.addCollisionHandler(PERSON_COLLISION_TYPE,BOTTOM_COLLISION_TYPE,
            this.collisionBegin.bind(this),
            null,
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );

        //人物碰到箱子
        this.space.addCollisionHandler(PERSON_COLLISION_TYPE,BOX_COLLISION_TYPE,
            this.collisionBegin.bind(this),
            null,
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );
        //人物碰到障碍物
        this.space.addCollisionHandler(PERSON_COLLISION_TYPE,TRIANGLE_COLLISION_TYPE,
            this.collisionBegin.bind(this),
            null,
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );
        //人物碰到怪兽
        this.space.addCollisionHandler(PERSON_COLLISION_TYPE,CIRCLE_COLLISION_TYPE,
            this.collisionBegin.bind(this),
            null,
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );

        //人物碰到金币
        this.space.addCollisionHandler(PERSON_COLLISION_TYPE,COIN_COLLISION_TYPE,
            this.collisionBegin.bind(this),
            null,
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );


    },

    //the method will be invoked when the collision happens.
    collisionBegin : function ( arbiter, space ) {
        var shapes = arbiter.getShapes();

        var shapeA = shapes[0];
        var shapeB = shapes[1];

        var collTypeA = shapeA.collision_type;
        var collTypeB = shapeB.collision_type;

        if(collTypeA ==  PERSON_COLLISION_TYPE)
        {
            switch(collTypeB)
            {
                case BOX_COLLISION_TYPE:
                    this.space.addPostStepCallback(function () {
                        shapeA.getSprite();
                    }.bind(this));
                    break;
                case TRIANGLE_COLLISION_TYPE:
                    this.space.addPostStepCallback(function () {
                        this.gameState = 1;
                        this.controller.gameOver();
                    }.bind(this));
                    break;
                case CIRCLE_COLLISION_TYPE:
                    this.space.addPostStepCallback(function () {
                        this.gameState = 1;
                        this.controller.gameOver();
                    }.bind(this));
                    break;
                case COIN_COLLISION_TYPE:
                    this.space.addPostStepCallback(function () {
                        this.space.removeShape(shapes[1]);
                        shapeB.removeSprite();
                        this.uiLayer.score += 100;
                        cc.audioEngine.playEffect(coin_v);
                    }.bind(this));
                    break;
                case BOTTOM_COLLISION_TYPE:
                    this.space.addPostStepCallback(function () {
                        //console.log('dd');
                        shapeA.getSprite();
                    }.bind(this));
                    break;
            }
        }

        return true;
    },
    //碰撞过程操作
    collisionPost : function ( arbiter, space ) {
        var shapes = arbiter.getShapes();
        var shapeA = shapes[1];
        var shapeB = shapes[1];
        if(shapeA ==  PERSON_COLLISION_TYPE)
        {
            switch(shapeB)
            {
                case BOX_COLLISION_TYPE:
                    cc.log("aaaa");
                    break;
                case TRIANGLE_COLLISION_TYPE:
                    this.space.addPostStepCallback(function () {
                        cc.log("triangle");
                    }.bind(this));
                    break;
                case CIRCLE_COLLISION_TYPE:
                    this.space.addPostStepCallback(function () {
                        cc.log("circle");
                    }.bind(this));
                    break;
            }
        }
        //cc.log('collision post');
    },
    //碰撞分开操作
    collisionSeparate : function ( arbiter, space ) {
        //cc.log('collision separate');
    },

    gameStart:function(){
        this._super();

        var bg = new BgLayer();
        this.addChild(bg);
        bg.init();

        this.gameLayer = new MyLayer();
        this.addChild(this.gameLayer);
        this.gameLayer.init(this.space);

        this.uiLayer = new UiLayer();
        this.addChild(this.uiLayer);
        this.uiLayer.init();

        this.controller = new GameController();
        this.addChild(this.controller);
        this.controller.init();

        this.gameOperate(this.gameLayer,this.uiLayer);
        this.testOperate(this.gameLayer,this.uiLayer,this.controller);

        cc.director.pause();
        this.controller.gameStart();

    },
    gameOperate:function(layer,ui){
        var ws = new WebSocket("ws://10.42.0.1:4000");
        ws.onopen = function(){
            console.log("shakeHand success!");
            ws.send('hustclf');
        };
        ws.onerror = function(){
            console.log("error");
        };
        ws.onmessage =(function(e){
            var message = JSON.parse(e.data);
            var cmd = message.operation;
            if(cc.director.isPaused()){
                cc.director.resume();
                this.controller.gameRun();
            }
            switch(cmd){
                case '1':
                    layer.person.throw();
                    break;
                case '2':
                    layer.person.jump();
                    break;
                case  '3':
                    layer.person.run();
                    break;
                case  '4':
                    layer.person.runUnder();
                    break;
                case  '5':
                    //controller.gameStart();
                    layer.person.goLeft();
                case '6':
                    layer.person.goRight();
                    break;
                case '7':
                    setTimeout(function(){
                        location.reload();
                    },2000);
                default :
                    break;
            }
        }).bind(this);

    },
    testOperate:function(layer,ui,controller){
        document.onkeydown = (function(e){
            switch(e.keyCode){
                //down
                case 40 :
                    layer.person.runUnder();
                    break;
                //up
                case 38 :
                    layer.person.run();
                    break;
                //right0
                case 39 :
                    layer.person.goRight();
                    break;
                //left
                case 37 :
                    //controller.gameStart();
                    layer.person.goLeft();
                    break;
                case 32 :
                    layer.person.jump();
                    break;
                //按下t键
                case 84:
                    layer.person.throw();
                    break;
                //按下r键
                case 82:
                    if(cc.director.isPaused()){
                        cc.director.resume();
                        this.controller.gameRun();
                    }
                    //else{
                    //    cc.director.pause();
                    //    this.controller.gameStart();
                    //}

                    //if(this.gameState==0){
                    //    cc.director.resume();
                    //}
                    //else{
                    //    setTimeout(function(){
                    //        location.reload();
                    //    },2000);
                    //}
                    //cc.director.runScene(new MyScene());


                    //cc.director.runScene(new MyScene());
                default :
                    break;
            }

        }).bind(this);
    },
});
