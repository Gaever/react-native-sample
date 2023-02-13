import React, {useCallback} from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import i18n from '~src/i18n';
import useNextPageNavigation from '~src/utils/use-next-page-navigation';
import * as WebViewScreen from '../WebViewScreen';
import {POLICY_URL, RULES_URL} from '@env';

import SignInWithEmailScreenContainer from './SignInWithEmailScreenContainer';
import {WelcomeScreenProps} from './WelcomeScreen';

export interface SignUpWithEmailScreenProps {
  welcomeScreenId: string;
}

const SignUpWithEmailScreen: ScreenFC<SignUpWithEmailScreenProps> = props => {
  useNavigationButtonPress(_ => {
    Navigation.dismissModal(props.componentId);
  });
  const navigateToNextPage = useNextPageNavigation(props.componentId);

  const onPolicyPress = useCallback(async () => {
    Navigation.showModal({
      stack: {
        children: [await WebViewScreen.layoutOptions({uri: POLICY_URL})],
      },
    });
  }, []);
  const onRulesPress = useCallback(async () => {
    Navigation.showModal({
      stack: {
        children: [await WebViewScreen.layoutOptions({uri: RULES_URL})],
      },
    });
  }, []);

  return (
    <SignInWithEmailScreenContainer
      footerVariant="signup"
      onPolicyPress={onPolicyPress}
      onRulesPress={onRulesPress}
      onTestSignIn={nextPage => {
        navigateToNextPage(nextPage);
      }}
      onSignUpPress={() => {
        Navigation.updateProps(props.welcomeScreenId, {
          variant: 'signin',
        } as WelcomeScreenProps);
        Navigation.popTo(props.welcomeScreenId);
      }}
    />
  );
};
SignUpWithEmailScreen.screenName = 'SignUpWithEmailScreen';

export const layoutOptions: (
  props: SignUpWithEmailScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: SignUpWithEmailScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('sign-in-modal.sign-up-with-email-screen.modal-title')!,
        },
        backButton: {
          showTitle: false,
        },
        // rightButtons: [
        //   {
        //     id: 'SignUpWithEmailScreen.button-close',
        //     text: i18n.t('close-modal')!,
        //   },
        // ],
      },
    },
  },
});

export default SignUpWithEmailScreen;
