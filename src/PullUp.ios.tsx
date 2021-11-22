import type { PullUpProps } from './index';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, requireNativeComponent } from 'react-native';

const propTypes = {
  state: PropTypes.oneOf(['hidden','collapsed','expanded']).isRequired,
  collapsedHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  modal: PropTypes.bool,
  hideable: PropTypes.bool,
  dismissable: PropTypes.bool,
  tapToDismissModal: PropTypes.bool,
  onStateChanged: PropTypes.func,
  iosStyling: PropTypes.object,
};
const defaultProps = {
  modal: false,
  hideable: true,
  dismissable: true,
  tapToDismissModal: true,
};

const NativePullUp = requireNativeComponent('RNPullUpView');

const styles = StyleSheet.create({
  primary: {
    position: 'absolute',
    left: -1000000,
  }
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

  const onNativeStateChanged = useCallback((evt) => {
    const { state: newState } = evt.nativeEvent;
    onStateChanged?.(newState);
  }, [onStateChanged]);

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
      <View>{ children }</View>
    </NativePullUp>
  );
};

PullUp.propTypes = propTypes;
PullUp.defaultProps = defaultProps;

export default PullUp;
