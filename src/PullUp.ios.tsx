import React, { useCallback } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  NativeEventEmitter,
  requireNativeComponent,
} from 'react-native';


const NativePullUp = requireNativeComponent('RNPullUpView');
const ZERO = '0px';

const PullUp = (props) => {
  const { state, height, collapsedHeight, modal, collapsible, hideable, children, onStateChanged } = props;

  const onNativeStateChanged = useCallback((evt) => {
    const { state: newState } = evt.nativeEvent;
    onStateChanged?.(newState);
  }, [onStateChanged]);

  const sizes = [
    ZERO,
    (collapsedHeight ? (modal ? `${height}px` : `${collapsedHeight}px`) : ZERO),
    `${height}px`,
  ];

  return (
    <NativePullUp
      style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'red' }}
      state={state}
      sizes={sizes}
      useInlineMode={!modal}
      dismissOnPull={modal}
      dismissOnOverlayTap={modal}
      onStateChanged={onNativeStateChanged}
    >{ children }</NativePullUp>
  );
};

const styles = StyleSheet.create({
});

export default PullUp;
