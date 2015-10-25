//
//  RCButton.m
//  RemoteControl
//
//  Created by ticent_xia on 15/10/22.
//  Copyright (c) 2015年 ticentxia. All rights reserved.
//

#import "RCButton.h"

@implementation RCButton
-(instancetype)initWithFrame:(CGRect)frame{
    self=[super initWithFrame:frame];
    if (self) {
        [self initButtonStyle];
    }
    return self;
}

-(void)initButtonStyle{
    _bkgImgView=[[UIImageView alloc]initWithImage:_bkgImg];
    [_bkgImgView setFrame:[self bounds]];//CGRectMake(0, 0, self.frame.size.width, self.frame.size.height)
    [_bkgImgView setContentMode:UIViewContentModeCenter];
    [_bkgImgView setAutoresizingMask:UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight];
    [self addSubview:_bkgImgView];
    
    _titleLabel=[[UILabel alloc] init];
    [_titleLabel setBackgroundColor:[UIColor clearColor]];
    [_titleLabel setTextColor:[UIColor darkGrayColor]];
    [_titleLabel setShadowOffset:CGSizeMake(0, 1)];
    [_titleLabel setShadowColor:[UIColor whiteColor]];
    [_titleLabel setFont:[UIFont boldSystemFontOfSize:15]];
    [_titleLabel setFrame:[self bounds]];
    [_titleLabel setTextAlignment:NSTextAlignmentCenter];
    [_titleLabel setAutoresizingMask:UIViewAutoresizingFlexibleHeight|UIViewAutoresizingFlexibleWidth];
    [self addSubview:_titleLabel];
    
    [self addObserver:self
           forKeyPath:@"ifPressed"
              options:NSKeyValueObservingOptionNew
              context:NULL];//KVO->ifPressed
    [self addObserver:self
           forKeyPath:@"bkgImg"
              options:NSKeyValueObservingOptionNew
              context:NULL];//KVO->bkgImg
    [self addObserver:self
           forKeyPath:@"bkgImgPressed"
              options:NSKeyValueObservingOptionNew
              context:NULL];//KVO->bkgImgPressed
    self.ifPressed=NO;  //下划线变量赋值不会调用set方法
}
-(void)layoutSubviews{
    [super layoutSubviews];
}

-(void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSString *,id> *)change context:(void *)context{
    if ([keyPath isEqualToString:@"bkgImg"]||[keyPath isEqualToString:@"bkgImgPressed"]||[keyPath isEqualToString:@"ifPressed"]) {
        if (self.ifPressed) {
            [_bkgImgView setImage:_bkgImgPressed];
        }
        else{
            [_bkgImgView setImage:_bkgImg];
        }
    }
}

-(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    self.ifPressed=YES;
    [self.delegate buttonPressed:self.titleLabel.text];
}

-(void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    self.ifPressed=NO;
    [self.delegate buttonReleased:self.titleLabel.text];
}
@end
