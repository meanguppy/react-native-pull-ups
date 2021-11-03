package com.reactnativepullups

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.*
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.google.android.material.bottomsheet.BottomSheetBehavior


class PullUpsViewManager : ViewGroupManager<CoordinatorLayout>() {

  override fun getName() = "RNPullUpView"
  private lateinit var container: CoordinatorLayout
  private lateinit var bottomSheet: CoordinatorLayout
  private lateinit var bottomSheetBehavior: BottomSheetBehavior<CoordinatorLayout>

  enum class BottomSheetState {
    COLLAPSED,
    EXPANDED;

    fun toLowerCase() = this.toString().toLowerCase()
  }
  private var state: BottomSheetState = BottomSheetState.COLLAPSED

  override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> {
    return MapBuilder
      .builder<String, Any>()
      .put(
        "stateChanged",
        MapBuilder.of(
          "phasedRegistrationNames",
          MapBuilder.of("bubbled", "onSizeChange")))
      .build();
  }

  override fun createViewInstance(reactContext: ThemedReactContext): CoordinatorLayout {

    var view = LayoutInflater.from(reactContext).inflate(
      R.layout.bottom_sheet,
      null
    ) as CoordinatorLayout

    container = view.findViewById(R.id.container)
    bottomSheet = view.findViewById(R.id.bottomSheet)
    bottomSheetBehavior = BottomSheetBehavior.from(bottomSheet).apply {
      Log.d("coordinate", "Hello world 2");
      addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
        override fun onSlide(bottomSheet: View, slideOffset: Float) = Unit

        override fun onStateChanged(bottomSheet: View, newState: Int) {
          val state: BottomSheetState? = when (newState) {
            BottomSheetBehavior.STATE_EXPANDED -> BottomSheetState.EXPANDED
            BottomSheetBehavior.STATE_COLLAPSED -> BottomSheetState.COLLAPSED
            else -> null
          }
          state?.let {
            val event: WritableMap = Arguments.createMap()
            event.putString("state", state.toLowerCase())
            reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(
              view.id,
              "stateChanged",
              event)
          }
        }
      })
    }

    return view
  }

  @ReactProp(name = "sizes")
  fun setSizes(parent: CoordinatorLayout, sizes: ReadableArray) {
    print("Set sizes")
//    bottomSheetBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED)
  }

  override fun addView(parent: CoordinatorLayout?, child: View?, index: Int) {
    when (index) {
      0 -> { container.addView(child); Log.d("coordinate", "Hello world");}
      else -> { bottomSheet.addView(child); Log.d("coordinate", "Hello world 2"); }
    }


  }

  companion object {
    private const val STATE_CHANGE_EVENT_NAME = "BottomSheetStateChange"
  }
}
