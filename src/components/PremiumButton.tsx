import {observer} from 'mobx-react-lite';
import {Box, Pressable, Text} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Navigation} from 'react-native-navigation';
import * as WelcomeScreen from '~src/screens/SignInModal/WelcomeScreen';
import * as TariffScreen from '~src/screens/TariffPromoScreen/TariffPromoScreen';
import {useAppState} from '~store/app-state';

export interface PremiumButtonProps {}

const PremiumButton = observer((_props: PremiumButtonProps) => {
  const {t} = useTranslation();
  const appState = useAppState();

  if (appState.isPayedAccess) return null;

  return (
    <Pressable
      onPress={async () => {
        if (!appState.isAuthorized) {
          Navigation.showModal({
            stack: {
              children: [await WelcomeScreen.layoutOptions()],
            },
          });
        } else {
          Navigation.showModal({
            stack: {
              children: [await TariffScreen.layoutOptions()],
            },
          });
        }
      }}>
      <Box borderRadius="md" bg="secondary.400" p={1} px={2}>
        <Text fontWeight={700} fontSize={12} color="white">
          {t('purchase-premium')}
        </Text>
      </Box>
    </Pressable>
  );
});

export default PremiumButton;
