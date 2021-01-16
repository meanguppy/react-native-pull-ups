import { requireNativeComponent, ViewStyle } from 'react-native';

type PullUpsProps = {
  color: string;
  style: ViewStyle;
};


export const PullUpsViewManager = requireNativeComponent<PullUpsProps>(
  'PullUpsView'
);

export default PullUpsViewManager;
