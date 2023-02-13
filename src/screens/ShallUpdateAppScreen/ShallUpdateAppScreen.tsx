import React from 'react';
import {
  LayoutStackChildren,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import ShallUpdateAppScreenContainer from './ShallUpdateAppScreenContainer';

export interface ShallUpdateAppScreenProps {}

const ShallUpdateAppScreen: ScreenFC<ShallUpdateAppScreenProps> = () => {
  return <ShallUpdateAppScreenContainer />;
};

ShallUpdateAppScreen.screenName = 'ShallUpdateAppScreen';
export const layoutOptions: (
  props?: ShallUpdateAppScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: ShallUpdateAppScreen.screenName,
    options: {
      modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
      hardwareBackButton: {
        dismissModalOnPress: false,
      },
      modal: {
        swipeToDismiss: false,
      },
      topBar: {
        visible: false,
      },
    },
  },
});

export default ShallUpdateAppScreen;
