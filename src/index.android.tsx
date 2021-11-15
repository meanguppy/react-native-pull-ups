import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, requireNativeComponent } from 'react-native';

export type BottomSheetState = 'hidden' | 'collapsed' | 'expanded';

interface PullUpProps {
  onSheetStateChanged?: (newState: BottomSheetState) => void;
  renderContent: () => object;
  hideable?: boolean;
  collapsible?: boolean;
  fitToContents?: boolean;
  halfExpandedRatio?: number;
  expandedOffset?: number;
  peekHeight?: number;
  sheetState?: BottomSheetState;
  style?: object;
  contentStyle?: object;
  children?: object;
}

const styles = StyleSheet.create({
  primary: { flex: 1 },
  sheet: { backgroundColor: 'white' },
});

export const PullUpsView = requireNativeComponent('RNPullUpView');

class PullUps extends Modal {

  render(){
    const result = super.render();
    if(!result) return result;

    const { key, ref, props } = result;
    //console.log('MODAL RESULT', Object.keys(result));
    return <PullUpsView
      key={key}
      ref={ref}
      {...props}
    />
  }

}

export default PullUps;
