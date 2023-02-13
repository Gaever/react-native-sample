import {BACKEND_URL} from '@env';
import CookieManager from '@react-native-cookies/cookies';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {LogBox, NativeSyntheticEvent} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {WebViewMessage} from 'react-native-webview/lib/WebViewTypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import stylesheet from '~src/styles';

LogBox.ignoreLogs(['Error evaluating injectedJavaScript']);

// Send the cookie information back to the mobile app
const CHECK_COOKIE: string =
  'ReactNativeWebView.postMessage("Cookie: " + document.cookie);true;';

const onNavigationStateChange =
  (webViewRef: React.RefObject<WebView | null>) =>
  (navigationState: WebViewNavigation) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(CHECK_COOKIE);
    }
  };

const onMessage = async (event: NativeSyntheticEvent<WebViewMessage>) => {
  const {data} = event.nativeEvent;

  if (data.includes('Cookie:')) {
    // process the cookies
    const storedCookies = await CookieManager.get(
      'https://mywebapp.com/login',
      true,
    );
  }
};

export interface AuthWebviewProps {
  provider: 'google' | 'appleid' | 'vk';
}

function AuthWebview(props: AuthWebviewProps) {
  const [csrfToken, setCsrfToken] = useState();
  const webViewRef = useRef<WebView | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/csrf`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(data => data.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(() => {});
  }, []);

  if (!csrfToken) return null;

  return (
    <SafeAreaView style={stylesheet.modalContainer}>
      <WebView
        ref={webViewRef}
        source={{
          uri: `${BACKEND_URL}/signin/${props.provider}`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({csrfToken, provider: props.provider}),
        }}
        userAgent="Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange(webViewRef)}
      />
    </SafeAreaView>
  );
}

export default AuthWebview;
