import React, { useCallback } from 'react';
import {
  HostComponent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewProps,
  requireNativeComponent,
} from 'react-native';
import {
  PullUpProps,
  SheetState,
  IOSStyling,
  PullUpPropTypes,
  PullUpDefaultProps,
} from './types';

/* Props for Native iOS component.
 * Not to be confused with the main component. */
interface NativeProps extends ViewProps {
  state: SheetState;
  collapsedHeight?: number;
  maxWidth?: number;
  modal?: boolean;
  collapsible?: boolean;
  hideable?: boolean;
  tapToDismissModal?: boolean;
  onStateChanged: (evt: NativeSyntheticEvent<{ state: SheetState }>) => void;
  iosStyling?: IOSStyling;
}

const NativePullUp: HostComponent<NativeProps> =
  requireNativeComponent('RNPullUpView');

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
    (evt: NativeSyntheticEvent<{ state: SheetState }>) => {
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
      collapsible={!!collapsedHeight && !modal}
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
