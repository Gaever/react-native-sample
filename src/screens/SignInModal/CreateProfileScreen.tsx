import React from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import i18n from '~src/i18n';
import * as TariffScreen from '~src/screens/TariffPromoScreen/TariffPromoScreen';
import CreateProfileScreenContainer from './CreateProfileScreenContainer';

export interface CreateProfileScreenProps {}

const CreateProfileScreen: ScreenFC<CreateProfileScreenProps> = props => {
  useNavigationButtonPress(_ => {
    Navigation.dismissModal(props.componentId);
  });

  return (
    <CreateProfileScreenContainer
      showOnPreviewPress={false}
      onSubmit={async isFreeAccess => {
        if (isFreeAccess) {
          await Navigation.dismissAllModals();
          Navigation.mergeOptions('BOTTOM_TABS_LAYOUT', {
            bottomTabs: {
              currentTabIndex: 0,
            },
          });
        } else {
          Navigation.push(
            props.componentId,
            await TariffScreen.layoutOptions({
              showBackButton: false,
              isModal: false,
            }),
          );
        }
      }}
      variant="create"
    />
  );
};
CreateProfileScreen.screenName = 'CreateProfileScreen';

export const layoutOptions: (
  props?: CreateProfileScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: CreateProfileScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('sign-in-modal.create-profile-screen.modal-title')!,
        },
        backButton: {
          showTitle: false,
        },
        // rightButtons: [
        //   {
        //     id: 'CreateProfileScreen.button-close',
        //     text: i18n.t('close-modal')!,
        //   },
        // ],
      },
    },
  },
});

export default CreateProfileScreen;
