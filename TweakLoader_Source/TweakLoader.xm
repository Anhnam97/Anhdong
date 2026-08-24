#import <UIKit/UIKit.h>

static BOOL oldIdleState = NO;

%hook UIApplication

- (void)applicationDidBecomeActive:(UIApplication *)application {
    %orig;
    oldIdleState = application.idleTimerDisabled;
    application.idleTimerDisabled = YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    application.idleTimerDisabled = oldIdleState;
    %orig;
}

%end

%ctor {
    %init;
}
