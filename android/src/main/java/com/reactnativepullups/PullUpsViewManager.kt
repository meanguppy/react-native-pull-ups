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
  private lateinit var contents: CustomContentView
  private lateinit var behavior: BottomSheetBehavior<*>
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
    contents = view.findViewById(R.id.contents) as CustomContentView
    behavior = BottomSheetBehavior.from(contents)
    return view
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
        .emit(STATE_CHANGE_EVENT_NAME, state.str)
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

  override fun needsCustomLayoutForChildren() = false

}