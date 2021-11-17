package com.reactnativepullups

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.RelativeLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.*
import com.facebook.react.common.MapBuilder
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.google.android.material.bottomsheet.BottomSheetBehavior


class PullUpsViewManager : ViewGroupManager<CoordinatorLayout>() {

  override fun getName() = "RNPullUpView"
  
  private lateinit var context: ThemedReactContext
  private lateinit var contents: RelativeLayout
  private lateinit var behavior: BottomSheetBehavior<*>
  private var state: BottomSheetState = BottomSheetState.COLLAPSED

  enum class BottomSheetState(val str: String, val nativeState: Int){
    EXPANDED("expanded", BottomSheetBehavior.STATE_EXPANDED),
    COLLAPSED("collapsed", BottomSheetBehavior.STATE_COLLAPSED),
    HIDDEN("hidden", BottomSheetBehavior.STATE_HIDDEN);
  }

  override fun createViewInstance(reactContext: ThemedReactContext): CoordinatorLayout {
    context = reactContext
    var view = LayoutInflater.from(reactContext).inflate(R.layout.bottom_sheet, null) as CoordinatorLayout
    contents = view.findViewById(R.id.contents) as RelativeLayout
    behavior = BottomSheetBehavior.from(contents).apply {
      addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
        override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
        override fun onStateChanged(bottomSheet: View, newState: Int) {
          updateState(matchState(newState))
        }
      })
      setHalfExpandedRatio(0.9999999f)
      setFitToContents(true)
      setHideable(true)
      setSkipCollapsed(false)
      setPeekHeight(PixelUtil.toPixelFromDIP(120.0).toInt())
    }
    return view
  }

  @ReactProp(name = "hideable")
  fun setHideable(parent: CoordinatorLayout, hideable: Boolean){
    behavior.setHideable(hideable)
  }

  @ReactProp(name = "collapsible")
  fun setCollapsible(parent: CoordinatorLayout, collapsible: Boolean){
    behavior.setSkipCollapsed(!collapsible)
  }

  @ReactProp(name = "peekHeight")
  fun setPeekHeight(parent: CoordinatorLayout, height: Double){
    behavior.setPeekHeight(PixelUtil.toPixelFromDIP(height).toInt())
  }

  @ReactProp(name = "state")
  fun setSheetState(parent: CoordinatorLayout, stateStr: String?) {
    matchState(stateStr!!)?.let {
      if(behavior.state != it.nativeState){
        behavior.state = it.nativeState
      }
      updateState(it)
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
      //Log.d("PULLUPS", "InternalState: " + state.str)
      context
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit("BottomSheetStateChange", state.str)
    }
  }

  /* Override ViewGroupManager funcs to handle child views properly */
  override fun addView(parent: CoordinatorLayout?, child: View?, index: Int)
    = contents.addView(child, index)

  override fun removeAllViews(parent: CoordinatorLayout)
    = contents.removeAllViews()

  override fun removeViewAt(parent: CoordinatorLayout, index: Int)
    = contents.removeViewAt(index)

  override fun getChildAt(parent: CoordinatorLayout, index: Int)
    = contents.getChildAt(index)

  override fun getChildCount(parent: CoordinatorLayout)
    = contents.childCount

}