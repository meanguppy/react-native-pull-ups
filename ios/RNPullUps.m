#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNPullUpView, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(pullBarHeight, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(presentingViewCornerRadius, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(shouldExtendBackground, BOOL);
RCT_EXPORT_VIEW_PROPERTY(setIntrensicHeightOnNavigationControllers, BOOL);
RCT_EXPORT_VIEW_PROPERTY(useFullScreenMode, BOOL);
RCT_EXPORT_VIEW_PROPERTY(shrinkPresentingViewController, BOOL);
RCT_EXPORT_VIEW_PROPERTY(useInlineMode, BOOL);
RCT_EXPORT_VIEW_PROPERTY(horizontalPadding, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(maxWidth, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(sizes, NSArray);
RCT_EXPORT_VIEW_PROPERTY(gripSize, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(gripColor, CGColor);
RCT_EXPORT_VIEW_PROPERTY(cornerRadius, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(minimumSpaceAbovePullBar, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(pullBarBackgroundColor, CGColor);
RCT_EXPORT_VIEW_PROPERTY(treatPullBarAsClear, BOOL);
RCT_EXPORT_VIEW_PROPERTY(dismissOnOverlayTap, BOOL);
RCT_EXPORT_VIEW_PROPERTY(dismissOnPull, BOOL);
RCT_EXPORT_VIEW_PROPERTY(allowPullingPastMaxHeight, BOOL);
RCT_EXPORT_VIEW_PROPERTY(autoAdjustToKeyboard, BOOL);
RCT_EXPORT_VIEW_PROPERTY(contentBackgroundColor, CGColor);
RCT_EXPORT_VIEW_PROPERTY(overlayColor, CGColor);
RCT_EXPORT_VIEW_PROPERTY(allowGestureThroughOverlay, BOOL);
RCT_EXPORT_VIEW_PROPERTY(onSizeChange, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(show, BOOL)
@end
