//
//  RCButton.h
//  RemoteControl
//
//  Created by ticent_xia on 15/10/22.
//  Copyright (c) 2015年 ticentxia. All rights reserved.
//

#import <UIKit/UIKit.h>

@class RCButton;
@protocol RCButtonDelegate <NSObject>

-(void)buttonPressed:(NSString *)button;
-(void)buttonReleased:(NSString *)button;

@end
@interface RCButton : UIView
@property (readonly, nonatomic)UILabel *titleLabel;
@property (strong, nonatomic)UIImageView *bkgImgView;
@property (strong, nonatomic)UIImage *bkgImg;
@property (strong, nonatomic)UIImage *bkgImgPressed;
@property (strong, nonatomic)UIImage *bkgImgReleased;

@property(assign, nonatomic)BOOL ifPressed;

@property(weak, nonatomic)id<RCButtonDelegate>delegate;
@end
