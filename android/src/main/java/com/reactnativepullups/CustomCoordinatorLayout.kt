package com.reactnativepullups

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.PointerEvents

class CustomCoordinatorLayout : CoordinatorLayout, ReactPointerEventsView {

  constructor(context: Context) : super(context)
  constructor(context: Context, attrs: AttributeSet) : super(context, attrs)
  constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr)

  /* Allow React-Native touch events to pass through wrapping container */
  override fun getPointerEvents() = PointerEvents.BOX_NONE

}