package com.reactnativepullups

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.view.View
import android.widget.RelativeLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.google.android.material.bottomsheet.BottomSheetBehavior


class PullUpView : CoordinatorLayout, ReactPointerEventsView {

  constructor(context: Context) : super(context)
  constructor(context: Context, attrs: AttributeSet) : super(context, attrs)
  constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr)

  enum class BottomSheetState(val str: String, val nativeState: Int){
    EXPANDED("expanded", BottomSheetBehavior.STATE_EXPANDED),
    COLLAPSED("collapsed", BottomSheetBehavior.STATE_COLLAPSED),
    HIDDEN("hidden", BottomSheetBehavior.STATE_HIDDEN);
  }

  private var state: BottomSheetState = BottomSheetState.COLLAPSED
  lateinit var contents: RelativeLayout
    private set
  lateinit var behavior: BottomSheetBehavior<*>
    private set

  override fun onViewAdded(child: View){
    super.onViewAdded(child)
    contents = child as RelativeLayout
    behavior = BottomSheetBehavior.from(contents).apply {
      addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
        override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit
        override fun onStateChanged(bottomSheet: View, newState: Int) {
          updateState(matchState(newState))
        }
      })
      // virtually disables 'third' breakpoint
      setHalfExpandedRatio(0.9999999f)
      setFitToContents(true)
      setHideable(true)
      // default to no collapsed state
      setSkipCollapsed(true)
      setPeekHeight(Integer.MAX_VALUE)
    }
  }

  fun setHideable(hideable: Boolean){
    behavior.setHideable(hideable)
  }

  fun setCollapsedHeight(height: Double){
    var isValidHeight = (height > 0.0)
    behavior.setSkipCollapsed(!isValidHeight)
    behavior.setPeekHeight(
      if(isValidHeight) PixelUtil.toPixelFromDIP(height).toInt()
      else Integer.MAX_VALUE
    )
  }

  fun setSheetState(stateStr: String?) {
    matchState(stateStr!!)?.let {
      if(behavior.state != it.nativeState){
        // We want to allow hiding programmatically, even if
        // the hideable prop is set to false. Temporarily enable
        // and restore the actual value.
        var hideable = behavior.isHideable()
        behavior.setHideable(true)
        behavior.state = it.nativeState
        behavior.setHideable(hideable)
      }
      updateState(it)
    }
  }

  fun setMaxWidth(maxWidth: Double){
    behavior.setMaxWidth(
      if(maxWidth <= 0.0) -1
      else PixelUtil.toPixelFromDIP(maxWidth).toInt()
    )
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

      val args = Arguments.createMap()
      args.putString("state", newState.str)
      (context as ThemedReactContext)
        .getJSModule(RCTEventEmitter::class.java)
        .receiveEvent(id, "onStateChanged", args)
    }
  }

  /* Allow React-Native touch events to pass through wrapping container */
  override fun getPointerEvents() = PointerEvents.BOX_NONE

}