//
//  SocektSingleton.h
//  RemoteControl
//
//  Created by ticent_xia on 15/10/23.
//  Copyright © 2015年 ticentxia. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AsyncSocket.h"
@interface SocektSingleton : NSObject<AsyncSocketDelegate>

@property (nonatomic, strong) AsyncSocket    *socket;       // socket
@property (nonatomic, copy  ) NSString       *socketHost;   // socket的Host
@property (nonatomic, assign) UInt16         socketPort;    // socket的prot

+(SocektSingleton *)sharedInstance;
-(void)socketConnect;
-(void)writeData2Stream:(NSString *)key;
@end
