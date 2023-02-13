import React from 'react';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import TopProfilePromoScreenContainer from './TopProfilePromoScreenContainer';
import i18n from '~src/i18n';
import * as ChoosePaymentScreen from '~src/screens/Payment/ChoosePaymentScreen';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {Platform} from 'react-native';

export interface TopProfilePromoScreenProps {}

const TopProfilePromoScreen: ScreenFC<TopProfilePromoScreenProps> = props => {
  useNavigationButtonPress(() => {
    Navigation.dismissModal(props.componentId);
  });

  return (
    <TopProfilePromoScreenContainer
      onContinuePress={async wareDictItemVariant => {
        Navigation.push(
          props.componentId,
          await ChoosePaymentScreen.layoutOptions({
            isModal: true,
            wareDictItemVariant: wareDictItemVariant,
          }),
        );
      }}
    />
  );
};

TopProfilePromoScreen.screenName = 'TopProfilePromoScreen';
export const layoutOptions: (
  props?: TopProfilePromoScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: TopProfilePromoScreen.screenName,
    options: {
      topBar: {
        title: {text: i18n.t('top-profile-promo-screen.title')!},
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

export default TopProfilePromoScreen;
