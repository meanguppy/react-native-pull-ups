//
//  RNPullUps.swift
//  react-native-pull-ups
//
//  Created by Thomas Hessler on 1/16/21.
//

import Foundation
import UIKit
import FittedSheets

@objc(PullUpView)
class PullUpView : UIView {
    
    /* Internal state */
    var pullUpVc: UIViewController = UIViewController()
    var sheetController: SheetViewController? = nil
    var touchHandler: RCTTouchHandler? = nil
    var hasInitialized: Bool = false
    var isMounted: Bool = false
    var ignoreNextSizeChange: Bool = false
    var remountRequired: Bool = false

    /* Internal props */
    var currentSizeIdx: Int = 0 //via `state` prop
    var allowedSizes: Array<SheetSize> = [.fixed(0), .percent(0.50), .fullscreen]
    var actualSizes: Array<SheetSize> = [.fixed(0), .percent(0.50), .fullscreen]
    var useModalMode: Bool = false
    var onStateChanged: RCTDirectEventBlock? = nil

    /* Configurable props */
    var tapToDismissModal: Bool = true
    var maxWidth: CGFloat? = nil

    /* FittedSheets controller */
    var gripSize: CGSize = CGSize(width: 50, height: 6)
    var gripColor: UIColor = UIColor(white: 0.868, alpha: 1)
    var cornerRadius: CGFloat = 20
    var minimumSpaceAbovePullBar: CGFloat = 0
    var pullBarBackgroundColor: UIColor = UIColor.clear
    var treatPullBarAsClear: Bool = false
    var allowPullingPastMaxHeight: Bool = false
    var contentBackgroundColor: UIColor = UIColor.white
    var overlayColor: UIColor = UIColor(white: 0, alpha: 0.5)

    /* FittedSheets options (requires remount) */
    var pullBarHeight: CGFloat = 24
    var presentingViewCornerRadius: CGFloat = 20
    var shouldExtendBackground: Bool = true
    var useFullScreenMode: Bool = false
    var shrinkPresentingViewController: Bool = false
    var horizontalPadding: CGFloat = 0

    init(bridge: RCTBridge){
        super.init(frame: CGRect.zero)
        touchHandler = RCTTouchHandler(bridge: bridge)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func layoutSubviews(){
        super.layoutSubviews()
        if(self.hasInitialized){ return }

        self.hasInitialized = true
        self.remountRequired = false
        self.assignController()
        self.syncSheetState()
    }
    
    private func assignController () {
        let sheetOptions = SheetOptions(
            // The full height of the pull bar.
            // The presented view controller will treat this
            // area as a safearea inset on the top
            pullBarHeight: self.pullBarHeight,
            // The corner radius of the shrunken
            // presenting view controller
            presentingViewCornerRadius: self.presentingViewCornerRadius,
            // Extends the background behind the pull bar or not
            shouldExtendBackground: self.shouldExtendBackground,
            // Attempts to use intrinsic heights on navigation controllers.
            // This does not work well in combination with
            // keyboards without your code handling it.
            setIntrinsicHeightOnNavigationControllers: false,
            // Pulls the view controller behind the safe area top,
            // especially useful when embedding navigation controllers
            useFullScreenMode: self.useFullScreenMode,
            // Shrinks the presenting view controller,
            // similar to the native modal
            shrinkPresentingViewController: self.shrinkPresentingViewController,
            // Determines if using inline mode or not
            useInlineMode: !self.useModalMode,
            // Adds a padding on the left and right of the
            // sheet with this amount. Defaults to zero (no padding)
            horizontalPadding: self.horizontalPadding,
            // Sets the maximum width allowed for the sheet.
            // This defaults to nil and doesn't limit the width.
            maxWidth: self.maxWidth
        )
        
        let sheetController = SheetViewController(
            controller: self.pullUpVc,
            sizes: self.allowedSizes,
            options: sheetOptions
        )
        
        // The size of the grip in the pull bar
        sheetController.gripSize = self.gripSize
        
        // The color of the grip on the pull bar
        sheetController.gripColor = self.gripColor
        
        // The corner radius of the sheet
        sheetController.cornerRadius = self.cornerRadius
        
        // minimum distance above the pull bar,
        // prevents bar from coming right up to the edge of the screen
        sheetController.minimumSpaceAbovePullBar = self.minimumSpaceAbovePullBar
        
        // Set the pullbar's background explicitly
        sheetController.pullBarBackgroundColor = self.pullBarBackgroundColor
        
        // Determine if the rounding should happen on the pullbar or
        // the presented controller only (should only be true when
        // the pull bar's background color is .clear)
        sheetController.treatPullBarAsClear = self.treatPullBarAsClear
        
        // Disable the dismiss on background tap functionality
        sheetController.dismissOnOverlayTap = self.tapToDismissModal
        
        // Disable the ability to pull down to dismiss the modal
        // NOTE: We handle this manually when `state` is `hidden`
        sheetController.dismissOnPull = false
        
        // Allow pulling past the maximum height and bounce back.
        // Defaults to true.
        sheetController.allowPullingPastMaxHeight = self.allowPullingPastMaxHeight
        
        // Automatically grow/move the sheet to accomidate the keyboard.
        sheetController.autoAdjustToKeyboard = true
        
        // Color of the sheet anywhere the child view controller may not show (or is transparent),
        // such as behind the keyboard currently
        sheetController.contentBackgroundColor = self.contentBackgroundColor
        
        // Change the overlay color
        sheetController.overlayColor = self.useModalMode ? self.overlayColor : UIColor.clear
        
        // For inline mode interaction
        sheetController.allowGestureThroughOverlay = !self.useModalMode
        
        sheetController.sizeChanged = self.sizeChanged
        sheetController.didDismiss = self.didDismiss
        self.sheetController = sheetController
    }
    
    private func sizeChanged (vc: SheetViewController, size: SheetSize, newHeight: CGFloat) {
        if(ignoreNextSizeChange){
            ignoreNextSizeChange = false
            return
        }
        // search for lastIndex in case size values are duplicated to disable
        // certain states from ocurring (hidden/collapsed optional)
        if let idx = self.actualSizes.lastIndex(of: size) {
            self.notifyStateChange(idx: idx)
        }
    }
    
    private func didDismiss (vc: SheetViewController) {
        self.isMounted = false
        self.notifyStateChange(idx: 0)
    }

    private func notifyStateChange(idx: Int) {
        let didChange = (self.currentSizeIdx != idx)
        if(didChange){
            self.currentSizeIdx = idx
            let newState = ["hidden","collapsed","expanded"][idx]
            self.onStateChanged?(["state": newState])
        }
    }
    
    override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
        self.pullUpVc.view.addSubview(subview)
        touchHandler!.attach(to: subview)
    }
    
    override func removeReactSubview(_ subview: UIView!) {
        super.removeReactSubview(subview)
        subview.removeFromSuperview()
        touchHandler!.detach(from: subview)
    }

    @objc override func didSetProps(_ changedProps: [String]!) {
        if(!hasInitialized){ return }
        if(remountRequired){
            sheetController!.didDismiss = nil
            sheetController!.attemptDismiss(animated: false)
            isMounted = false
            self.assignController()
            remountRequired = false
        }
        self.syncSheetState()
    }
    
    private func syncSheetState() {
        let shouldBeMounted = (!useModalMode || currentSizeIdx != 0)
        if(shouldBeMounted){
            if(!isMounted){ mountSheet() }

            let targetSize = actualSizes[currentSizeIdx]
            if(sheetController!.currentSize != targetSize){
                // we can't differentiate between users changing the size
                // and us resizing it.. need this flag to prevent
                // an infinite loop of sizeChange events triggering each other
                ignoreNextSizeChange = true
                sheetController!.resize(to: targetSize)
            }
        } else if(isMounted){
            // destroy sheet if state is hidden in modal-mode
            destroySheet()
        }
    }
    
    private func mountSheet() {
        let rvc = self.reactViewController()!
        if(useModalMode) {
            rvc.present(sheetController!, animated: true)
        } else {
            sheetController!.willMove(toParent: rvc)
            rvc.addChild(sheetController!)
            rvc.view.addSubview(sheetController!.view)
            sheetController!.didMove(toParent: rvc)
            sheetController!.view.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                sheetController!.view.topAnchor.constraint(equalTo: rvc.view.topAnchor),
                sheetController!.view.bottomAnchor.constraint(equalTo: rvc.view.bottomAnchor),
                sheetController!.view.leadingAnchor.constraint(equalTo: rvc.view.leadingAnchor),
                sheetController!.view.trailingAnchor.constraint(equalTo: rvc.view.trailingAnchor)
            ])
            sheetController!.animateIn(size: actualSizes[currentSizeIdx], duration: 0.3)
        }
        self.isMounted = true
        self.notifyStateChange(idx: currentSizeIdx)
    }
    
    private func destroySheet() {
        // if inline,
        sheetController!.animateOut()
        // and if modal. do both so we dont have to keep track
        reactViewController()!.dismiss(animated: true)

        self.isMounted = false
        self.notifyStateChange(idx: 0)
    }
    
    /* Prop setters: internal usage */
    @objc func setUseModalMode(_ useModalMode: Bool) {
        self.useModalMode = useModalMode
        self.remountRequired = true
    }

    @objc func setState (_ state: String) {
        if let idx = ["hidden","collapsed","expanded"].firstIndex(of: state) {
            self.currentSizeIdx = idx
        }
    }
    
    @objc func setOnStateChanged (_ onStateChanged: @escaping RCTBubblingEventBlock) {
        self.onStateChanged = onStateChanged
    }

    /* Prop setters: FittedSheets options */
    @objc func setPullBarHeight (_ height: NSNumber) {
        self.pullBarHeight = CGFloat(truncating: height)
        self.remountRequired = true
    }
    
    @objc func setPresentingViewCornerRadius (_ radius: NSNumber) {
        self.presentingViewCornerRadius = CGFloat(truncating: radius)
        self.remountRequired = true
    }
    
    @objc func setShouldExtendBackground (_ shouldExtendBackground: Bool) {
        self.shouldExtendBackground = shouldExtendBackground
        self.remountRequired = true
    }
    
    @objc func setUseFullScreenMode (_ useFullScreenMode: Bool) {
        self.useFullScreenMode = useFullScreenMode
        self.remountRequired = true
    }
    
    @objc func setShrinkPresentingViewController (_ shrinkPresentingViewController: Bool) {
        self.shrinkPresentingViewController = shrinkPresentingViewController
        self.remountRequired = true
    }
    
    @objc func setHorizontalPadding (_ padding: NSNumber) {
        self.horizontalPadding = CGFloat(truncating: padding)
        self.remountRequired = true
    }
    
    @objc func setMaxWidth (_ maxWidth: NSNumber) {
        self.maxWidth = CGFloat(truncating: maxWidth)
        self.remountRequired = true
    }

    /* Prop setters: FittedSheets controller */
    @objc func setActualSizes (_ actualSizes: NSArray) {
        self.actualSizes = actualSizes.map({
            return .fixed(CGFloat($0 as! Float))
        })
    }

    @objc func setAllowedSizes (_ allowedSizes: NSArray) {
        self.allowedSizes = allowedSizes.map({
            return .fixed(CGFloat($0 as! Float))
        })
        sheetController?.sizes = self.allowedSizes
    }

    private func stringToSize (_ size: String) -> SheetSize {
        let percentageIndex = size.firstIndex(of: "%")
        let pixelIndex = size.firstIndex(of: Character("p"))
        let marginFromTopIdx = size.firstIndex(of: "^")
        let fullScreen = size == "fullscreen"
        let intrinsic = size == "intrinsic"
        
        if(percentageIndex != nil) {
            //Percentage
            guard let percentage = Float(size[..<percentageIndex!]) else { return .percent(0) }
            return .percent(percentage / 100)
        } else if (pixelIndex != nil) {
            //Pixel
            guard let pixel = Float(size[..<pixelIndex!]) else {
                return .fixed(0)
            }
            return .fixed(CGFloat(pixel))
        } else if (marginFromTopIdx != nil) {
            //Margin
            guard let margin = Float(size[..<marginFromTopIdx!]) else {
                return .marginFromTop(0)
            }
            return .marginFromTop(CGFloat(margin))
        } else if (fullScreen) {
            return .fullscreen
        } else if (intrinsic) {
            return .intrinsic
        }
        //Fallback to nothing.
        return .fixed(0)
    }
    
    @objc func setTapToDismissModal (_ tapToDismissModal: Bool) {
        self.tapToDismissModal = tapToDismissModal
        sheetController?.dismissOnOverlayTap = self.tapToDismissModal
    }
    
    @objc func setGripSize (_ gripSize: NSDictionary) {
        let width: Int = Int(gripSize.value(forKey: "width") as! String) ?? 0
        let height: Int = Int(gripSize.value(forKey: "height") as! String) ?? 0
        self.gripSize = CGSize(width: width, height: height)
        sheetController?.gripSize = self.gripSize
    }
    
    @objc func setGripColor (_ gripColor: CGColor) {
        self.gripColor = UIColor(cgColor: gripColor)
        sheetController?.gripColor = self.gripColor
    }
    
    @objc func setCornerRadius (_ cornerRadius: NSNumber) {
        self.cornerRadius = CGFloat(truncating: cornerRadius)
        sheetController?.cornerRadius = self.cornerRadius
    }
    
    @objc func setMinimumSpaceAbovePullBar (_ minimumSpaceAbovePullBar: NSNumber) {
        self.minimumSpaceAbovePullBar = CGFloat(truncating: minimumSpaceAbovePullBar)
        sheetController?.minimumSpaceAbovePullBar = self.minimumSpaceAbovePullBar
    }
    
    @objc func setPullBarBackgroundColor (_ pullBarBackgroundColor: CGColor) {
        self.pullBarBackgroundColor = UIColor(cgColor: pullBarBackgroundColor)
        sheetController?.pullBarBackgroundColor = self.pullBarBackgroundColor
    }
    
    @objc func setTreatPullBarAsClear (_ treatPullBarAsClear: Bool) {
        self.treatPullBarAsClear = treatPullBarAsClear
        sheetController?.treatPullBarAsClear = self.treatPullBarAsClear
    }
    
    @objc func setAllowPullingPastMaxHeight (_ allowPullingPastMaxHeight: Bool) {
        self.allowPullingPastMaxHeight = allowPullingPastMaxHeight
        sheetController?.allowPullingPastMaxHeight = self.allowPullingPastMaxHeight
    }
    
    @objc func setContentBackgroundColor (_ contentBackgroundColor: CGColor) {
        self.contentBackgroundColor = UIColor(cgColor: contentBackgroundColor)
        sheetController?.contentBackgroundColor = self.contentBackgroundColor
    }
    
    @objc func setOverlayColor (_ overlayColor: CGColor) {
        self.overlayColor = UIColor(cgColor: overlayColor)
        sheetController?.overlayColor = self.overlayColor
    }
}


@objc(RNPullUpView)
class RNPullUpView: RCTViewManager {
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func view() -> UIView! {
        return PullUpView(bridge: self.bridge)
    }
}
