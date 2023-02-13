import React, {useCallback} from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import i18n from '~src/i18n';
import useNextPageNavigation from '~src/utils/use-next-page-navigation';
import * as WebViewScreen from '../WebViewScreen';
import SignInWithEmailScreenContainer from './SignInWithEmailScreenContainer';
import {WelcomeScreenProps} from './WelcomeScreen';
import {RULES_URL, POLICY_URL} from '@env';

export interface SignInWithEmailScreenProps {
  welcomeScreenId: string;
}

const SignInWithEmailScreen: ScreenFC<SignInWithEmailScreenProps> = props => {
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
      onPolicyPress={onPolicyPress}
      onRulesPress={onRulesPress}
      footerVariant="signin"
      onTestSignIn={nextPage => {
        navigateToNextPage(nextPage);
      }}
      onSignUpPress={() => {
        Navigation.updateProps(props.welcomeScreenId, {
          variant: 'signup',
        } as WelcomeScreenProps);
        Navigation.popTo(props.welcomeScreenId);
      }}
    />
  );
};
SignInWithEmailScreen.screenName = 'SignInWithEmailScreen';

export const layoutOptions: (
  props: SignInWithEmailScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: SignInWithEmailScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('sign-in-modal.sign-in-with-email-screen.modal-title')!,
        },
        backButton: {
          showTitle: false,
        },
        // rightButtons: [
        //   {
        //     id: 'SignInWithEmailScreen.button-close',
        //     text: i18n.t('close-modal')!,
        //   },
        // ],
      },
    },
  },
});

export default SignInWithEmailScreen;
