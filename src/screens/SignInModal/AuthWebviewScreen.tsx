import React from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import AuthWebview, {AuthWebviewProps} from '~components/AuthWebview';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import i18n from '~src/i18n';
import {Platform} from 'react-native';

export interface AuthWebviewScreenProps extends AuthWebviewProps {}

const AuthWebviewScreen: ScreenFC<AuthWebviewScreenProps> = props => {
  useNavigationButtonPress(_ => {
    Navigation.dismissModal(props.componentId);
  });

  return <AuthWebview provider={props.provider} />;
};

AuthWebviewScreen.screenName = 'AuthWebviewScreen';

export const layoutOptions: (
  props: AuthWebviewScreenProps,
) => LayoutStackChildren = props => ({
  component: {
    passProps: props,
    name: AuthWebviewScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('auth-webview-screen.modal-title')!,
        },
        rightButtons: [
          {
            id: 'AuthWebviewScreen.button-close',
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

export default AuthWebviewScreen;
