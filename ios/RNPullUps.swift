//
//  RNPullUps.swift
//  react-native-pull-ups
//
//  Created by Thomas Hessler on 1/16/21.
//

import Foundation
import UIKit
import FittedSheets
import NotificationCenter

@objc(PullUpView)
class PullUpView : UIView {
    
    var pullUpVc: UIViewController = UIViewController()
    var sheetController: SheetViewController? = nil

    var sheetOptions: SheetOptions = SheetOptions()
    var pullBarHeight: CGFloat = 24
    var presentingViewCornerRadius: CGFloat = 20
    var shouldExtendBackground: Bool = true
    var setIntrinsicHeightOnNavigationControllers: Bool = false
    var useFullScreenMode: Bool = false
    var shrinkPresentingViewController: Bool = false
    var useInlineMode: Bool = true
    var horizontalPadding: CGFloat = 0
    var maxWidth: CGFloat? = nil
    var sizes: Array<SheetSize> = [.percent(0.25), .percent(0.50), .fullscreen]
    var gripSize: CGSize = CGSize(width: 50, height: 6)
    var gripColor: UIColor = UIColor(white: 0.868, alpha: 1)
    var cornerRadius: CGFloat = 20
    var minimumSpaceAbovePullBar: CGFloat = 0
    var pullBarBackgroundColor: UIColor = UIColor.clear
    var treatPullBarAsClear: Bool = false
    var dismissOnOverlayTap: Bool = false
    var dismissOnPull: Bool = false
    var allowPullingPastMaxHeight: Bool = false
    var autoAdjustToKeyboard: Bool = true
    var contentBackgroundColor: UIColor = UIColor.white
    var overlayColor: UIColor = UIColor(white: 0, alpha: 0.25)
    var allowGestureThroughOverlay: Bool = true
    var onSizeChange: RCTDirectEventBlock? = nil
    var show: Bool = true
    var isShown: Bool = false
    var isInit: Bool = true
    
    override init(frame: CGRect) {
        super.init(frame: frame);
        self.frame = frame;
        self.assignOptions()
        self.assignController()
        
        // Use this notificaiton for a viewDidLoad/init comparison in RN
        NotificationCenter.default.addObserver(self, selector: #selector(handleInit(notification:)), name: NSNotification.Name(rawValue: "RCTContentDidAppearNotification"), object: nil)
    }
    
    @objc func handleInit(notification: NSNotification) {
        self.showIfNecessary()
        self.isInit = false;
    }
    

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func assignOptions () {
        self.sheetOptions = SheetOptions(
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
            setIntrinsicHeightOnNavigationControllers: self.setIntrinsicHeightOnNavigationControllers,
            // Pulls the view controller behind the safe area top,
            // especially useful when embedding navigation controllers
            useFullScreenMode: self.useFullScreenMode,
            // Shrinks the presenting view controller,
            // similar to the native modal
            shrinkPresentingViewController: self.shrinkPresentingViewController,
            // Determines if using inline mode or not
            useInlineMode: self.useInlineMode,
            // Adds a padding on the left and right of the
            // sheet with this amount. Defaults to zero (no padding)
            horizontalPadding: self.horizontalPadding,
            // Sets the maximum width allowed for the sheet.
            // This defaults to nil and doesn't limit the width.
            maxWidth: self.maxWidth
        )
    }
    
    private func assignController () {
        let sheetController = SheetViewController(
            controller: self.pullUpVc,
            sizes: self.sizes,
            options: sheetOptions)
        
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
        sheetController.dismissOnOverlayTap = self.dismissOnOverlayTap
        
        // Disable the ability to pull down to dismiss the modal
        sheetController.dismissOnPull = self.dismissOnPull
        
        // Allow pulling past the maximum height and bounce back.
        // Defaults to true.
        sheetController.allowPullingPastMaxHeight = self.allowPullingPastMaxHeight
        
        // Automatically grow/move the sheet to accomidate the keyboard.
        // Defaults to true.
        sheetController.autoAdjustToKeyboard = self.autoAdjustToKeyboard
        
        // Color of the sheet anywhere the child view controller may not show (or is transparent),
        // such as behind the keyboard currently
        sheetController.contentBackgroundColor = self.contentBackgroundColor
        
        // Change the overlay color
        sheetController.overlayColor = self.overlayColor
        
        // For inline mode interaction
        sheetController.allowGestureThroughOverlay = self.allowGestureThroughOverlay
        
                
        sheetController.sizeChanged = self.sizeChanged
        
        sheetController.didDismiss = self.didDismiss
        
        self.sheetController = sheetController;
    }
    
    private func sizeChanged (vc: SheetViewController, size: SheetSize, newHeight: CGFloat) {
        let context = [ "height": newHeight, "isFullScreen": size == .fullscreen ] as [String : Any];
        if(self.onSizeChange != nil) {
            self.onSizeChange!(context)
        }
    }
    
    private func didDismiss (vc: SheetViewController) {
        self.isShown = false
    }
    
    override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
        self.pullUpVc.view.addSubview(subview)
    }
    
    override func removeReactSubview(_ subview: UIView!) {
        subview.removeFromSuperview()
        super.removeReactSubview(subview)
    }
    
   
    @objc func setPullBarHeight (_ height: NSNumber) {
        self.pullBarHeight = CGFloat(truncating: height)
    }
    
    @objc func setPresentingViewCornerRadius (_ radius: NSNumber) {
        self.presentingViewCornerRadius = CGFloat(truncating: radius)
    }
    
    @objc func setShouldExtendBackground (_ shouldExtendBackground: Bool) {
        self.shouldExtendBackground = shouldExtendBackground
    }
    
    @objc func setSetIntrinsicHeightOnNavigationControllers (_ setIntrinsicHeightOnNavigationControllers: Bool) {
        self.setIntrinsicHeightOnNavigationControllers = setIntrinsicHeightOnNavigationControllers
    }
    
    @objc func setUseFullScreenMode (_ useFullScreenMode: Bool) {
        self.useFullScreenMode = useFullScreenMode
    }
    
    @objc func setShrinkPresentingViewController (_ shrinkPresentingViewController: Bool) {
        self.shrinkPresentingViewController = shrinkPresentingViewController
    }
    
    @objc func setUseInlineMode (_ useInlineMode: Bool) {
        print("set use inline mode \(useInlineMode)")
        self.useInlineMode = useInlineMode
    }
    
    @objc func setHorizontalPadding (_ padding: NSNumber) {
        self.horizontalPadding = CGFloat(truncating: padding)
    }
    
    @objc func setMaxWidth (_ maxWidth: NSNumber) {
        self.maxWidth = CGFloat(truncating: maxWidth)
    }
    
    @objc func setSizes (_ sizes: NSArray) {
        self.sizes = sizes.map({ return calculateSize(size: $0 as! String)})
    }
    
    private func calculateSize (size: String) -> SheetSize {
        
        let percentageIndex = size.firstIndex(of: "%")
        let pixelIndex = size.firstIndex(of: Character("p"))
        let marginFromTopIdx = size.firstIndex(of: "^")
        let fullScreen = size == "fullscreen"
        let intrinsic = size == "intrinsic"
        
        if(percentageIndex != nil) {
            //Percentage
            guard let percentage = Float(size[..<percentageIndex!]) else { return .percent(0) }
            print("percentage \(percentage / 100)")
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
    
    @objc func setGripSize (_ gripSize: NSDictionary) {
        let width: Int = Int(gripSize.value(forKey: "width") as! String) ?? 0
        let height: Int = Int(gripSize.value(forKey: "height") as! String) ?? 0
        self.gripSize = CGSize(width: width, height: height)
    }
    
    @objc func setGripColor (_ gripColor: CGColor) {
        self.gripColor = UIColor(cgColor: gripColor)
    }
    
    @objc func setCornerRadius (_ cornerRadius: NSNumber) {
        self.cornerRadius = CGFloat(truncating: cornerRadius)
    }
    
    @objc func setMinimumSpaceAbovePullBar (_ minimumSpaceAbovePullBar: NSNumber) {
        self.minimumSpaceAbovePullBar = CGFloat(truncating: minimumSpaceAbovePullBar)
    }
    
    @objc func setPullBarBackgroundColor (_ pullBarBackgroundColor: CGColor) {
        self.pullBarBackgroundColor = UIColor(cgColor: pullBarBackgroundColor)
    }
    
    @objc func setTreatPullBarAsClear (_ treatPullBarAsClear: Bool) {
        self.treatPullBarAsClear = treatPullBarAsClear
    }
    
    @objc func setDismissOnOverlayTap (_ dismissOnOverlayTap: Bool) {
        self.dismissOnOverlayTap = dismissOnOverlayTap
    }
    
    @objc func setDismissOnPull (_ dismissOnPull: Bool) {
        self.dismissOnPull = dismissOnPull
    }
    
    @objc func setAllowPullingPastMaxHeight (_ allowPullingPastMaxHeight: Bool) {
        self.allowPullingPastMaxHeight = allowPullingPastMaxHeight
    }
    
    @objc func setAutoAdjustToKeyboard (_ autoAdjustToKeyboard: Bool) {
        self.autoAdjustToKeyboard = autoAdjustToKeyboard
    }
    
    @objc func setContentBackgroundColor (_ contentBackgroundColor: CGColor) {
        self.contentBackgroundColor = UIColor(cgColor: contentBackgroundColor)
    }
    
    @objc func setOverlayColor (_ overlayColor: CGColor) {
        self.overlayColor = UIColor(cgColor: overlayColor)
    }
    
    @objc func setAllowGestureThroughOverlay (_ allowGestureThroughOverlay: Bool) {
        self.allowGestureThroughOverlay = allowGestureThroughOverlay
    }
    
    @objc func setOnSizeChange (_ onSizeChange: @escaping RCTBubblingEventBlock) {
        self.onSizeChange = onSizeChange
    }
    
    @objc func setShow (_ show: Bool) {
        self.show = show
        if(!self.isInit) {
            self.showIfNecessary()
        }
    }
    
    @objc override func didSetProps(_ changedProps: [String]!) {
        let doesNotHaveShowPropChanged = changedProps.firstIndex(of: "show") == nil
        let hasInlineModeChanged = changedProps.firstIndex(of: "useInlineMode") != nil

        if(!self.isInit && self.show == true && doesNotHaveShowPropChanged) {
            //use old inline mode if it changed so we can dismiss properly
            self.hideSheet(inline: hasInlineModeChanged ? !self.useInlineMode : self.useInlineMode)
            self.assignOptions()
            self.assignController()
            self.showSheet(inline: self.useInlineMode)
        }
        
    }
    
    private func showIfNecessary () {
        if(self.show && (self.isShown == false)) {
            print("show the sheet")
            self.isShown = true
            self.assignOptions()
            self.assignController()
            showSheet(inline: self.useInlineMode)
        } else if (!self.show && (self.isShown == true)) {
            self.isShown = false
            hideSheet(inline: self.useInlineMode)
        }
    }
    
    private func showSheet (inline: Bool) {
        
        if(inline) {
            self.sheetController!.willMove(toParent: self.reactViewController())
            self.reactViewController().addChild(self.sheetController!)
            self.reactViewController().view.addSubview(self.sheetController!.view)
            self.sheetController!.didMove(toParent: self.reactViewController())

            self.sheetController!.view.translatesAutoresizingMaskIntoConstraints = false
            
            let constraints = [
                self.sheetController!.view.topAnchor.constraint(equalTo: self.reactViewController().view.topAnchor),
                self.sheetController!.view.bottomAnchor.constraint(equalTo: self.reactViewController().view.bottomAnchor),
                self.sheetController!.view.leadingAnchor.constraint(equalTo: self.reactViewController().view.leadingAnchor),
                self.sheetController!.view.trailingAnchor.constraint(equalTo: self.reactViewController().view.trailingAnchor)
            ]
            
            NSLayoutConstraint.activate(constraints)

            self.sheetController!.animateIn(size: self.sizes[0], duration: 0.3, completion: nil)
        } else {
            
            self.reactViewController().present(self.sheetController!, animated: true)
            
        }
        
    }
    
    private func hideSheet (inline: Bool) {
        if(inline) {
            self.sheetController!.animateOut()
        } else {
            self.reactViewController()!.dismiss(animated: true, completion: nil)
        }
    }
    
}


@objc(RNPullUpView)
class RNPullUpView: RCTViewManager {
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func view() -> UIView! {
        return PullUpView()
    }
}
