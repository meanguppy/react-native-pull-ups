package com.reactnativepullups

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.view.MotionEvent
import android.view.ViewGroup
import android.widget.RelativeLayout
import android.widget.ScrollView
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.google.android.material.bottomsheet.BottomSheetBehavior

class ScrollableBottomSheetBehavior<T : ViewGroup>: BottomSheetBehavior<T> {

  constructor() : super()
  constructor(context: Context, attrs: AttributeSet) : super(context, attrs)

  override fun onInterceptTouchEvent(parent: CoordinatorLayout, child: T, event: MotionEvent): Boolean {
    if(getState() == BottomSheetBehavior.STATE_EXPANDED){
      val content = child.getChildAt(0) as ViewGroup
      for(i in 0 until content.childCount){
        val contentChild = content.getChildAt(i)
        if(contentChild is ScrollView && contentChild.scrollY > 0){
          return false
        }
      }
    }
    return super.onInterceptTouchEvent(parent, child, event)
  }

}