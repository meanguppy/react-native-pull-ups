import React, { useEffect } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  NativeEventEmitter,
  requireNativeComponent,
} from 'react-native';
import CustomAndroidModal from './CustomAndroidModal';

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

const PullUpBase = (props: PullUpProps) => {
  const { style, children, height, onSheetStateChanged, ...rest } = props;

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter();
    const subscription = eventEmitter.addListener(
      'BottomSheetStateChange',
      (event) => {
        onSheetStateChanged?.(event);
      }
    );
    return () => subscription.remove();
  }, [onSheetStateChanged]);

  return (
    <NativePullUp {...rest} style={[styles.primary, height && { height }]}>
      <View style={[styles.sheet, style]}>{children}</View>
    </NativePullUp>
  );
};

const PullUpModal = (props) => {
  const { state, onRequestClose } = props;
  if (state === 'hidden') return null;

  const forceState = state === 'collapsed' ? 'expanded' : state;

  return (
    <CustomAndroidModal
      onRequestClose={onRequestClose}
      onOrientationChange={() => console.log('orientation')}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.flex} />
      </TouchableWithoutFeedback>
      <PullUpBase {...props} collapsible={false} state={forceState} />
    </CustomAndroidModal>
  );
};

const PullUp = (props) =>
  props.modal ? <PullUpModal {...props} /> : <PullUpBase {...props} />;

const styles = StyleSheet.create({
  primary: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'flex-end',
  },
  sheet: {
    flex: 1,
    backgroundColor: 'white',
  },
  modal: {
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
});

export default PullUp;
