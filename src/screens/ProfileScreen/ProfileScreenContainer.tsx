import {gql, useApolloClient, useSubscription} from '@apollo/client';
import {FEEDBACK_EMAIL} from '@env';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking} from 'react-native';
import {useAppState} from '~store/app-state';
import ProfileScreenContent, {
  ProfileScreenContentProps,
} from './ProfileScreenContent';

export interface ProfileScreenContainerProps
  extends Pick<ProfileScreenContentProps, 'onSignInPress'> {
  onNavigateTo: (screen: string) => void;
}

const USER_SUBSCRIPTION_GQL = gql`
  subscription ($userId: uuid) {
    users(where: {id: {_eq: $userId}}) {
      id
      name
      profiles {
        photos(path: "$[0]")
        age
      }
    }
  }
`;

const ProfileScreenContainer = observer(
  (props: ProfileScreenContainerProps) => {
    const appState = useAppState();
    const {t} = useTranslation();

    const userSub = useSubscription(USER_SUBSCRIPTION_GQL, {
      skip: !appState.queriesEnabled,
      variables: {
        userId: appState.userId,
      },
    });

    const user = userSub?.data?.users?.[0];
    const uri = user?.profiles?.[0]?.photos?.uri;

    return (
      <ProfileScreenContent
        user={{
          profileId: user?.age?.id,
          age: user?.age,
          isOnline: false,
          name: appState?.user?.name,
          avatar: uri,
          photos: [],
        }}
        isAuthorized={appState.isAuthorized}
        isFreeAccess={appState.isFreeAccess}
        onSignInPress={props.onSignInPress}
        onListItemPress={key => {
          switch (key) {
            case 'signout':
              Alert.alert(t('profile-screen.signout-prompt-title'), '', [
                {
                  onPress: async () => {
                    appState.logOut();
                  },
                  text: t('ok')!,
                  style: 'default',
                },
                {
                  text: t('cancel')!,
                  style: 'cancel',
                },
              ]);
              break;
            case 'feedback':
              Linking.openURL(`mailto:${FEEDBACK_EMAIL}`);
              break;
            default:
              props.onNavigateTo(key);
          }
        }}
      />
    );
  },
);

export default ProfileScreenContainer;
