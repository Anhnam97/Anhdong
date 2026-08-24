#import <UIKit/UIKit.h>

static void KeepScreenOn(void) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIApplication *app = [UIApplication sharedApplication];
        app.idleTimerDisabled = YES;
    });
}

__attribute__((constructor))
static void TweakLoaderInit(void) {
    dispatch_async(dispatch_get_main_queue(), ^{
        KeepScreenOn();

        [[NSNotificationCenter defaultCenter]
            addObserverForName:UIApplicationDidBecomeActiveNotification
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(NSNotification *notification) {
            KeepScreenOn();
        }];

        [NSTimer scheduledTimerWithTimeInterval:5.0
                                         repeats:YES
                                           block:^(NSTimer *timer) {
            KeepScreenOn();
        }];
    });
}
