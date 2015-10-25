//
//  RCPad.h
//  RemoteControl
//
//  Created by ticent_xia on 15/10/22.
//  Copyright © 2015年 ticentxia. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSUInteger, padDir)
{
    PADUP=2,
    PADLEFT=4,
    PADDOWN=8,
    PADRIGHT=6,
    PADNONE=5
    
};
@class RCPad;

@protocol PCPadDelegate <NSObject>

-(void)padRelease:(RCPad *)pad;
-(void)pad:(RCPad *)pad direction:(padDir)dir;

@end
@interface RCPad : UIView
@property (strong, nonatomic)UIImageView *padImgView;

@property (weak, nonatomic)id <PCPadDelegate>delegate;
-(padDir)currentDir;
@end
