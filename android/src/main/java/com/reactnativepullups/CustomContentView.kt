package com.reactnativepullups

import android.util.AttributeSet
import android.content.Context
import android.widget.RelativeLayout

class CustomContentView : RelativeLayout {

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
        MeasureSpec.makeMeasureSpec(child.measuredHeight, MeasureSpec.EXACTLY)
    )
  }

}