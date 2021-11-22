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

    let primaryView: PullUpView
    var lastWidth: CGFloat = 0

    init(target: PullUpView){
        self.primaryView = target
        super.init(nibName: nil, bundle: nil)
        self.view = FixedHeightView()
    }

    required init?(coder: NSCoder){
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLayoutSubviews(){
        super.viewDidLayoutSubviews()
        let size = CGSize(
            width: view.frame.width,
            height: primaryView.bounds.height
        )
        if(lastWidth == size.width){ return }

        (view as! FixedHeightView).intrinsicHeight = size.height
        let child = self.view.subviews[0]
        primaryView.bridge.uiManager?.setSize(size, for: child)
        lastWidth = size.width
    }
}

@objc(PullUpView)
class PullUpView: UIView {
    /* Internal state */
    public var bridge: RCTBridge
    var touchHandler: RCTTouchHandler
    var controller: PullUpViewController?
    var sheetController: SheetViewController? = nil
    var hasInitialized: Bool = false
    var isMounted: Bool = false
    var ignoreNextSizeChange: Bool = false
    var remountRequired: Bool = false
    /* Internal props */
    var currentSizeIdx: Int = 0 //via `state` prop
    var actualSizes: Array<SheetSize> = [ .fixed(0), .intrinsic, .intrinsic]
    var hideable: Bool = true
    var collapsible: Bool = true
    var modal: Bool = false
    var onStateChanged: RCTDirectEventBlock? = nil
    /* FittedSheets props */
    var tapToDismissModal: Bool = true
    var maxWidth: CGFloat? = nil
    /* FittedSheets styling (controller) */
    var gripSize: CGSize = CGSize(width: 50, height: 6)
    var gripColor: UIColor = UIColor(white: 0.868, alpha: 1)
    var cornerRadius: CGFloat = 20
    var minimumSpaceAbovePullBar: CGFloat = 0
    var pullBarBackgroundColor: UIColor = UIColor.clear
    var treatPullBarAsClear: Bool = false
    var allowPullingPastMaxHeight: Bool = false
    var contentBackgroundColor: UIColor = UIColor.white
    var overlayColor: UIColor = UIColor(white: 0, alpha: 0.5)
    /* FittedSheets styling (options, requires remount) */
    var pullBarHeight: CGFloat = 24
    var presentingViewCornerRadius: CGFloat = 20
    var shouldExtendBackground: Bool = true
    var useFullScreenMode: Bool = false
    var shrinkPresentingViewController: Bool = false
    var horizontalPadding: CGFloat = 0

    init(bridge: RCTBridge){
        self.bridge = bridge
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
            horizontalPadding: self.horizontalPadding,
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
        self.controller!.view.addSubview(subview)
        touchHandler.attach(to: subview)
    }
    
    override func removeReactSubview(_ subview: UIView!) {
        super.removeReactSubview(subview)
        subview.removeFromSuperview()
        touchHandler.detach(from: subview)
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
        let shouldBeMounted = (!modal || currentSizeIdx != 0)
        if(shouldBeMounted){
            if(!isMounted){ mountSheet() }

            // ensure available sheet sizes are up-to-date
            var clone = actualSizes
            if(!collapsible){ clone[1] = .intrinsic }
            if(!hideable){ clone[0] = clone[1] }
            sheetController?.sizes = clone

            // ensure sheet is in correct state
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
        if(modal) {
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

    /* Prop setters */
    @objc func setState (_ state: String) {
        if let idx = ["hidden","collapsed","expanded"].firstIndex(of: state) {
            self.currentSizeIdx = idx
        }
    }

    @objc func setCollapsedHeight (_ collapsedHeight: NSNumber) {
        actualSizes[1] = .fixed(CGFloat(truncating: collapsedHeight))
    }
    
    @objc func setMaxWidth (_ maxWidth: NSNumber) {
        self.maxWidth = CGFloat(truncating: maxWidth)
        self.remountRequired = true
    }

    @objc func setModal(_ useModal: Bool) {
        self.modal = useModal
        self.remountRequired = true
    }

    @objc func setCollapsible (_ collapsible: Bool) {
        self.collapsible = collapsible
    }

    @objc func setHideable (_ hideable: Bool) {
        self.hideable = hideable
    }
    
    @objc func setTapToDismissModal (_ tapToDismissModal: Bool) {
        self.tapToDismissModal = tapToDismissModal
        sheetController?.dismissOnOverlayTap = self.tapToDismissModal
    }

    @objc func setOnStateChanged (_ onStateChanged: @escaping RCTBubblingEventBlock) {
        self.onStateChanged = onStateChanged
    }
    
    @objc func updateStyle(json: Any?){
        guard let config = json as? [String: Any] else { return }
        for (key, value) in config {
            switch key {
            case "pullBarHeight":
                self.pullBarHeight = CGFloat(truncating: value as! NSNumber)
                self.remountRequired = true
            case "presentingViewCornerRadius":
                self.presentingViewCornerRadius = CGFloat(truncating: value as! NSNumber)
                self.remountRequired = true
            case "shouldExtendBackground":
                self.shouldExtendBackground = value as! Bool
                self.remountRequired = true
            case "useFullScreenMode":
                self.useFullScreenMode = value as! Bool
                self.remountRequired = true
            case "shrinkPresentingViewController":
                self.shrinkPresentingViewController = value as! Bool
                self.remountRequired = true
            case "horizontalPadding":
                self.horizontalPadding = CGFloat(truncating: value as! NSNumber)
                self.remountRequired = true
            case "gripSize":
                let gripSize = value as! [String: NSNumber]
                let width: Int = Int(truncating: gripSize["width"] ?? 0)
                let height: Int = Int(truncating: gripSize["height"] ?? 0)
                self.gripSize = CGSize(width: width, height: height)
                sheetController?.gripSize = self.gripSize
            case "gripColor":
                self.gripColor = UIColor(ciColor: CIColor(string: value as! String))
                sheetController?.gripColor = self.gripColor
            case "cornerRadius":
                self.cornerRadius = CGFloat(truncating: value as! NSNumber)
                sheetController?.cornerRadius = self.cornerRadius
            case "minimumSpaceAbovePullBar":
                self.minimumSpaceAbovePullBar = CGFloat(truncating: value as! NSNumber)
                sheetController?.minimumSpaceAbovePullBar = self.minimumSpaceAbovePullBar
            case "pullBarBackgroundColor":
                self.pullBarBackgroundColor = UIColor(ciColor: CIColor(string: value as! String))
                sheetController?.pullBarBackgroundColor = self.pullBarBackgroundColor
            case "treatPullBarAsClear":
                self.treatPullBarAsClear = value as! Bool
                sheetController?.treatPullBarAsClear = self.treatPullBarAsClear
            case "allowPullingPastMaxHeight":
                self.allowPullingPastMaxHeight = value as! Bool
                sheetController?.allowPullingPastMaxHeight = self.allowPullingPastMaxHeight
            case "contentBackgroundColor":
                self.contentBackgroundColor = UIColor(ciColor: CIColor(string: value as! String))
                sheetController?.contentBackgroundColor = self.contentBackgroundColor
            case "overlayColor":
                self.overlayColor = UIColor(ciColor: CIColor(string: value as! String))
                sheetController?.overlayColor = self.overlayColor
            default: return
            }
        }
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
