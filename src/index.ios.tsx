import React, { useCallback } from 'react';
import { View, StyleSheet, requireNativeComponent } from 'react-native';
import {
  PullUpProps,
  SheetState,
  PullUpPropTypes,
  PullUpDefaultProps,
} from './types';

const NativePullUp = requireNativeComponent('RNPullUpView');

const styles = StyleSheet.create({
  primary: {
    position: 'absolute',
    left: -1000000,
  },
});

const PullUp = ({
  state,
  collapsedHeight,
  maxWidth,
  modal,
  hideable,
  dismissable,
  tapToDismissModal,
  iosStyling,
  onStateChanged,
  children,
}: PullUpProps) => {
  const onNativeStateChanged = useCallback(
    (evt) => {
      const { state: newState } = evt.nativeEvent;
      onStateChanged?.(newState);
    },
    [onStateChanged]
  );

  return (
    <NativePullUp
      style={styles.primary}
      state={state}
      collapsedHeight={collapsedHeight}
      maxWidth={maxWidth}
      modal={modal}
      collapsible={collapsedHeight && !modal}
      hideable={hideable && (!modal || dismissable)}
      tapToDismissModal={tapToDismissModal}
      onStateChanged={onNativeStateChanged}
      iosStyling={iosStyling}
    >
      <View>{children}</View>
    </NativePullUp>
  );
};

PullUp.propTypes = PullUpPropTypes;
PullUp.defaultProps = PullUpDefaultProps;

export default PullUp;
export { PullUpProps, SheetState };
