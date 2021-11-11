package com.reactnativepullups

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.RelativeLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.*
import com.facebook.react.common.MapBuilder
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.google.android.material.bottomsheet.BottomSheetBehavior

private const val STATE_CHANGE_EVENT_NAME = "BottomSheetStateChange"

class PullUpsViewManager : ViewGroupManager<CoordinatorLayout>() {

  override fun getName() = "RNPullUpView"

  private lateinit var context: ThemedReactContext
  private lateinit var container: RelativeLayout
  private lateinit var bottomSheet: CoordinatorLayout
  private lateinit var behavior: BottomSheetBehavior<CoordinatorLayout>
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
    behavior = BottomSheetBehavior.from(bottomSheet).apply {
      addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
        override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
        override fun onStateChanged(bottomSheet: View, newState: Int) {
          updateState(matchState(newState))
        }
      })
      setHalfExpandedRatio(0.999999f) //TODO: possibly expose this through a different prop
      setFitToContents(true)
    }

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
      else -> bottomSheet.addView(child)
    }
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

  @ReactProp(name = "dialog")
  fun setDialog(parent: CoordinatorLayout, useDialog: Boolean){
    var children = parent.childCount
    if(useDialog && children > 1){
      parent.removeView(bottomSheet)
    }
    if(!useDialog && children == 1){
      parent.addView(bottomSheet, 1)
    }
  }

  @ReactProp(name = "state")
  fun setSheetState(parent: CoordinatorLayout, newState: String?) {
    newState?.let {
      updateState(matchState(it))
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
      state = newState
      behavior.state = state.nativeState
      context
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit(STATE_CHANGE_EVENT_NAME, state.str)
    }
  }

}
