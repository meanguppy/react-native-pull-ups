package com.reactnativepullups

import android.util.Log
import android.util.AttributeSet
import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.view.ViewOutlineProvider
import android.widget.RelativeLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.widget.NestedScrollView
import com.google.android.material.bottomsheet.BottomSheetBehavior

class InlineShrinkingLayout : CoordinatorLayout {

  constructor(context: Context) : super(context)
  constructor(context: Context, attrs: AttributeSet) : super(context, attrs)
  constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr)
  
  /* Sets the height of the layout to that of its first child's */
  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec)
    this.getChildAt(0)?.let {
      setMeasuredDimension(widthMeasureSpec, it.height)
    }
  }

}