import React, {useCallback} from 'react';
import {Platform} from 'react-native';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import CurrencyPicker from '~components/CurrencyPicker';
import i18n from '~src/i18n';
import useCurrencyNavButton from '~src/utils/use-currency-nav-button';
import {getFeatures} from '~src/utils/use-features';
import {store} from '~store/app-state';
import * as ChoosePaymentScreen from '../Payment/ChoosePaymentScreen';
import TariffScreenContainer from './TariffPromoScreenContainer';

export interface TariffScreenProps {
  isModal?: boolean;
  showBackButton?: boolean;
  onDismiss?: (componentId: string) => void;
}

const curPickerButtonId = 'TariffScreen.cur';

const TariffScreen: ScreenFC<TariffScreenProps> = props => {
  useNavigationButtonPress(event => {
    if (event.buttonId !== 'TariffScreen.button-close') {
      return;
    }

    onDismiss();
  });

  const {isCurPickerVisible, onChange, onClose} = useCurrencyNavButton(
    props.componentId,
    curPickerButtonId,
  );

  const onDismiss = useCallback(() => {
    if (props.onDismiss) {
      props.onDismiss(props.componentId);
      return;
    } else {
    }
    if (props.isModal ?? true) {
      Navigation.dismissModal(props.componentId);
    } else {
      Navigation.pop(props.componentId);
    }
  }, [props.isModal, props.componentId, props.onDismiss]);

  return (
    <>
      <TariffScreenContainer
        onContinuePress={async (wareDictItem, promocode) => {
          Navigation.push(
            props.componentId,
            await ChoosePaymentScreen.layoutOptions({
              isModal: props.isModal,
              wareDictItemVariant: wareDictItem?.variant || null,
              promocode,
            }),
          );
        }}
        onRejectPress={onDismiss}
      />
      <CurrencyPicker
        visible={isCurPickerVisible}
        onClose={onClose}
        onChange={onChange}
      />
    </>
  );
};
TariffScreen.screenName = 'TariffScreen';

export const layoutOptions: (
  props?: TariffScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: TariffScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('tariff-screen.modal-title')!,
        },
        backButton: {
          visible: props?.showBackButton ?? true,
          showTitle: false,
        },
        ...(props?.isModal ?? true
          ? {
              leftButtons: [
                {
                  id: 'TariffScreen.button-close',
                  text: i18n.t('close-modal')!,
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
      },
    },
  },
});

export default TariffScreen;
