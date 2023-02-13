import React, {useCallback} from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import useNextPageNavigation from '~src/utils/use-next-page-navigation';
import * as WebViewScreen from '~src/screens/WebViewScreen';
import * as SignInWithEmailScreen from './SignInWithEmailScreen';
import * as SignUpWithEmailScreen from './SignUpWithEmailScreen';
import WelcomeScreenContainer from './WelcomeScreenContainer';
import {WelcomeScreenContentProps} from './WelcomeScreenContent';
import {RULES_URL, POLICY_URL} from '@env';

export interface WelcomeScreenProps
  extends Pick<WelcomeScreenContentProps, 'variant'> {}

const WelcomeScreen: ScreenFC<WelcomeScreenProps> = props => {
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
    <WelcomeScreenContainer
      variant={props.variant}
      onBackPress={() => {
        Navigation.dismissModal(props.componentId);
      }}
      onSignUpPress={async () => {
        Navigation.push(
          props.componentId,
          await SignUpWithEmailScreen.layoutOptions({
            welcomeScreenId: props.componentId,
          }),
        );
      }}
      onSignIn={async nextPage => {
        await Navigation.dismissAllModals();
        navigateToNextPage(nextPage);
      }}
      onSignInWithEmailPress={async () => {
        Navigation.push(
          props.componentId,
          await SignInWithEmailScreen.layoutOptions({
            welcomeScreenId: props.componentId,
          }),
        );
      }}
      onPolicyPress={onPolicyPress}
      onRulesPress={onRulesPress}
    />
  );
};
WelcomeScreen.screenName = 'WelcomeScreen';

export const layoutOptions: (
  props?: WelcomeScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: WelcomeScreen.screenName,
    modalPresentationStyle: 'fullscreen',
    options: {
      hardwareBackButton: {
        dismissModalOnPress: false,
      },
      modal: {
        swipeToDismiss: false,
      },
      topBar: {
        visible: false,
      },
    },
  },
});

export default WelcomeScreen;
