import React from 'react';
import {Platform} from 'react-native';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import i18n from '~src/i18n';
import * as PaymentResultScreen from './PaymentResultScreen';
import PaymentWebViewScreenContainer, {
  PaymentWebViewScreenContainerProps,
} from './PaymentWebViewScreenContainer';

export interface PaymentWebViewScreenProps
  extends Pick<
    PaymentWebViewScreenContainerProps,
    'wareDictItem' | 'promocode'
  > {}

const PaymentWebViewScreen: ScreenFC<PaymentWebViewScreenProps> = props => {
  useNavigationButtonPress(_ => {
    Navigation.dismissModal(props.componentId);
  });

  return (
    <PaymentWebViewScreenContainer
      wareDictItem={props.wareDictItem}
      promocode={props.promocode}
      onPaymentSucceed={async () => {
        Navigation.push(
          props.componentId,
          await PaymentResultScreen.layoutOptions({success: true}),
        );
      }}
    />
  );
};
PaymentWebViewScreen.screenName = 'PaymentWebViewScreen';

export const layoutOptions: (
  props: PaymentWebViewScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: PaymentWebViewScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('payment.webview-screen.modal-title')!,
        },
        backButton: {
          showTitle: false,
        },
        rightButtons: [
          {
            id: 'PaymentWebViewScreen.button-close',
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

export default PaymentWebViewScreen;
