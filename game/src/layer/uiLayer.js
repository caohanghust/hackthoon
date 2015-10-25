var UiLayer = cc.Layer.extend({
    skill:null,
    score:null,
    scoreLable:null,
    distance:null,
    distanceLable:null,

    init:function(){
        this._super();
        var size = cc.director.getWinSize();

        this.score = 0;
        this.distance = 0;

        //添加技能lable
        var dartSkillLable = new cc.Sprite(dart_lable);
        dartSkillLable.setAnchorPoint(0,0);
        dartSkillLable.setPosition(300,50);
        dartSkillLable.setScale(0.7);
        this.addChild(dartSkillLable,1);

        //添加技能lable
        var godSkillLable = new cc.Sprite(god_lable);
        godSkillLable.setAnchorPoint(0,0);
        godSkillLable.setPosition(400,50);
        godSkillLable.setScale(0.7);
        this.addChild(godSkillLable,1);

        this.distanceLable = new cc.LabelTTF(this.distance+'m', "Impact", 38);
        this.distanceLable.setPosition(size.width -100 , size.height - 40);
        this.addChild(this.distanceLable);

        this.scoreLable = new cc.LabelTTF("得分:"+this.score, "Impact", 38);
        this.scoreLable.setPosition(size.width / 2, size.height - 40);
        this.addChild(this.scoreLable);

        //计算距离
        this.countTime(100,size);

    },
    //计算当前距离
    countScore:function(size){
        this.removeChild(this.distanceLable);
        this.distanceLable = new cc.LabelTTF(this.distance+'m', "Impact", 38);
        this.distanceLable.setPosition(size.width -100 , size.height - 40);
        this.addChild(this.distanceLable);

        this.removeChild(this.scoreLable);
        this.scoreLable = new cc.LabelTTF("得分:"+this.score, "Impact", 38);
        this.scoreLable.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        this.addChild(this.scoreLable);

    },
    //计时器
    countTime:function(time,size){
        var start_time = new Date();
        var interval = time;
        this.schedule(function(){
            var now = new Date();
            var passTime = now - start_time;
            if(passTime>interval){
                start_time = new Date();
                this.distance += 1;
                this.score+= 10;
                this.countScore(size);
            }
        })
    },
})