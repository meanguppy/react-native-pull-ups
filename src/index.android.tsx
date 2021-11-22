import React, { useEffect } from 'react';
import {
  HostComponent,
  NativeEventEmitter,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewProps,
  requireNativeComponent,
} from 'react-native';
import CustomAndroidModal from './CustomAndroidModal';
import {
  PullUpProps,
  SheetState,
  PullUpPropTypes,
  PullUpDefaultProps,
} from './types';

/* Props for Native Android component.
 * Not to be confused with the main component. */
interface NativeProps extends ViewProps {
  state: SheetState;
  collapsedHeight?: number;
  maxSheetWidth?: number;
  hideable?: boolean;
}

const NativePullUp: HostComponent<NativeProps> = requireNativeComponent(
  'RNPullUpView'
);

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
  const { maxSheetWidth, style, onStateChanged, children } = props;

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

  const maxWidthStyle =
    typeof maxSheetWidth === 'number' && maxSheetWidth > 0
      ? { maxWidth: maxSheetWidth }
      : null;

  return (
    <NativePullUp {...props} style={styles.primary}>
      <View collapsable={false} style={[styles.sheet, style, maxWidthStyle]}>
        {children}
      </View>
    </NativePullUp>
  );
};

const PullUpModal = (props: PullUpProps) => {
  const {
    state,
    hideable,
    dismissable,
    tapToDismissModal,
    onStateChanged,
  } = props;
  if (state === 'hidden') return null;

  function onRequestClose() {
    if (dismissable) onStateChanged?.('hidden');
  }

  function onPressOverlay() {
    if (dismissable && tapToDismissModal) {
      onStateChanged?.('hidden');
    }
  }

  return (
    <CustomAndroidModal animationType="slide" onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={onPressOverlay}>
        <View style={styles.flex} />
      </TouchableWithoutFeedback>
      <PullUpBase
        {...props}
        hideable={hideable && dismissable}
        collapsedHeight={0}
      />
    </CustomAndroidModal>
  );
};

const PullUp = (props: PullUpProps) =>
  props.modal ? <PullUpModal {...props} /> : <PullUpBase {...props} />;

PullUp.propTypes = PullUpPropTypes;
PullUp.defaultProps = PullUpDefaultProps;

export default PullUp;
export { PullUpProps, SheetState };
