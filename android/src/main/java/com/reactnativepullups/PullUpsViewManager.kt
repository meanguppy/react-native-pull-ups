package com.reactnativepullups

import android.content.DialogInterface
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RelativeLayout
import android.os.Bundle
import android.util.Log
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.*
import com.facebook.react.common.MapBuilder
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog

private const val STATE_CHANGE_EVENT_NAME = "BottomSheetStateChange"

class PullUpsViewManager : ViewGroupManager<CoordinatorLayout>() {

  override fun getName() = "RNPullUpView"

  private lateinit var context: ThemedReactContext

  private lateinit var container: RelativeLayout
  private lateinit var bottomSheet: InlineShrinkingLayout
  private lateinit var dialogContent: DialogShrinkingLayout
  private var content: View? = null

  private lateinit var dialog: BottomSheetDialog
  private lateinit var behavior1: BottomSheetBehavior<*>
  private lateinit var behavior2: BottomSheetBehavior<*>

  private var dialogMode: Boolean = false
  private var state: BottomSheetState = BottomSheetState.COLLAPSED

  enum class BottomSheetState(val str: String, val nativeState: Int){
    EXPANDED("expanded", BottomSheetBehavior.STATE_EXPANDED),
    COLLAPSED("collapsed", BottomSheetBehavior.STATE_COLLAPSED),
    HIDDEN("hidden", BottomSheetBehavior.STATE_HIDDEN);
  }

  override fun createViewInstance(reactContext: ThemedReactContext): CoordinatorLayout {
    context = reactContext
    var view = LayoutInflater.from(reactContext).inflate(
      R.layout.bottom_sheet,
      null
    ) as CoordinatorLayout

    container = view.findViewById(R.id.container)
    bottomSheet = view.findViewById(R.id.bottomSheet)

    dialog = BottomSheetDialog(reactContext)
    dialog.setOnCancelListener(object : DialogInterface.OnCancelListener {
      override fun onCancel(info: DialogInterface){
        updateState(BottomSheetState.HIDDEN)
      }
    })
    dialogContent = DialogShrinkingLayout(context);
    dialog.setContentView(dialogContent)

    behavior1 = BottomSheetBehavior.from(bottomSheet)
    behavior2 = dialog.behavior
    initBehavior(behavior1)
    initBehavior(behavior2)

    return view
  }

  override fun addView(parent: CoordinatorLayout?, child: View?, index: Int) {
    // When Quick Reload is triggered during RN development it does not tear down native views.
    // This means we need to remove any existing children when a new child is passed, otherwise
    // they can add to the same root infinitely.
    if (container.childCount + bottomSheet.childCount > 1) {
      container.removeAllViews()
      bottomSheet.removeAllViews()
    }
    when (container.childCount) {
      0 -> container.addView(child)
      1 -> {
        content = child
        bottomSheet.addView(child)
      }
    }
  }

  @ReactProp(name = "dialog")
  fun setDialogMode(parent: CoordinatorLayout, enabled: Boolean){
    if(dialogMode == enabled) return

    detachSelf(bottomSheet)
    if(enabled){
      if(state != BottomSheetState.HIDDEN){
        presentDialog()
      }
    } else {
      detachSelf(content)
      bottomSheet.addView(content)
      parent.addView(bottomSheet, 1)
    }

    dialogMode = enabled
  }

  @ReactProp(name = "hideable")
  fun setHideable(parent: CoordinatorLayout, hideable: Boolean){
    behavior1.setHideable(hideable)
    behavior2.setHideable(hideable)
  }

  @ReactProp(name = "collapsible")
  fun setCollapsible(parent: CoordinatorLayout, collapsible: Boolean){
    behavior1.setSkipCollapsed(!collapsible)
    behavior2.setSkipCollapsed(!collapsible)
  }

  @ReactProp(name = "expandedOffset")
  fun setExpandedOffset(parent: CoordinatorLayout, offset: Int){
    behavior1.setExpandedOffset(offset)
    behavior2.setExpandedOffset(offset)
  }

  @ReactProp(name = "peekHeight")
  fun setPeekHeight(parent: CoordinatorLayout, height: Int){
    behavior1.setPeekHeight(height)
    behavior2.setPeekHeight(height)
  }

  @ReactProp(name = "state")
  fun setSheetState(parent: CoordinatorLayout, newState: String?) {
    newState?.let {
      updateState(matchState(it))
    }
  }

  private fun presentDialog(){
    detachSelf(content)
    dialogContent.addView(content)
    dialog.setContentView(dialogContent)
    dialog.show()
  }

  private fun detachSelf(view: View?){
    (view?.parent as ViewGroup?)?.let {
      it.removeView(view)
    }
  }

  private fun initBehavior(target: BottomSheetBehavior<*>){
    target.addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
      override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
      override fun onStateChanged(bottomSheet: View, newState: Int) {
        updateState(matchState(newState))
      }
    })
    target.setHalfExpandedRatio(0.999999f) //TODO: possibly expose this through a different prop
    target.setFitToContents(true)
  }

  private fun matchState(sheetState: Int) = when (sheetState) {
    BottomSheetBehavior.STATE_EXPANDED -> BottomSheetState.EXPANDED
    BottomSheetBehavior.STATE_COLLAPSED -> BottomSheetState.COLLAPSED
    BottomSheetBehavior.STATE_HIDDEN -> BottomSheetState.HIDDEN
    else -> null
  }

  private fun matchState(sheetState: String) = try {
    BottomSheetState.valueOf(sheetState.toUpperCase())
  } catch(e: IllegalArgumentException){
    null
  }

  private fun updateState(newState: BottomSheetState?){
    newState?.let {
      if(state == newState) return
      var wasHidden = (state == BottomSheetState.HIDDEN)

      state = newState
      behavior1.state = newState.nativeState

      // never set dialog's behavior to HIDDEN, makes it buggy. Instead, dismiss dialog
      if(state != BottomSheetState.HIDDEN){
        behavior2.state = newState.nativeState
      }
      if(dialogMode && wasHidden){
        presentDialog()
      }

      context
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit(STATE_CHANGE_EVENT_NAME, state.str)
    }
  }

}