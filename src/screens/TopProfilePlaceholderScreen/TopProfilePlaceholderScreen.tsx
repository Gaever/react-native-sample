import React from 'react';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import i18n from '~src/i18n';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import TopProfilePlaceholderScreenContent from './TopProfilePlaceholderScreenContent';
import {Platform} from 'react-native';

export interface TopProfilePlaceholderScreenProps {}

const TopProfilePlaceholderScreen: ScreenFC<
  TopProfilePlaceholderScreenProps
> = props => {
  useNavigationButtonPress(() => {
    Navigation.dismissModal(props.componentId);
  });

  return <TopProfilePlaceholderScreenContent />;
};

TopProfilePlaceholderScreen.screenName = 'TopProfilePlaceholderScreen';
export const layoutOptions: (
  props?: TopProfilePlaceholderScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: TopProfilePlaceholderScreen.screenName,
    options: {
      topBar: {
        rightButtons: [
          {
            id: 'TopProfilePromoScreen.button-close',
            text: i18n.t('close-modal')!,
            ...Platform.select({
              ios: null,
              android: {
                color: '#000000',
              },
            }),
          },
        ],
      },
    },
  },
});

export default TopProfilePlaceholderScreen;
