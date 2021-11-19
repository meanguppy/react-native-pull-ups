#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNPullUpView, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(state, NSString);
RCT_EXPORT_VIEW_PROPERTY(allowedSizes, NSArray);
RCT_EXPORT_VIEW_PROPERTY(actualSizes, NSArray);
RCT_EXPORT_VIEW_PROPERTY(useModalMode, BOOL);
RCT_EXPORT_VIEW_PROPERTY(useInlineMode, BOOL);
RCT_EXPORT_VIEW_PROPERTY(tapToDismissModal, BOOL);
RCT_EXPORT_VIEW_PROPERTY(maxWidth, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(onStateChanged, RCTDirectEventBlock);

//RCT_CUSTOM_VIEW_PROPERTY(iosStyling, NSDictionary, nil)
//RCT_EXPORT_VIEW_PROPERTY(gripSize, NSDictionary);
//RCT_EXPORT_VIEW_PROPERTY(gripColor, CGColor);
//RCT_EXPORT_VIEW_PROPERTY(cornerRadius, NSNumber);
//RCT_EXPORT_VIEW_PROPERTY(minimumSpaceAbovePullBar, NSNumber);
//RCT_EXPORT_VIEW_PROPERTY(pullBarBackgroundColor, CGColor);
//RCT_EXPORT_VIEW_PROPERTY(treatPullBarAsClear, BOOL);
//RCT_EXPORT_VIEW_PROPERTY(allowPullingPastMaxHeight, BOOL);
//RCT_EXPORT_VIEW_PROPERTY(contentBackgroundColor, CGColor);
//RCT_EXPORT_VIEW_PROPERTY(overlayColor, CGColor);
//RCT_EXPORT_VIEW_PROPERTY(pullBarHeight, NSNumber);
//RCT_EXPORT_VIEW_PROPERTY(presentingViewCornerRadius, NSNumber);
//RCT_EXPORT_VIEW_PROPERTY(shouldExtendBackground, BOOL);
//RCT_EXPORT_VIEW_PROPERTY(useFullScreenMode, BOOL);
//RCT_EXPORT_VIEW_PROPERTY(shrinkPresentingViewController, BOOL);
//RCT_EXPORT_VIEW_PROPERTY(horizontalPadding, NSNumber);
@end