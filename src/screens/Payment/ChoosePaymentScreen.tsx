import React, {useCallback} from 'react';
import {Platform} from 'react-native';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import CurrencyPicker from '~components/CurrencyPicker';
import SignInModalFormWrapper from '~components/SignInModalFormWrapper';
import i18n from '~src/i18n';
import {WareDictItem} from '~src/types';
import useCurrencyNavButton from '~src/utils/use-currency-nav-button';
import {getFeatures} from '~src/utils/use-features';
import {store} from '~store/app-state';
import ChoosePaymentScreenContainer from './ChoosePaymentScreenContainer';
import * as PaymentWebViewScreen from './PaymentWebViewScreen';

export interface ChoosePaymentScreenProps {
  isModal?: boolean;
  wareDictItemVariant: string | null;
  promocode?: string;
}

const closeModalButtonId = 'ChoosePaymentScreen.button-close';
const curPickerButtonId = 'ChoosePaymentScreen.cur';

const ChoosePaymentScreen: ScreenFC<ChoosePaymentScreenProps> = props => {
  useNavigationButtonPress(event => {
    if (event.buttonId !== 'ChoosePaymentScreen.button-close') {
      return;
    }

    if (props.isModal ?? true) {
      Navigation.dismissModal(props.componentId);
    } else {
      Navigation.pop(props.componentId);
    }
  });

  const {isCurPickerVisible, onChange, onClose} = useCurrencyNavButton(
    props.componentId,
    curPickerButtonId,
  );

  const onBankCardPayPress = useCallback(
    async (wareDictItem: WareDictItem, promocode?: string) => {
      Navigation.showModal({
        stack: {
          children: [
            await PaymentWebViewScreen.layoutOptions({
              wareDictItem,
              promocode,
            }),
          ],
        },
      });
    },
    [],
  );

  // @TODO
  const onSbpPayPress = useCallback(async (wareDictItem: WareDictItem) => {},
  []);

  return (
    <SignInModalFormWrapper>
      <ChoosePaymentScreenContainer
        promocode={props.promocode}
        onBankCardPayPress={onBankCardPayPress}
        onSbpPayPress={onSbpPayPress}
        wareDictItemVariant={props.wareDictItemVariant}
      />
      <CurrencyPicker
        visible={isCurPickerVisible}
        onClose={onClose}
        onChange={onChange}
      />
    </SignInModalFormWrapper>
  );
};
ChoosePaymentScreen.screenName = 'ChoosePaymentScreen';

export const layoutOptions: (
  props: ChoosePaymentScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: ChoosePaymentScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('choose-payment-screen.modal-title')!,
        },
        backButton: {
          showTitle: false,
        },
        ...(props?.isModal ?? true
          ? {
              leftButtons: [
                {
                  id: closeModalButtonId,
                  text: i18n.t('close-modal')!,
                  ...Platform.select({
                    ios: null,
                    android: {
                      color: '#000000',
                    },
                  }),
                },
              ],
              rightButtons: getFeatures().simpleTariffPromo
                ? undefined
                : [
                    {
                      id: curPickerButtonId,
                      text: store.cur,
                      ...Platform.select({
                        ios: null,
                        android: {
                          color: '#000000',
                        },
                      }),
                    },
                  ],
            }
          : null),
      },
    },
  },
});

export default ChoosePaymentScreen;
