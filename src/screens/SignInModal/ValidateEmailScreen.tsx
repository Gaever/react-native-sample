import React from 'react';
import {Platform} from 'react-native';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import i18n from '~src/i18n';
import useNextPageNavigation from '~src/utils/use-next-page-navigation';
import ValidateEmailScreenContainer, {
  ValidateEmailScreenContainerProps,
} from './ValidateEmailScreenContainer';

export interface ValidateEmailScreenProps
  extends Pick<ValidateEmailScreenContainerProps, 'emailValidationToken'> {}

const ValidateEmailScreen: ScreenFC<ValidateEmailScreenProps> = props => {
  const navigateToNextPage = useNextPageNavigation(props.componentId);

  useNavigationButtonPress(_ => {
    Navigation.dismissModal(props.componentId);
  });

  return (
    <ValidateEmailScreenContainer
      emailValidationToken={props.emailValidationToken}
      onErrorPress={() => {
        Navigation.dismissModal(props.componentId);
      }}
      onSuccess={async nextPage => {
        navigateToNextPage(nextPage);
      }}
    />
  );
};
ValidateEmailScreen.screenName = 'ValidateEmailScreen';

export const layoutOptions: (
  props: ValidateEmailScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: ValidateEmailScreen.screenName,
    options: {
      topBar: {
        backButton: {
          showTitle: false,
        },
        rightButtons: [
          {
            id: 'ValidateEmailScreen.button-close',
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

export default ValidateEmailScreen;
