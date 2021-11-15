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
import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.modal.ReactModalHostManager
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.slider.LabelFormatter


class PullUpsViewManager : ReactModalHostManager() {

  override fun getName() = "RNPullUpView"

  override fun createViewInstance(reactContext: ThemedReactContext): ReactModalHostView {
    Log.d("PULLUPS", "Creating view")
    return PullUpsModalView(reactContext)
  }

}