package com.pullups

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp


class PullUpViewManager : ViewGroupManager<PullUpView>() {

  override fun getName() = "RNPullUpView"

  override fun createViewInstance(reactContext: ThemedReactContext): PullUpView {
    return LayoutInflater.from(reactContext).inflate(R.layout.bottom_sheet, null) as PullUpView
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
    return MapBuilder.of("onStateChanged", MapBuilder.of("registrationName", "onStateChanged"))
  }

  @ReactProp(name = "hideable")
  fun setHideable(target: PullUpView, hideable: Boolean){
    target.setHideable(hideable)
  }

  @ReactProp(name = "collapsedHeight")
  fun setCollapsedHeight(target: PullUpView, height: Double){
    target.setCollapsedHeight(height)
  }

  @ReactProp(name = "state")
  fun setSheetState(target: PullUpView, stateStr: String?) {
    target.setSheetState(stateStr)
  }

  @ReactProp(name = "maxSheetWidth")
  fun setMaxWidth(target: PullUpView, maxWidth: Double){
    target.setMaxWidth(maxWidth)
  }

  /* Override to handle child views properly */
  override fun addView(target: PullUpView, child: View?, index: Int)
    = target.contents.addView(child, index)

  override fun removeAllViews(target: PullUpView)
    = target.contents.removeAllViews()

  override fun removeViewAt(target: PullUpView, index: Int)
    = target.contents.removeViewAt(index)

  override fun getChildAt(target: PullUpView, index: Int)
    = target.contents.getChildAt(index)

  override fun getChildCount(target: PullUpView)
    = target.contents.childCount

}