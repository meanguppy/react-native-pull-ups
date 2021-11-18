import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  NativeEventEmitter,
  requireNativeComponent,
} from 'react-native';

export type BottomSheetState = 'hidden' | 'collapsed' | 'expanded';

interface PullUpProps {
  state?: BottomSheetState;
  onSheetStateChanged?: (newState: BottomSheetState) => void;
  hideable?: boolean;
  collapsible?: boolean;
  height?: number;
  peekHeight?: number;
  style?: object;
  children?: object;
}

const NativePullUp = requireNativeComponent('RNPullUpView');

const PullUp = (props) => {
  const { state, onRequestClose } = props;
  if (state === 'hidden') return null;

  return (
    <NativePullUp
      style={{ position: 'absolute', bottom: 0, width: 100, height: 100, backgroundColor: 'red' }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
});

export default PullUp;
