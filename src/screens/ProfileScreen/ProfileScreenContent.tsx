import {useQuery} from '@tanstack/react-query';
import {
  Avatar,
  Box,
  Center,
  ITextProps,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonLink from '~components/ui/ButtonLink';
import ListItemButton, {
  ListItemButtonProps,
} from '~components/ui/ListItemButton';
import {WelcomeScreenContentProps} from '~src/screens/SignInModal/WelcomeScreenContent';
import stylesheet from '~src/styles';
import DeviceInfo from 'react-native-device-info';
import {User} from '~src/types';
import {Platform} from 'react-native';
import getAppVersion from '~src/utils/app-version';

export interface ProfileScreenContentProps {
  isAuthorized: boolean;
  onSignInPress: (
    variant: NonNullable<WelcomeScreenContentProps['variant']>,
  ) => void;
  onListItemPress: (key: string) => void;
  user: User | undefined;
  isFreeAccess: boolean;
}

const textProps: ITextProps = {
  fontSize: 'xl',
  color: 'black',
  fontWeight: 700,
  textAlign: 'center',
};

function ProfileScreenContent(props: ProfileScreenContentProps) {
  const {t} = useTranslation();
  const defaultAvatarQuery = useQuery(['default-avatar'], async () =>
    MaterialCommunityIcons.getImageSource('account', 100, '#ffffff'),
  );

  const flatListData: (ListItemButtonProps | null)[] = [
    props.isAuthorized
      ? {
          itemKey: 'profile',
          label: t('profile-screen.flat-list.profile'),
          onPress: () => {
            props.onListItemPress('profile');
          },
        }
      : null,
    props.isAuthorized && !props.isFreeAccess
      ? {
          itemKey: 'premium',
          label: t('profile-screen.flat-list.premium'),
          onPress: () => {
            props.onListItemPress('premium');
          },
        }
      : null,
    {
      itemKey: 'rules',
      label: t('app-rules'),
      onPress: () => {
        props.onListItemPress('rules');
      },
    },
    {
      itemKey: 'policy',
      label: t('confidencial-policy'),
      onPress: () => {
        props.onListItemPress('policy');
      },
    },
    {
      itemKey: 'feedback',
      label: t('profile-screen.flat-list.feedback'),
      onPress: () => {
        props.onListItemPress('feedback');
      },
    },
    props.isAuthorized
      ? {
          itemKey: 'signout',
          label: t('profile-screen.flat-list.signout'),
          onPress: () => {
            props.onListItemPress('signout');
          },
        }
      : null,
  ];

  return (
    <SafeAreaView style={stylesheet.container}>
      <Box
        style={{
          position: 'absolute',
          flex: 1,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <Box
          bg={{
            linearGradient: {
              colors: props.isAuthorized
                ? ['secondary.400', 'primary.400']
                : ['secondary.200', 'secondary.400'],
              start: [0, 1],
              end: [0, 0],
            },
          }}
          flex={1}
        />
        <Box flex={2.5} />
      </Box>
      <Box flex={1}></Box>
      <Box flex={4} borderTopRadius="2xl" backgroundColor="white">
        <Box position="absolute" top={-50} zIndex={1} w="100%">
          <Center>
            <Avatar
              size="xl"
              borderColor="white"
              borderWidth={3}
              {...(defaultAvatarQuery.data?.uri && !props.user?.avatar
                ? {p: 3}
                : null)}
              {...(props.user?.avatar || defaultAvatarQuery.data?.uri
                ? {
                    source: {
                      uri: props.user?.avatar || defaultAvatarQuery.data?.uri,
                    },
                  }
                : null)}
            />
          </Center>
        </Box>
        <ScrollView pt={16}>
          {props.isAuthorized ? (
            <Text {...textProps} pb={6}>
              {props.user?.name}
            </Text>
          ) : null}
          {!props.isAuthorized ? (
            <Box flex={1} pb={6}>
              <ButtonLink
                onPress={() => {
                  props.onSignInPress('signin');
                }}
                TextProps={{...textProps, underline: true}}>
                {t('profile-screen.signin-or-signup.0')}
              </ButtonLink>
              <Text {...textProps}>
                {t('profile-screen.signin-or-signup.1')}
              </Text>
              <ButtonLink
                onPress={() => {
                  props.onSignInPress('signup');
                }}
                TextProps={{...textProps, underline: true}}>
                {t('profile-screen.signin-or-signup.2')}
              </ButtonLink>
            </Box>
          ) : null}
          <VStack py={4} pt={0} px={5}>
            {flatListData.map(item =>
              item ? <ListItemButton key={item.itemKey} {...item} /> : null,
            )}
          </VStack>
        </ScrollView>
        <Box w="100%" p={2} bottom={0} minHeight="55px" h="55px">
          <Center>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              {new Date().getFullYear()} {t('profile-screen.copyright')}
              {'\n'}
              Nikah Pro {Platform.OS} {getAppVersion()}
            </Text>
          </Center>
        </Box>
      </Box>
    </SafeAreaView>
  );
}

export default ProfileScreenContent;
