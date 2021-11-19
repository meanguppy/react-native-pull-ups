import React, { useCallback } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  NativeEventEmitter,
  requireNativeComponent,
} from 'react-native';

const NativePullUp = requireNativeComponent('RNPullUpView');

/* `allowedSizes`: the user is allowed to drag the sheet to these sizes.
 * `actualSizes`: actual sizes that the code can resize the sheet to. */
function makeSizes({ height, collapsedHeight, modal, dismissable, hideable }){
  const expanded = height;
  const collapsed = collapsedHeight || expanded;

  /* In modal mode, only allow `hidden | expanded`.
   *  If the modal is not dismissable, or the sheet not hideable,
   *  enforce the expanded height at all times.
   * In persistent mode, allow `hidden | collapsed | expanded`.
   *  If the sheet is not hideable, the lowest possible state is collapsed. */
  const allowedSizes = modal
    ? [ (dismissable && hideable ? 0 : expanded), expanded, expanded ]
    : [ (hideable ? 0 : collapsed), collapsed, expanded ];

  const actualSizes = [ 0, collapsed, expanded ];

  return { allowedSizes, actualSizes };
}

const PullUp = (props) => {
  const { state, children, modal, inline, tapToDismissModal, onStateChanged } = props;

  const onNativeStateChanged = useCallback((evt) => {
    const { state: newState } = evt.nativeEvent;
    onStateChanged?.(newState);
  }, [onStateChanged]);

  const { allowedSizes, actualSizes } = makeSizes(props)

  return (
    <NativePullUp
      style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'red' }}
      state={state}
      allowedSizes={allowedSizes}
      actualSizes={actualSizes}
      useModalMode={modal}
      useInlineMode={inline}
      tapToDismissModal={tapToDismissModal}
      onStateChanged={onNativeStateChanged}
    >{ children }</NativePullUp>
  );
};

const styles = StyleSheet.create({
});

export default PullUp;
