import React from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import {PaymentFailedScreenContentProps} from './PaymentFailedScreenContent';
import PaymentResultScreenContainer from './PaymentResultScreenContainer';

export interface PaymentResultScreenProps
  extends Partial<PaymentFailedScreenContentProps> {
  success: boolean;
}

const PaymentResultScreen: ScreenFC<PaymentResultScreenProps> = props => {
  const {success, ...PaymentFailedScreenContentProps} = props;

  return (
    <PaymentResultScreenContainer
      success={success}
      onSuccessPress={async () => {
        await Navigation.dismissAllModals();
        Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
          bottomTabs: {
            currentTabIndex: 0,
          },
        });
      }}
      onReturnToMainScreenPress={async () => {
        await Navigation.dismissAllModals();
        Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
          bottomTabs: {
            currentTabIndex: 0,
          },
        });
      }}
      onReturnToPaymentOptionsPress={() => {
        Navigation.dismissModal(props.componentId);
      }}
      {...PaymentFailedScreenContentProps}
    />
  );
};

PaymentResultScreen.screenName = 'PaymentResultScreen';
export const layoutOptions: (
  props: PaymentResultScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: PaymentResultScreen.screenName,
    options: {
      topBar: {
        visible: false,
      },
    },
  },
});

export default PaymentResultScreen;
