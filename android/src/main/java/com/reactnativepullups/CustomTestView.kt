package com.reactnativepullups

import android.util.Log
import android.util.AttributeSet
import android.content.Context
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.MotionEvent
import android.widget.RelativeLayout
import android.widget.FrameLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.widget.NestedScrollView
import com.google.android.material.bottomsheet.BottomSheetBehavior

import android.graphics.*
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.uimanager.events.TouchEvent
import com.facebook.react.uimanager.events.TouchEventCoalescingKeyHelper
import com.facebook.react.uimanager.events.TouchEventType

class CustomTestView : RelativeLayout {

  constructor(context: Context) : super(context)
  constructor(context: Context, attrs: AttributeSet) : super(context, attrs)
  constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr)

  private val mEventDispatcher: EventDispatcher
  init {
    val uiManager = (context as ReactContext).getNativeModule(UIManagerModule::class.java)
    mEventDispatcher = uiManager!!.eventDispatcher
  }
  
  override fun onTouchEvent(ev: MotionEvent) = false
  override fun onInterceptTouchEvent(ev: MotionEvent) = true
  override fun dispatchTouchEvent(ev: MotionEvent): Boolean {
    passTouchEventToViewAndChildren((parent as ViewGroup).parent as ViewGroup, ev)
    return false
  }

  private fun passTouchEventToViewAndChildren(v: ViewGroup, ev: MotionEvent) {
    val childrenCount = v.childCount
    for (i in 0 until childrenCount) {
      val child = v.getChildAt(i)
      if (child.id > 0 && isViewInsideTouch(ev, child) && child.visibility == View.VISIBLE) {
        try {
          Log.d("PULLUPS", "Dispatch event on " + child)
          mEventDispatcher.dispatchEvent(
              TouchEvent.obtain(
                  child.id,
                  TouchEventType.START,
                  ev,
                  ev.eventTime,
                  ev.x,
                  ev.y,
                  TouchEventCoalescingKeyHelper()
              )
          )
        } catch (e: Exception) {}
        if (child is ViewGroup && child.childCount > 0) {
          passTouchEventToViewAndChildren(child, ev)
        }
      }
    }
  }

  private fun isViewInsideTouch(event: MotionEvent, view: View): Boolean {
    val viewRegion = Region()
    val xy = IntArray(2)
    view.getLocationInWindow(xy)
    val x = xy[0]
    val y = xy[1]
    val rect = Rect(x, y, x + view.width, y + view.height)
    viewRegion.set(rect)
    return viewRegion.contains(event.rawX.toInt(), event.rawY.toInt())
  }

}