#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import <React/RCTInvalidating.h>


@interface PullUpView : UIView <RCTInvalidating>
-(void) updateStyleWithJson:id;
@end

@interface RCT_EXTERN_MODULE(RNPullUpView, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(state, NSString);
RCT_EXPORT_VIEW_PROPERTY(collapsedHeight, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(maxSheetWidth, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(modal, BOOL);
RCT_EXPORT_VIEW_PROPERTY(hideable, BOOL);
RCT_EXPORT_VIEW_PROPERTY(tapToDismissModal, BOOL);
RCT_EXPORT_VIEW_PROPERTY(useSafeArea, BOOL);
RCT_EXPORT_VIEW_PROPERTY(overlayColor, UIColor);
RCT_EXPORT_VIEW_PROPERTY(overlayOpacity, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(onStateChanged, RCTDirectEventBlock);
RCT_CUSTOM_VIEW_PROPERTY(iosStyling, NSDictionary, PullUpView){
	[view updateStyleWithJson:json];
};
@end