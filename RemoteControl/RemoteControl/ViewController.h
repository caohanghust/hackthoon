//
//  ViewController.h
//  RemoteControl
//
//  Created by ticent_xia on 15/10/22.
//  Copyright (c) 2015年 ticentxia. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCButton.h"
#import "RCPad.h"

@interface ViewController : UIViewController<RCButtonDelegate,PCPadDelegate>
@property(strong, nonatomic)RCButton *aButton;
@property(strong, nonatomic)RCButton *bButton;
@property(strong, nonatomic)RCButton *cButton;
@property(strong, nonatomic)RCPad *dirPad;
@end

