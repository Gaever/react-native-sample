import React from 'react';
import {Platform} from 'react-native';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import i18n from '~src/i18n';
import ClaimScreenContainer from './ClaimScreenContainer';

export interface ClaimScreenProps {
  targetUserId: string;
  onSubmit?: (componentId: string) => void;
}

const ClaimScreen: ScreenFC<ClaimScreenProps> = props => {
  useNavigationButtonPress(() => {
    Navigation.dismissModal(props.componentId);
  });

  return (
    <ClaimScreenContainer
      targetUserId={props.targetUserId}
      onSubmit={() => {
        props.onSubmit?.(props.componentId);
      }}
    />
  );
};

ClaimScreen.screenName = 'ClaimScreen';
export const layoutOptions: (
  props: ClaimScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: ClaimScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('claim-modal.modal-title')!,
        },
        leftButtons: [
          {
            id: 'ClaimScreen.button-close',
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

export default ClaimScreen;
