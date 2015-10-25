//
//  ViewController.m
//  RemoteControl
//
//  Created by ticent_xia on 15/10/22.
//  Copyright (c) 2015年 ticentxia. All rights reserved.
//

#import "ViewController.h"
#import "SocektSingleton.h"
@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [[SocektSingleton sharedInstance] socketConnect];
    
    _dirPad=[[RCPad alloc] initWithFrame:(CGRect){50,100,150,150}];
    [_dirPad setDelegate:self];
    [self.view addSubview:_dirPad];
    
    _aButton=[[RCButton alloc]initWithFrame:(CGRect){420,170,60,60}];
    [[_aButton titleLabel]setText:@"攻击"];
    [_aButton setBkgImg:[UIImage imageNamed:@"button"]];
    [_aButton setBkgImgPressed:[UIImage imageNamed:@"button-pressed"]];
    [_aButton setDelegate:self];
    [self.view addSubview:_aButton];
    
    _bButton=[[RCButton alloc]initWithFrame:(CGRect){420,90,60,60}];
    [[_bButton titleLabel]setText:@"跳跃"];
    [_bButton setBkgImg:[UIImage imageNamed:@"button"]];
    [_bButton setBkgImgPressed:[UIImage imageNamed:@"button-pressed"]];
    [_bButton setDelegate:self];
    [self.view addSubview:_bButton];
    
    _cButton=[[RCButton alloc]initWithFrame:(CGRect){280,100,60,60}];
    [[_cButton titleLabel]setText:@"开始"];
    [_cButton setBkgImg:[UIImage imageNamed:@"button"]];
    [_cButton setBkgImgPressed:[UIImage imageNamed:@"button-pressed"]];
    [_cButton setDelegate:self];
    [self.view addSubview:_cButton];
    // Do any additional setup after loading the view, typically from a nib.
}
- (BOOL) shouldAutorotateToInterfaceOrientation:
(UIInterfaceOrientation)toInterfaceOrientation {
    return (toInterfaceOrientation == UIInterfaceOrientationLandscapeRight);
}
- (NSUInteger)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskLandscapeRight;
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
#pragma mark - RCButtonDelegate
-(void)buttonPressed:(NSString *)button{
    if ([button isEqual:@"攻击"]) {
        [[SocektSingleton sharedInstance] writeData2Stream:@"1"];
        NSLog(@"1");
    }
    if ([button isEqual:@"跳跃"]) {
        [[SocektSingleton sharedInstance] writeData2Stream:@"2"];
        NSLog(@"2");
    }
    if ([button isEqual:@"开始"]) {
        [[SocektSingleton sharedInstance] writeData2Stream:@"7"];
        NSLog(@"7");
    }
}
-(void)buttonReleased:(NSString *)button{
}
#pragma mark - RCPadDelegate
-(void)pad:(RCPad *)pad direction:(padDir)dir{
    if (dir==PADNONE) {
//        [[SocektSingleton sharedInstance] writeData2Stream:@"3"];
    }
    if (dir == PADUP) {
        [[SocektSingleton sharedInstance] writeData2Stream:@"3"];
        NSLog(@"3");
    }
    if (dir==PADDOWN) {
        [[SocektSingleton sharedInstance] writeData2Stream:@"4"];
        NSLog(@"4");
    }
    if (dir==PADLEFT) {
        [[SocektSingleton sharedInstance] writeData2Stream:@"5"];
        NSLog(@"5");
    }
    if (dir==PADRIGHT) {
        [[SocektSingleton sharedInstance] writeData2Stream:@"6"];
        NSLog(@"6");
    }
    
}
-(void)padRelease:(RCPad *)pad{
    
}
@end
