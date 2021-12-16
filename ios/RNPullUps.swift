//
//  RNPullUps.swift
//  react-native-pull-ups
//
//  Created by Thomas Hessler on 1/16/21.
//

import Foundation
import UIKit
import FittedSheets

class FixedHeightView: UIView {
    public var intrinsicHeight: CGFloat = 0 {
        didSet { invalidateIntrinsicContentSize() }
    }
    override var intrinsicContentSize: CGSize {
        return CGSize(width: -1, height: intrinsicHeight)
    }
}

class PullUpViewController: UIViewController {

    let target: PullUpView
    var lastWidth: CGFloat = 0

    init(target: PullUpView){
        self.target = target
        super.init(nibName: nil, bundle: nil)
        self.view = FixedHeightView()
    }

    required init?(coder: NSCoder){
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLayoutSubviews(){
        super.viewDidLayoutSubviews()
        let width = view.frame.width
        if(lastWidth != width){
            target.updateContainerSize()
            lastWidth = width
        }
        // The first subview is our React sheet wrapper.
        // The user's rendered content is within that wrapper. Check for a ScrollView
        let userContent = view.subviews[safe: 0]?.subviews
        if let rctScrollView = userContent?.first(where: { $0 is RCTScrollView }) {
            if let nativeScrollView = (rctScrollView as! RCTScrollView).scrollView {
                // Allow the SheetController to properly handle scrolling inside
                target.sheetController?.handleScrollView(nativeScrollView)
            }
        }
    }
}

@objc(PullUpView)
class PullUpView: UIView, RCTInvalidating {
    /* Internal state */
    public private(set) var sheetController: SheetViewController?
    var controller: PullUpViewController?
    var uiManager: RCTUIManager
    var touchHandler: RCTTouchHandler
    var hasInitialized: Bool = false
    var isMounted: Bool = false
    var ignoreNextSizeChange: Bool = false
    var remountRequired: Bool = false
    var initialHeight: CGFloat = 0
    var initialBottomPad: Float = 0
    /* Internal props */
    var currentSizeIdx: Int = 0 //via `state` prop
    var actualSizes: Array<SheetSize> = [.intrinsic, .intrinsic]
    var hideable: Bool = true
    var modal: Bool = false
    var safeAreaBottom: CGFloat = 0
    var onStateChanged: RCTDirectEventBlock?
    /* FittedSheets props */
    var tapToDismissModal: Bool = true
    var maxWidth: CGFloat?
    /* FittedSheets styling (controller) */
    var gripSize: CGSize = CGSize(width: 50, height: 6)
    var gripColor: UIColor = UIColor(white: 0.868, alpha: 1)
    var cornerRadius: CGFloat = 0
    var minimumSpaceAbovePullBar: CGFloat = 0
    var pullBarBackgroundColor: UIColor = UIColor.clear
    var treatPullBarAsClear: Bool = false
    var allowPullingPastMaxHeight: Bool = false
    var contentBackgroundColor: UIColor = UIColor.clear
    var overlayColor: UIColor = UIColor(white: 0, alpha: 0.5)
    /* FittedSheets styling (options, requires remount) */
    var pullBarHeight: CGFloat = 24
    var presentingViewCornerRadius: CGFloat = 20
    var shouldExtendBackground: Bool = true
    var useFullScreenMode: Bool = false
    var shrinkPresentingViewController: Bool = false

    init(bridge: RCTBridge){
        self.uiManager = bridge.uiManager!
        self.touchHandler = RCTTouchHandler(bridge: bridge)
        super.init(frame: CGRect.zero)
        self.controller = PullUpViewController(target: self)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func layoutSubviews(){
        super.layoutSubviews()

        if(self.hasInitialized){ return }
        self.hasInitialized = true
        self.remountRequired = false
        self.initialHeight = bounds.height //height of react component
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
            useInlineMode: !self.modal,
            // Adds a padding on the left and right of the
            // sheet with this amount. Defaults to zero (no padding)
            horizontalPadding: 0,
            // Sets the maximum width allowed for the sheet.
            // This defaults to nil and doesn't limit the width.
            maxWidth: self.maxWidth
        )
        
        let sheetController = SheetViewController(
            controller: self.controller!,
            sizes: self.actualSizes,
            options: sheetOptions
        )
        
        // The size of the grip in the pull bar
        sheetController.gripSize = self.gripSize
        
        // The color of the grip on the pull bar
        sheetController.gripColor = self.gripColor
        
        // The corner radius of the sheet
        // NOTE: by default it is 0, but ReactNative uses border-radius: 20
        // We leave it configurable here in-case it causes issues with other options
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
        sheetController.dismissOnPull = self.hideable
        
        // Allow pulling past the maximum height and bounce back.
        // Defaults to true.
        sheetController.allowPullingPastMaxHeight = self.allowPullingPastMaxHeight
        
        // Automatically grow/move the sheet to accomidate the keyboard.
        sheetController.autoAdjustToKeyboard = true
        
        // Color of the sheet anywhere the child view controller may not show (or is transparent),
        // such as behind the keyboard currently
        sheetController.contentBackgroundColor = self.contentBackgroundColor
        
        // Change the overlay color
        sheetController.overlayColor = self.modal ? self.overlayColor : UIColor.clear
        
        // For inline mode interaction
        sheetController.allowGestureThroughOverlay = !self.modal
        
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
            self.notifyStateChange(idx: idx + 1)
        }
    }

    private func didDismiss (vc: SheetViewController) {
        self.isMounted = false
        self.notifyStateChange(idx: 0)
    }

    func invalidate(){
        sheetController?.sizeChanged = nil
        sheetController?.didDismiss = nil
        self.onStateChanged = nil
        destroySheet()
    }

    private func notifyStateChange(idx: Int) {
        let didChange = (self.currentSizeIdx != idx)
        if(didChange){
            self.currentSizeIdx = idx
            let newState = ["hidden","collapsed","expanded"][idx]
            self.onStateChanged?(["state": newState])
        }
    }

    public func updateContainerSize(){
        guard let container = (controller?.view as? FixedHeightView) else { return }

        let width = container.frame.width //fittedsheets container width
        let bottomPad = initialBottomPad + Float(safeAreaBottom)

        container.intrinsicHeight = (initialHeight + safeAreaBottom)
        sheetController?.updateIntrinsicHeight()

        if(container.subviews.count == 0){ return }
        let child = container.subviews[0]
        RCTExecuteOnUIManagerQueue {
            let shadow = self.uiManager.shadowView(forReactTag: child.reactTag)
            if let ygnode = shadow?.yogaNode {
                YGNodeStyleSetWidth(ygnode, Float(width))
                YGNodeStyleSetPadding(ygnode, YGEdge.bottom, bottomPad)
                self.uiManager.setNeedsLayout()
            }
        }
    }
    
    override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
        self.controller!.view.addSubview(subview)
        touchHandler.attach(to: subview)
        // check our sheet view for existing padding
        // we will add safe area padding onto it, if necessary
        RCTExecuteOnUIManagerQueue {
            if let shadow = self.uiManager.shadowView(forReactTag: subview.reactTag) {
                self.initialBottomPad = [
                    0,
                    shadow.padding.value,
                    shadow.paddingVertical.value,
                    shadow.paddingBottom.value
                ].max() ?? 0
            }
        }
    }
    
    override func removeReactSubview(_ subview: UIView!) {
        super.removeReactSubview(subview)
        subview.removeFromSuperview()
        touchHandler.detach(from: subview)
    }

    @objc override func didSetProps(_ changedProps: [String]!) {
        if(!hasInitialized){ return }
        if(remountRequired){
            sheetController?.didDismiss = nil
            sheetController?.attemptDismiss(animated: false)
            isMounted = false
            self.assignController()
            remountRequired = false
        }
        self.syncSheetState()
    }
    
    private func syncSheetState() {
        let shouldBeMounted = (currentSizeIdx > 0)
        if(shouldBeMounted){
            if(!isMounted){ mountSheet() }

            // ensure sheet is in correct state
            let targetSize = actualSizes[currentSizeIdx - 1]
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
        guard let sheetController = self.sheetController else { return }
        guard let rvc = self.reactViewController() else { return }
        if(modal){
            sheetController.resize(to: actualSizes[currentSizeIdx - 1], animated: false)
            rvc.present(sheetController, animated: true)
        } else {
            guard let superview = self.superview else { return }
            sheetController.willMove(toParent: rvc)
            rvc.addChild(sheetController)
            superview.addSubview(sheetController.view)
            sheetController.didMove(toParent: rvc)
            sheetController.view.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                sheetController.view.topAnchor.constraint(equalTo: superview.topAnchor),
                sheetController.view.bottomAnchor.constraint(equalTo: superview.bottomAnchor),
                sheetController.view.leadingAnchor.constraint(equalTo: superview.leadingAnchor),
                sheetController.view.trailingAnchor.constraint(equalTo: superview.trailingAnchor)
            ])
            sheetController.animateIn(size: actualSizes[currentSizeIdx - 1], duration: 0.3)
        }
        self.isMounted = true
        self.notifyStateChange(idx: currentSizeIdx)
    }
    
    private func destroySheet() {
        sheetController?.attemptDismiss(animated: true)
        self.isMounted = false
        self.notifyStateChange(idx: 0)
    }

    /* Prop setters */
    @objc func setState (_ state: String) {
        if let idx = ["hidden","collapsed","expanded"].firstIndex(of: state) {
            self.currentSizeIdx = idx
        }
    }

    @objc func setCollapsedHeight (_ collapsedHeight: NSNumber) {
        let val = CGFloat(truncating: collapsedHeight)
        self.actualSizes[0] = val > 0 ? .fixed(val) : .intrinsic
    }
    
    @objc func setMaxSheetWidth (_ maxSheetWidth: NSNumber) {
        let val = CGFloat(truncating: maxSheetWidth)
        self.maxWidth = val > 0 ? val : nil
        self.remountRequired = true
    }

    @objc func setModal(_ useModal: Bool) {
        self.modal = useModal
        self.remountRequired = true
    }

    @objc func setHideable (_ hideable: Bool) {
        self.hideable = hideable
        sheetController?.dismissOnPull = hideable
    }
    
    @objc func setTapToDismissModal (_ tapToDismissModal: Bool) {
        self.tapToDismissModal = tapToDismissModal
        sheetController?.dismissOnOverlayTap = self.tapToDismissModal
    }

    @objc func setUseSafeArea(_ useSafeArea: Bool) {
        if(useSafeArea){
            var window: UIWindow? = nil
            if #available(iOS 13.0, *) {
                window = UIApplication.shared.windows.first
            } else {
                window = UIApplication.shared.keyWindow
            }
            self.safeAreaBottom = window?.safeAreaInsets.bottom ?? 0
        } else {
            self.safeAreaBottom = 0
        }
        if(hasInitialized){ self.updateContainerSize() }
    }


    @objc func setOnStateChanged (_ onStateChanged: @escaping RCTBubblingEventBlock) {
        self.onStateChanged = onStateChanged
    }

    @objc func setOverlayColor (_ color: UIColor) {
        self.overlayColor = color.withAlphaComponent(self.overlayColor.cgColor.alpha)
        sheetController?.overlayColor = self.overlayColor
    }

    @objc func setOverlayOpacity (_ opacity: NSNumber) {
        self.overlayColor = self.overlayColor.withAlphaComponent(CGFloat(truncating: opacity))
        sheetController?.overlayColor = self.overlayColor
    }
    
    @objc func updateStyle(json: Any?){
        guard let config = json as? [String: Any] else { return }
        for (key, value) in config {
            switch key {
            case "pullBarHeight":
                self.pullBarHeight = RCTConvert.cgFloat(value)
                self.remountRequired = true
            case "presentingViewCornerRadius":
                self.presentingViewCornerRadius = RCTConvert.cgFloat(value)
                self.remountRequired = true
            case "shouldExtendBackground":
                self.shouldExtendBackground = RCTConvert.bool(value)
                self.remountRequired = true
            case "useFullScreenMode":
                self.useFullScreenMode = RCTConvert.bool(value)
                self.remountRequired = true
            case "shrinkPresentingViewController":
                self.shrinkPresentingViewController = RCTConvert.bool(value)
                self.remountRequired = true
            case "gripSize":
                let gripSize = value as! [String: NSNumber]
                let width: Int = Int(truncating: gripSize["width"] ?? 0)
                let height: Int = Int(truncating: gripSize["height"] ?? 0)
                self.gripSize = CGSize(width: width, height: height)
                sheetController?.gripSize = self.gripSize
            case "gripColor":
                self.gripColor = RCTConvert.uiColor(value)
                sheetController?.gripColor = self.gripColor
            case "cornerRadius":
                self.cornerRadius = RCTConvert.cgFloat(value)
                sheetController?.cornerRadius = self.cornerRadius
            case "minimumSpaceAbovePullBar":
                self.minimumSpaceAbovePullBar = RCTConvert.cgFloat(value)
                sheetController?.minimumSpaceAbovePullBar = self.minimumSpaceAbovePullBar
            case "pullBarBackgroundColor":
                self.pullBarBackgroundColor = RCTConvert.uiColor(value)
                sheetController?.pullBarBackgroundColor = self.pullBarBackgroundColor
            case "treatPullBarAsClear":
                self.treatPullBarAsClear = RCTConvert.bool(value)
                sheetController?.treatPullBarAsClear = self.treatPullBarAsClear
            case "allowPullingPastMaxHeight":
                self.allowPullingPastMaxHeight = RCTConvert.bool(value)
                sheetController?.allowPullingPastMaxHeight = self.allowPullingPastMaxHeight
            case "contentBackgroundColor":
                self.contentBackgroundColor = RCTConvert.uiColor(value)
                sheetController?.contentBackgroundColor = self.contentBackgroundColor
            default: return
            }
        }
    }
}

extension Collection {
    subscript (safe index: Index) -> Element? {
        return indices.contains(index) ? self[index] : nil
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
