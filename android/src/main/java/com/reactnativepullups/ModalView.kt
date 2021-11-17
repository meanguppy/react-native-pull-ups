package com.reactnativepullups

import android.content.Context
import com.facebook.react.views.modal.ReactModalHostView


/* Inherit from the React-Native Modal.
 * Keeping it here incase we want to override some behavior. */
class ModalView : ReactModalHostView {

  constructor(context: Context) : super(context)

}

