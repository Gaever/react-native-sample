import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import WebView from 'react-native-webview';
import i18n from '~src/i18n';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {Platform} from 'react-native';

export interface WebViewScreenProps {
  uri: string;
}

const WebViewScreen: ScreenFC<WebViewScreenProps> = props => {
  useNavigationButtonPress(() => {
    Navigation.dismissModal(props.componentId);
  });

  return <WebView source={{uri: props.uri}} />;
};

WebViewScreen.screenName = 'WebViewScreen';
export const layoutOptions: (
  props: WebViewScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: WebViewScreen.screenName,
    options: {
      topBar: {
        rightButtons: [
          {
            id: `${WebViewScreen.screenName}.button-close`,
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

export default WebViewScreen;
