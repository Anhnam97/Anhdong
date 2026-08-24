#import <UIKit/UIKit.h>
static NSTimer *keepScreenOnTimer = nil;
static void KeepScreenOn(void) { dispatch_async(dispatch_get_main_queue(), ^{ UIApplication *app = [UIApplication sharedApplication];
    if (app.applicationState == UIApplicationStateActive) {
        app.idleTimerDisabled = YES;
    }
});
}
static void StartKeepScreenOn(void) { dispatch_async(dispatch_get_main_queue(), ^{ UIApplication *app = [UIApplication sharedApplication];
    app.idleTimerDisabled = YES;

    [keepScreenOnTimer invalidate];

    keepScreenOnTimer =
    [NSTimer scheduledTimerWithTimeInterval:5.0
                                     repeats:YES
                                       block:^(NSTimer *timer) {
        KeepScreenOn();
    }];
});
}
static void StopKeepScreenOn(void) { dispatch_async(dispatch_get_main_queue(), ^{ [keepScreenOnTimer invalidate]; keepScreenOnTimer = nil;
    [UIApplication sharedApplication].idleTimerDisabled = NO;
});
}
__attribute__((constructor)) static void TweakLoaderInit(void) { dispatch_async(dispatch_get_main_queue(), ^{ NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center addObserverForName:UIApplicationDidBecomeActiveNotification
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(NSNotification *notification) {
        StartKeepScreenOn();
    }];

    [center addObserverForName:UIApplicationWillResignActiveNotification
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(NSNotification *notification) {
        StopKeepScreenOn();
    }];

    UIApplication *app = [UIApplication sharedApplication];

    if (app.applicationState == UIApplicationStateActive) {
        StartKeepScreenOn();
    }
});
}
