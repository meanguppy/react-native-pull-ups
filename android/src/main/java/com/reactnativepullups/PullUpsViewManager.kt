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
import com.google.android.material.slider.LabelFormatter

private const val STATE_CHANGE_EVENT_NAME = "BottomSheetStateChange"

class PullUpsViewManager : ViewGroupManager<CoordinatorLayout>() {

  override fun getName() = "RNPullUpView"

  private lateinit var context: ThemedReactContext

  private lateinit var container: RelativeLayout
  private lateinit var content: CustomCoordinatorLayout
  private lateinit var dialog: BottomSheetDialog
  private lateinit var behavior: BottomSheetBehavior<*>

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
    content = view.findViewById(R.id.content)

    dialog = BottomSheetDialog(reactContext)
    dialog.setOnCancelListener(object : DialogInterface.OnCancelListener {
      override fun onCancel(info: DialogInterface){
        updateState(BottomSheetState.HIDDEN)
      }
    })

    behavior = dialog.behavior.apply {
      addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
        override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
        override fun onStateChanged(bottomSheet: View, newState: Int) {
          updateState(matchState(newState))
        }
      })
      setHalfExpandedRatio(0.999999f) //TODO: possibly expose this through a different prop
      setFitToContents(true)
    }

    contentUsesBehavior(true)

    return view
  }

  override fun addView(parent: CoordinatorLayout?, child: View?, index: Int) {
    // When Quick Reload is triggered during RN development it does not tear down native views.
    // This means we need to remove any existing children when a new child is passed, otherwise
    // they can add to the same root infinitely.
    if (container.childCount + content.childCount > 1) {
      container.removeAllViews()
      content.removeAllViews()
    }
    when (container.childCount) {
      0 -> container.addView(child)
      1 -> content.addView(child)
    }
  }

  @ReactProp(name = "dialog")
  fun setDialogMode(parent: CoordinatorLayout, enabled: Boolean){
    if(dialogMode == enabled) return

    if(enabled){
      parent.removeView(content)
      contentUsesBehavior(false)
      dialog.setContentView(content)
      if(state != BottomSheetState.HIDDEN){
        dialog.show()
      }
    } else {
      // this use-case is questionable.. implementing is tedious
      throw IllegalStateException("Cannot switch to inline mode after using dialog mode")
    }

    dialogMode = enabled
  }

  @ReactProp(name = "hideable")
  fun setHideable(parent: CoordinatorLayout, hideable: Boolean){
    behavior.setHideable(hideable)
  }

  @ReactProp(name = "collapsible")
  fun setCollapsible(parent: CoordinatorLayout, collapsible: Boolean){
    behavior.setSkipCollapsed(!collapsible)
  }

  @ReactProp(name = "expandedOffset")
  fun setExpandedOffset(parent: CoordinatorLayout, offset: Int){
    behavior.setExpandedOffset(offset)
  }

  @ReactProp(name = "peekHeight")
  fun setPeekHeight(parent: CoordinatorLayout, height: Int){
    behavior.setPeekHeight(height)
  }

  @ReactProp(name = "state")
  fun setSheetState(parent: CoordinatorLayout, stateStr: String?) {
    if(stateStr != null) matchState(stateStr)?.let {
      var needsNativeUpdate = (behavior.state != it.nativeState)
      var allowNativeUpdate = (!dialogMode || it != BottomSheetState.HIDDEN)
      if(needsNativeUpdate && allowNativeUpdate){
        behavior.state = it.nativeState
      }
      updateState(it)
    }
  }

  private fun contentUsesBehavior(enabled: Boolean){
    (content.layoutParams as CoordinatorLayout.LayoutParams).let {
      it.behavior = if(enabled) behavior else null
    }
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
      if(dialogMode && wasHidden) dialog.show()
      
      context
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit(STATE_CHANGE_EVENT_NAME, state.str)
    }
  }

}