//
//  SocektSingleton.m
//  RemoteControl
//
//  Created by ticent_xia on 15/10/23.
//  Copyright © 2015年 ticentxia. All rights reserved.
//

#import "SocektSingleton.h"
#import <sys/socket.h>
#import <netinet/in.h>
#import <arpa/inet.h>
#import <unistd.h>

@implementation SocektSingleton
+(SocektSingleton *)sharedInstance{
    static SocektSingleton *sharedInstace = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        
        sharedInstace = [[self alloc] init];
    });
    
    return sharedInstace;
}
-(void)socketConnect{
    self.socket = [[AsyncSocket alloc] initWithDelegate:self];
    [self.socket connectToHost:@"10.42.0.1" onPort:8088 error:nil];

}

-(void)writeData2Stream:(NSString *)key{
    NSData  *dataStream  = [key dataUsingEncoding:NSUTF8StringEncoding];
    
    [self.socket writeData:dataStream withTimeout:-1 tag:0];
}
// 连接成功回调
#pragma mark  - 连接成功回调
-(void)onSocket:(AsyncSocket *)sock didConnectToHost:(NSString *)host port:(UInt16)port
{
    NSLog(@"socket连接成功");
    
}
-(void)onSocketDidDisconnect:(AsyncSocket *)sock
{
    NSLog(@"sorry the connect is failure %ld",sock.userData);
    
}


-(void)onSocket:(AsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag
{
    // 对得到的data值进行解析与转换即可
    
    [self.socket readDataWithTimeout:-1 tag:0];
}
@end
