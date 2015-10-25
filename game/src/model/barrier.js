var Obj = cc.Class.extend({
    sprite:null,
    img:null,
    shape:null,
    setObj:function(spriteSheet,position,index,space) {
        var body;

        if (index == 1) {
            body = new cp.Body(1000, cp.momentForBox(1000, 75, 75));
        }
        else if (index == 2) body = new cp.Body(1000, cp.momentForBox(1000, 75, 130));
        else if (index == 3) body = new cp.Body(100000, cp.momentForBox(1000, 10, 60));
        else body = new cp.Body(1000, cp.momentForBox(1000, 50, 50));

        body.setPos(position);  //set body's position   
        //body.v = new cp.Vect(100, 0);      //set body's velocity, (v along x axis, y)                                 
        space.addBody(body);

        if (index == 1)
        {
            this.shape=new cp.BoxShape(body,75,75);
            this.shape.setCollisionType(BOX_COLLISION_TYPE);
            this.shape.setElasticity(0);
            this.shape.setFriction(1);
        }
        else if(index==2) {
            this.shape=new cp.BoxShape(body,75,130);
            this.shape.setCollisionType(BOX_COLLISION_TYPE);
            this.shape.setElasticity(0);
            this.shape.setFriction(1);
        }
        else if(index==3) {
            this.shape=new cp.BoxShape(body,10,60);
            this.shape.setCollisionType(TRIANGLE_COLLISION_TYPE);
            this.shape.setElasticity(0);
            this.shape.setFriction(1);
        }
        else {
            this.shape=new cp.BoxShape(body,50,50);
            this.shape.setCollisionType(CIRCLE_COLLISION_TYPE);
            this.shape.setElasticity(0);
            this.shape.setFriction(1);
        }


        //this.shape.setSensor(true);
        space.addShape(this.shape);

        //console.log(position.x);
        this.sprite = new cc.PhysicsSprite(this.img);
        this.sprite.setBody(body);
        this.sprite.setAnchorPoint(0, 0);
        this.sprite.setPosition(position);
        this.sprite.setScale(1);
        spriteSheet.addChild(this.sprite, 1);
        this.move(position.x,position.y);
    },
    move:function(x,y){
        this.sprite.runAction(new cc.MoveTo((x+200)/160,cc.p(-200,y)));
    },
})

var Barrier1 = Obj.extend({
    init:function(spriteSheet,position,space) {
        this.img = barrier1;
        this.setObj(spriteSheet,position,1,space);
    },
})
//两个方形障碍
var Barrier2 = Obj.extend({
    init:function(spriteSheet,position,space) {
        this.img = barrier2;
        this.setObj(spriteSheet,position,2,space);
    },
})
//一个刺
var Thron = Obj.extend({
    init:function(spriteSheet,position,space) {
        this.img = thron;
        this.setObj(spriteSheet,position,3,space);
    },
})

////怪物
var Monster = Obj.extend({
    init:function(spriteSheet,position,space){
        this.img = monster;
        this.setObj(spriteSheet,position,4,space);
        //this.resetScale(1);
    }
})