#import <UIKit/UIKit.h>

static void AnhdongForceScreenOn(void) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIApplication *app = [UIApplication sharedApplication];

        if (app.applicationState == UIApplicationStateActive) {
            app.idleTimerDisabled = YES;
        }
    });
}

static void AnhdongShowLoaded(void) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIAlertController *alert =
            [UIAlertController alertControllerWithTitle:@"Anhdong"
                                                message:@"Anhdong Tweak: ON"
                                         preferredStyle:UIAlertControllerStyleAlert];

        [alert addAction:
            [UIAlertAction actionWithTitle:@"OK"
                                     style:UIAlertActionStyleDefault
                                   handler:nil]];

        UIViewController *root = nil;

        for (UIScene *scene in
             [UIApplication sharedApplication].connectedScenes) {

            if (scene.activationState == UISceneActivationStateForegroundActive &&
                [scene isKindOfClass:[UIWindowScene class]]) {

                UIWindowScene *windowScene = (UIWindowScene *)scene;

                for (UIWindow *window in windowScene.windows) {
                    if (window.isKeyWindow) {
                        root = window.rootViewController;
                        break;
                    }
                }
            }

            if (root) break;
        }

        if (root) {
            [root presentViewController:alert
                                animated:YES
                              completion:nil];
        }
    });
}

__attribute__((constructor))
static void AnhdongTweakInit(void) {
    dispatch_async(dispatch_get_main_queue(), ^{
        AnhdongForceScreenOn();

        AnhdongShowLoaded();

        [[NSNotificationCenter defaultCenter]
            addObserverForName:UIApplicationDidBecomeActiveNotification
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(NSNotification *note) {
            AnhdongForceScreenOn();
        }];

        [NSTimer scheduledTimerWithTimeInterval:2.0
                                         repeats:YES
                                           block:^(NSTimer *timer) {
            AnhdongForceScreenOn();
        }];
    });
}
