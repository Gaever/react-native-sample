import React from 'react';
import {Platform} from 'react-native';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import ForgotPasswordForm from '~components/ForgotPasswordForm';
import SignInModalFormWrapper from '~components/SignInModalFormWrapper';
import i18n from '~src/i18n';
import {WelcomeScreenProps} from './WelcomeScreen';

export interface ForgotPasswordScreenScreenProps {
  welcomeScreenId: string;
}

const ForgotPasswordScreen: ScreenFC<
  ForgotPasswordScreenScreenProps
> = props => {
  useNavigationButtonPress(_ => {
    Navigation.dismissModal(props.componentId);
  });

  return (
    <SignInModalFormWrapper
      SignInModalFooterProps={{
        variant: 'signup',
        onPress: () => {
          Navigation.updateProps(props.welcomeScreenId, {
            variant: 'signin',
          } as WelcomeScreenProps);
          Navigation.popTo(props.welcomeScreenId);
        },
      }}>
      <ForgotPasswordForm
        onSubmit={() => {
          Navigation.popTo(props.welcomeScreenId);
        }}
      />
    </SignInModalFormWrapper>
  );
};
ForgotPasswordScreen.screenName = 'ForgotPasswordScreen';

export const layoutOptions: (
  props: ForgotPasswordScreenScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: ForgotPasswordScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('sign-in-modal.forgot-password-screen.modal-title')!,
        },
        backButton: {
          showTitle: false,
        },
        rightButtons: [
          {
            id: 'ForgotPasswordScreen.button-close',
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

export default ForgotPasswordScreen;
