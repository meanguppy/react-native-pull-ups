package com.reactnativepullups

import android.util.Log
import android.util.AttributeSet
import android.content.Context
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.ViewOutlineProvider
import android.widget.RelativeLayout
import android.widget.FrameLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.widget.NestedScrollView
import com.google.android.material.bottomsheet.BottomSheetBehavior

class CustomCoordinatorLayout : CoordinatorLayout {

  constructor(context: Context) : super(context)
  constructor(context: Context, attrs: AttributeSet) : super(context, attrs)
  constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr)
  
  /* Sets the height of the layout to that of its first child's */
  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    var child = getChildAt(0)
    super.onMeasure(
      widthMeasureSpec,
      if(child == null)
        heightMeasureSpec
      else 
        MeasureSpec.makeMeasureSpec(child.height, MeasureSpec.EXACTLY)
    )
  }

}