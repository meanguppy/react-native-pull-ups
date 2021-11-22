import React, { useCallback } from 'react';
import {
  HostComponent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewProps,
  processColor,
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

const NativePullUp: HostComponent<NativeProps> = requireNativeComponent(
  'RNPullUpView'
);

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

function processColors(config: IOSStyling) {
  for (const [k, v] of Object.entries(config)) {
    if (typeof v === 'string') {
      config[k as keyof IOSStyling] = processColor(v) as any;
    }
  }
}

const PullUp = (props: PullUpProps) => {
  const {
    collapsedHeight,
    maxSheetWidth,
    modal,
    hideable,
    dismissable,
    tapToDismissModal,
    onStateChanged,
    iosStyling,
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

  if (iosStyling) processColors(iosStyling);

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
