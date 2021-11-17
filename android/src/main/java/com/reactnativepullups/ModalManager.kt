package com.reactnativepullups

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.modal.ReactModalHostView
import com.facebook.react.views.modal.ReactModalHostManager


class ModalManager : ReactModalHostManager() {

  override fun getName() = "RNPullUpModal"

  override fun createViewInstance(reactContext: ThemedReactContext): ReactModalHostView {
    return ModalView(reactContext)
  }

}