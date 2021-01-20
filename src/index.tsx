import React from 'react';
import { requireNativeComponent } from 'react-native';

type OnChangeContext = {
  height: number;
  isFullScreen: boolean;
};

type GripSize = {
  width: number;
  height: number;
};

type PullUpProps = {
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
  onSizeChange?: (onChange: OnChangeContext) => void;
};

export const PullUpsView = requireNativeComponent<PullUpProps>('RNPullUpView');

const PullUps = (props: PullUpProps) => <PullUpsView {...props} />;

PullUps.defaultProps = {
  show: true,
};

export default PullUps;
