//
//  RCPad.m
//  RemoteControl
//
//  Created by ticent_xia on 15/10/22.
//  Copyright © 2015年 ticentxia. All rights reserved.
//

#import "RCPad.h"
@interface RCPad(){
    padDir _currentDir;
}
@end
@implementation RCPad

-(instancetype)initWithFrame:(CGRect)frame{
    self=[super initWithFrame:frame];
    if (self) {
        [self initPadStyle];
    }
    return self;
}
-(void)initPadStyle{
    _padImgView=[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"dPad-None"]];
    _padImgView.frame=[self bounds];
    [self addSubview:_padImgView];
    
    _currentDir=PADNONE;
}
-(padDir)currentDir{
    return _currentDir;
}
-(padDir)dirForPoint:(CGPoint)point{
    CGFloat x=point.x;
    CGFloat y=point.y;
    if (((x < 0) || (x > [self bounds].size.width)) ||
        ((y < 0) || (y > [self bounds].size.height)))
    {
        return PADNONE;
    }
    NSUInteger column = x / ([self bounds].size.width / 3);
    NSUInteger row = y / ([self bounds].size.height / 3);
    
    padDir dir=(row * 3)+column+1;
    return dir;
}

-(UIImage *)imageForDir:(padDir)dir{
    UIImage *img=nil;
    switch(dir){
        case PADNONE:
            img=[UIImage imageNamed:@"dPad-None"];
            break;
        case PADUP:
            img=[UIImage imageNamed:@"dPad-Up"];
            break;
        case PADDOWN:
            img=[UIImage imageNamed:@"dPad-Down"];
            break;
        case PADLEFT:
            img=[UIImage imageNamed:@"dPad-Left"];
            break;
        case PADRIGHT:
            img=[UIImage imageNamed:@"dPad-Right"];
            break;
        default:
            img=[UIImage imageNamed:@"dPad-None"];
            break;
    }
    return img;
}
-(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    CGPoint point=[[touches anyObject]locationInView:self];
    padDir dir=[self dirForPoint:point];
    if (dir!=_currentDir) {
        _currentDir=dir;
        [_padImgView setImage:[self imageForDir:_currentDir]];
        [self.delegate pad:self direction:_currentDir];
    }
}
-(void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    _currentDir=PADNONE;
    [_padImgView setImage:[self imageForDir:_currentDir]];
    [self.delegate padRelease:self];
}
@end
