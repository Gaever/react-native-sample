import React from 'react';
import {Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import * as WelcomeScreen from '~src/screens/SignInModal/WelcomeScreen';
import * as ProfileFormScreen from './UpdateProfileScreen';

import {POLICY_URL, RULES_URL} from '@env';
import * as PremiumScreen from '~src/screens/PremiumScreen/PremiumScreen';
import * as WebViewScreen from '~src/screens/WebViewScreen';
import ProfileScreenContainer from './ProfileScreenContainer';

export interface ProfileScreenProps {}

const ProfileScreen: ScreenFC<ProfileScreenProps> = props => {
  return (
    <ProfileScreenContainer
      onNavigateTo={async screen => {
        switch (screen) {
          case 'profile':
            Navigation.push(
              props.componentId,
              await ProfileFormScreen.layoutOptions(),
            );
            break;
          case 'premium':
            Navigation.push(
              props.componentId,
              await PremiumScreen.layoutOptions(),
            );
            break;
          case 'rules':
            Navigation.showModal({
              stack: {
                children: [await WebViewScreen.layoutOptions({uri: RULES_URL})],
              },
            });
            break;
          case 'policy':
            Navigation.showModal({
              stack: {
                children: [
                  await WebViewScreen.layoutOptions({uri: POLICY_URL}),
                ],
              },
            });
            break;
        }
      }}
      onSignInPress={async variant => {
        Navigation.showModal({
          stack: {
            children: [await WelcomeScreen.layoutOptions({variant})],
          },
        });
      }}
    />
  );
};

ProfileScreen.screenName = 'ProfileScreen';
ProfileScreen.options = {
  topBar: {
    visible: false,
  },
};

export default ProfileScreen;
