import React, { useEffect } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  NativeEventEmitter,
  requireNativeComponent,
} from 'react-native';
import CustomAndroidModal from './CustomAndroidModal';
import type { PullUpProps } from './types';
import { PullUpPropTypes, PullUpDefaultProps } from './types';

const NativePullUp = requireNativeComponent('RNPullUpView');

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

const PullUpBase = (props: PullUpProps) => {
  const { style, children, onStateChanged, ...rest } = props;

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter();
    const subscription = eventEmitter.addListener(
      'BottomSheetStateChange',
      (event) => {
        onStateChanged?.(event);
      }
    );
    return () => subscription.remove();
  }, [onStateChanged]);

  return (
    <NativePullUp {...rest} style={[styles.primary]}>
      <View style={[styles.sheet, style]}>{children}</View>
    </NativePullUp>
  );
};

const PullUpModal = (props: PullUpProps) => {
  const { state, onStateChanged } = props;
  if (state === 'hidden') return null;

  const forceState = state === 'collapsed' ? 'expanded' : state;

  return (
    <CustomAndroidModal
      onRequestClose={() => onStateChanged?.('hidden')}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={() => onStateChanged?.('hidden')}>
        <View style={styles.flex} />
      </TouchableWithoutFeedback>
      <PullUpBase {...props} collapsible={false} state={forceState} />
    </CustomAndroidModal>
  );
};

const PullUp = (props: PullUpProps) =>
  props.modal ? <PullUpModal {...props} /> : <PullUpBase {...props} />;

PullUp.propTypes = PullUpPropTypes;
PullUp.defaultProps = PullUpDefaultProps;

export default PullUp;
