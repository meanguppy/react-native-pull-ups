import React from 'react';
import { requireNativeComponent } from 'react-native';

export interface OnChangeContext {
  nativeEvent: {
    height: number;
    isFullScreen: boolean;
  };
}

interface GripSize {
  width: number;
  height: number;
}

interface PullUpProps {
  sizes: Array<string>;
  children?: React.ReactNode;
  pullBarHeight?: number;
  presentingViewCornerRadius?: number;
  shouldExtendBackground?: boolean;
  setIntrensicHeightOnNavigationControllers?: boolean;
  useFullScreenMode?: boolean;
  shrinkPresentingViewController?: boolean;
  useInlineMode?: boolean;
  horizontalPadding?: boolean;
  maxWidth?: number;
  gripSize?: GripSize;
  gripColor?: string;
  cornerRadius?: number;
  minimumSpaceAbovePullBar?: number;
  pullBarBackgroundColor?: string;
  treatPullBarAsClear?: boolean;
  dismissOnOverlayTap?: boolean;
  dismissOnPull?: boolean;
  allowPullingPastMaxHeight?: boolean;
  autoAdjustToKeyboard?: boolean;
  contentBackgroundColor?: string;
  overlayColor?: string;
  allowGestureThroughOverlay?: boolean;
  pullUpContent: React.ReactNode;
  onSizeChange?: (onChange: OnChangeContext) => void;
}

export const PullUpsView = requireNativeComponent('RNPullUpView');

const PullUps = (props: PullUpProps) => {
  const { pullUpContent, children, ...rest } = props;
  return (
    <PullUpsView {...rest}>
      {children}
      {pullUpContent}
    </PullUpsView>
  );
};

PullUps.defaultProps = {
  show: true,
};

export default PullUps;
