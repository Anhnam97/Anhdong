#import <UIKit/UIKit.h>

static void KeepScreenOn(void) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication sharedApplication].idleTimerDisabled = YES;
    });
}

%ctor {
    KeepScreenOn();

    [[NSNotificationCenter defaultCenter]
        addObserverForName:UIApplicationDidBecomeActiveNotification
                    object:nil
                     queue:[NSOperationQueue mainQueue]
                usingBlock:^(NSNotification *notification) {
                    KeepScreenOn();
                }];

    // Kiểm tra lại định kỳ để giữ màn hình luôn sáng
    [NSTimer scheduledTimerWithTimeInterval:5.0
                                     repeats:YES
                                       block:^(NSTimer *timer) {
        KeepScreenOn();
    }];
}
