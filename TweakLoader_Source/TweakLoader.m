#import <UIKit/UIKit.h>
static BOOL oldIdleTimerState = NO;
static void TweakLoaderEnableIdleTimer(void) { dispatch_async(dispatch_get_main_queue(), ^{ UIApplication *app = [UIApplication sharedApplication];
    oldIdleTimerState = app.idleTimerDisabled;
    app.idleTimerDisabled = YES;
});
}
static void TweakLoaderRestoreIdleTimer(void) { dispatch_async(dispatch_get_main_queue(), ^{ UIApplication *app = [UIApplication sharedApplication];
    app.idleTimerDisabled = oldIdleTimerState;
});
}
attribute((constructor)) static void TweakLoaderInit(void) { dispatch_async(dispatch_get_main_queue(), ^{ NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center addObserverForName:UIApplicationDidBecomeActiveNotification
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(NSNotification *notification) {
        TweakLoaderEnableIdleTimer();
    }];

    [center addObserverForName:UIApplicationWillResignActiveNotification
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(NSNotification *notification) {
        TweakLoaderRestoreIdleTimer();
    }];

    UIApplication *app = [UIApplication sharedApplication];

    if (app.applicationState == UIApplicationStateActive) {
        app.idleTimerDisabled = YES;
    }
});
}
