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
  maxSheetWidth?: number;
  modal?: boolean;
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
  sheet: {
    flex: 1,
    backgroundColor: 'white',
    // emulate FittedSheets cornerRadius, for better customization
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});

const PullUp = (props: PullUpProps) => {
  const {
    collapsedHeight,
    maxSheetWidth,
    modal,
    hideable,
    dismissable,
    tapToDismissModal,
    onStateChanged,
    children,
    style,
  } = props;

  const onNativeStateChanged = useCallback(
    (evt: NativeSyntheticEvent<{ state: SheetState }>) => {
      const { state: newState } = evt.nativeEvent;
      onStateChanged?.(newState);
    },
    [onStateChanged]
  );

  return (
    <NativePullUp
      {...props}
      style={styles.primary}
      collapsedHeight={collapsedHeight || 0}
      maxSheetWidth={maxSheetWidth || 0}
      hideable={hideable && (!modal || dismissable)}
      tapToDismissModal={dismissable && tapToDismissModal}
      onStateChanged={onNativeStateChanged}
    >
      <View collapsable={false} style={[styles.sheet, style]}>
        {children}
      </View>
    </NativePullUp>
  );
};

PullUp.propTypes = PullUpPropTypes;
PullUp.defaultProps = PullUpDefaultProps;

export default PullUp;
export { PullUpProps, SheetState };
