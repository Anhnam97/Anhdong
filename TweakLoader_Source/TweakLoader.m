#import <UIKit/UIKit.h>
#import <objc/runtime.h>

static void (*orig_setIdleTimerDisabled)(id, SEL, BOOL);

static void hooked_setIdleTimerDisabled(id self, SEL _cmd, BOOL disabled) {
    // Luôn ép chống tự động tắt màn hình
    orig_setIdleTimerDisabled(self, _cmd, YES);
}

__attribute__((constructor))
static void AnhdongInit(void) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIApplication *app = [UIApplication sharedApplication];

        Class cls = [UIApplication class];

        SEL selector = @selector(setIdleTimerDisabled:);

        Method method = class_getInstanceMethod(cls, selector);

        if (method) {
            orig_setIdleTimerDisabled =
                (void (*)(id, SEL, BOOL))method_getImplementation(method);

            method_setImplementation(
                method,
                (IMP)hooked_setIdleTimerDisabled
            );
        }

        // Ép ngay lập tức
        app.idleTimerDisabled = YES;

        // Ép lại định kỳ
        [NSTimer scheduledTimerWithTimeInterval:2.0
                                         repeats:YES
                                           block:^(NSTimer *timer) {
            [UIApplication sharedApplication].idleTimerDisabled = YES;
        }];
    });
}
