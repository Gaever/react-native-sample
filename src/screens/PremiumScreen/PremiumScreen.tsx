import React, {useCallback} from 'react';
import {Platform} from 'react-native';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import CurrencyPicker from '~components/CurrencyPicker';
import i18n from '~src/i18n';
import * as ChoosePaymentScreen from '~src/screens/Payment/ChoosePaymentScreen';
import {WareDictItem} from '~src/types';
import useCurrencyNavButton from '~src/utils/use-currency-nav-button';
import {getFeatures} from '~src/utils/use-features';
import {store} from '~store/app-state';
import PremiumScreenContainer, {
  PremiumScreenContainerProps,
} from './PremiumScreenContainer';

export interface PremiumScreenProps
  extends Pick<PremiumScreenContainerProps, 'initialTab'> {}

const curPickerButtonId = 'PremiumScreen.cur';

const PremiumScreen: ScreenFC<PremiumScreenProps> = props => {
  const {isCurPickerVisible, onChange, onClose} = useCurrencyNavButton(
    props.componentId,
    curPickerButtonId,
  );

  const onWareBuyPress = useCallback(async (wareDictItem: WareDictItem) => {
    Navigation.showModal({
      stack: {
        children: [
          await ChoosePaymentScreen.layoutOptions({
            wareDictItemVariant: wareDictItem.variant,
          }),
        ],
      },
    });
  }, []);

  // @TODO
  const onWareActivate = useCallback(async () => {}, []);

  return (
    <>
      <PremiumScreenContainer
        onWareActivate={onWareActivate}
        onWareBuyPress={onWareBuyPress}
        initialTab={props.initialTab}
      />
      <CurrencyPicker
        visible={isCurPickerVisible}
        onClose={onClose}
        onChange={onChange}
      />
    </>
  );
};

PremiumScreen.screenName = 'PremiumScreen';
export const layoutOptions: (
  props?: PremiumScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: PremiumScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('premium-screen.screen-title')!,
        },
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

export default PremiumScreen;
