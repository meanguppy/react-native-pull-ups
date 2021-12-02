import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  HostComponent,
  NativeEventEmitter,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewProps,
  requireNativeComponent,
  Modal,
  Animated,
} from 'react-native';
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
  overlay: {
    flex: 1,
    backgroundColor: 'black',
  },
});

const PullUpBase = (props: PullUpProps) => {
  const {
    collapsedHeight,
    maxSheetWidth,
    onStateChanged,
    style,
    children,
  } = props;

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
    <NativePullUp
      {...props}
      style={styles.primary}
      collapsedHeight={collapsedHeight || 0}
      maxSheetWidth={maxSheetWidth || 0}
    >
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

  const [destroyed, setDestroyed] = useState(state === 'hidden');
  const opacity = useRef(new Animated.Value(0)).current;

  /* Manage sheet state and destroyed state for */
  useEffect(() => {
    const hiding = state === 'hidden';
    const target = hiding ? 0 : 0.7;
    const animation = Animated.timing(opacity, {
      toValue: target,
      duration: 250,
      useNativeDriver: true,
    });

    if (hiding) {
      /* Start opacity animation, and destroy modal after it completes. */
      animation.start(() => setDestroyed(true));
    } else {
      /* The initial sheet render must be 'hidden' in order for the
       * slide-up animation to appear. Start the overlay opacity animation,
       * and then set `destroyed` to false to start the slide-up animation. */
      animation.start();
      setTimeout(() => setDestroyed(false));
    }
  }, [state, destroyed, opacity]);

  const onRequestClose = useCallback(() => {
    if (dismissable) onStateChanged?.('hidden');
  }, [dismissable, onStateChanged]);

  const onPressOverlay = useCallback(() => {
    if (dismissable && tapToDismissModal) {
      onStateChanged?.('hidden');
    }
  }, [dismissable, tapToDismissModal, onStateChanged]);

  if (destroyed && state === 'hidden') return null;

  return (
    <Modal transparent onRequestClose={onRequestClose}>
      <TouchableWithoutFeedback onPress={onPressOverlay}>
        <Animated.View style={[styles.overlay, { opacity }]} />
      </TouchableWithoutFeedback>
      <PullUpBase
        {...props}
        state={destroyed ? 'hidden' : state}
        hideable={hideable && dismissable}
      />
    </Modal>
  );
};

const PullUp = (props: PullUpProps) =>
  props.modal ? <PullUpModal {...props} /> : <PullUpBase {...props} />;

PullUp.propTypes = PullUpPropTypes;
PullUp.defaultProps = PullUpDefaultProps;

export default PullUp;
export { PullUpProps, SheetState };
