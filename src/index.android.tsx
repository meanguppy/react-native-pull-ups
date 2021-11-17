import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  NativeEventEmitter,
  requireNativeComponent,
} from 'react-native';

export type BottomSheetState = 'hidden' | 'collapsed' | 'expanded';

interface PullUpProps {
  onSheetStateChanged?: (newState: BottomSheetState) => void;
  hideable?: boolean;
  collapsible?: boolean;
  fitToContents?: boolean;
  expandedOffset?: number;
  peekHeight?: number;
  sheetState?: BottomSheetState;
  style?: object;
  containerStyle?: object;
  children?: object;
}

const NativePullUp = requireNativeComponent('RNPullUpView');
const NativeModal = requireNativeComponent('RNPullUpModal');

const PullUpBase = (props: PullUpProps) => {
  const {
    style,
    children,
    containerStyle,
    onSheetStateChanged,
    ...rest
  } = props;

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
    <NativePullUp {...rest} style={[styles.primary, style]}>
      <View style={[styles.sheet, containerStyle]}>{children}</View>
    </NativePullUp>
  );
};

const CustomModal = (props) => (
  <NativeModal {...props} style={styles.modal}>
    <ScrollView.Context.Provider value={null}>
      <View style={styles.modalContainer}>{props.children}</View>
    </ScrollView.Context.Provider>
  </NativeModal>
);

const PullUpModal = (props) => {
  const { state, onRequestClose } = props;
  if (state === 'hidden') return null;

  const forceState = state === 'collapsed' ? 'expanded' : state;

  return (
    <CustomModal
      onRequestClose={onRequestClose}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.flex} />
      </TouchableWithoutFeedback>
      <PullUpBase {...props} collapsible={false} state={forceState} />
    </CustomModal>
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
    backgroundColor: 'white',
    flex: 1,
  },
  modal: {
    position: 'absolute',
  },
  modalContainer: {
    top: 0,
    left: 0,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
});

export default PullUp;
