/* This file is necessary in order for TypeScript
 * to properly understand the .android and .ios
 * file extensions used by react-native */

import DefaultIos from './index.ios';
import DefaultAndroid from './index.android';
declare var _testDefault: typeof DefaultIos;
declare var _testDefault: typeof DefaultAndroid;

import * as ios from './index.ios';
import * as android from './index.android';
declare var _test: typeof ios;
declare var _test: typeof android;

export * from './index.ios';
export default DefaultIos;
