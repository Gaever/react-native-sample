import {
  Box,
  Button,
  Center,
  Heading,
  Icon,
  IconButton,
  Pressable,
  ScrollView,
  Text,
  useColorMode,
  useTheme,
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AppleSocialButton,
  GoogleSocialButton,
  VkontakteSocialButton,
  // @ts-expect-error
} from 'rn-social-buttons';
import SignInVisual from '~components/SignInVisual';
import stylesheet from '~src/styles';

import SignInModalFooter from '~components/SignInModalFooter';
import {OAuthProps} from '~src/utils/OAuth';
import PhoneInput from '~components/PhoneSignInForm';
import PhoneSignInForm from '~components/PhoneSignInForm';
import {Font} from '~src/theme';
import {smsVerifyRes} from '~src/api';

export interface WelcomeScreenContentProps {
  variant?: 'signin' | 'signup';
  onBackPress: () => void;
  onSignUpPress: () => void;
  onSignInWithEmailPress: () => void;
  onSignInWithProviderPress: (provider: OAuthProps['provider']) => void;
  onSignInWithSms: (data: smsVerifyRes) => void;
  onPolicyPress?: () => void;
  onRulesPress?: () => void;
  features: string[];
}

function StyledSocialButton(props: {
  Component: React.FC<any>;
  componentProps?: any;
}) {
  const theme = useTheme();

  return (
    <props.Component
      {...props.componentProps}
      buttonViewStyle={{
        flex: 1,
        elevation: 2,
        flexDirection: 'row',
        borderRadius: theme.radii['md'],
        margin: 0,
        height: 48,
        ...props.componentProps?.buttonViewStyle,
      }}
      textStyle={{
        fontFamily: theme.fontConfig.Inter[500].normal,
        fontSize: theme.fontSizes['sm'],
        ...props.componentProps?.textStyle,
      }}
    />
  );
}

function WelcomeScreenContent(props: WelcomeScreenContentProps) {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [variant, setVariant] = useState<
    NonNullable<WelcomeScreenContentProps['variant']>
  >(props.variant || 'signup');

  useEffect(() => {
    if (props.variant) {
      setVariant(props.variant);
    }
  }, [props.variant]);

  return (
    <SafeAreaView style={stylesheet.modalContainer}>
      <View
        style={{
          position: 'absolute',
          flex: 1,
          top: 0,
          bottom: insets.bottom + 50,
          left: 0,
          right: 0,
        }}>
        <SignInVisual />
      </View>
      <View style={{flex: 2}}></View>
      <Box
        colorScheme="dark"
        flex={3}
        borderTopRadius={theme.radii['2xl']}
        backgroundColor={
          colorMode === 'dark' ? theme.colors.black : theme.colors.white
        }>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5} flex={1} py={4} px={5}>
            <Box flex={1}>
              <Heading shadow="none" textAlign="center">
                {t(`sign-in-modal.welcome-screen.variant-${variant}.header`)}{' '}
                <Text color="primary.400">{t('app-title')}</Text>
              </Heading>
            </Box>

            {props.features.includes('sms') ? (
              <Box px={2}>
                <PhoneSignInForm
                  onSuccess={props.onSignInWithSms}
                  variant={variant}
                />
              </Box>
            ) : null}
            {props.features.includes('vk') ? (
              <Box px={2}>
                <StyledSocialButton
                  Component={VkontakteSocialButton}
                  componentProps={{
                    buttonText: t(`social-buttons.variant-${variant}.vk`),
                    onPress: () => {
                      props.onSignInWithProviderPress('vk');
                    },
                  }}
                />
              </Box>
            ) : null}

            {props.features.includes('google') ? (
              <Box px={2}>
                <Box shadow={1}>
                  <StyledSocialButton
                    Component={GoogleSocialButton}
                    componentProps={{
                      buttonViewStyle: {
                        backgroundColor: theme.colors.black,
                      },
                      onPress: () => {
                        props.onSignInWithProviderPress('google');
                      },
                      buttonText: t(`social-buttons.variant-${variant}.google`),
                      textStyle: {
                        color: 'white',
                        fontFamily: Font.InterBold,
                      },
                      logoStyle: {width: 20, height: 20},
                    }}
                  />
                </Box>
              </Box>
            ) : null}

            {props.features.includes('apple') ? (
              <Box px={2}>
                <StyledSocialButton
                  Component={AppleSocialButton}
                  componentProps={{
                    buttonText: t(`social-buttons.variant-${variant}.apple`),
                    logoStyle: {width: 20, height: 20},
                  }}
                />
              </Box>
            ) : null}

            {props.features.includes('email') ? (
              <Box px={2}>
                <Button
                  onPress={async () => {
                    if (variant === 'signup') {
                      props.onSignUpPress();
                    } else {
                      props.onSignInWithEmailPress();
                    }
                  }}
                  variant="elevated"
                  _text={{
                    fontWeight: 500,
                  }}
                  flex={1}
                  leftIcon={
                    <Icon
                      name="email"
                      as={MaterialCommunityIcons}
                      color="primary.400"
                      size={6}
                    />
                  }>
                  {t(`social-buttons.variant-${variant}.email`)}
                </Button>
              </Box>
            ) : null}
          </VStack>
          <Center mt={2}>
            <Pressable onPress={props.onPolicyPress}>
              <Text color="gray.500" fontSize="xs" mb={2}>
                {t('confidencial-policy')}
              </Text>
            </Pressable>
            <Pressable onPress={props.onRulesPress}>
              <Text color="gray.500" fontSize="xs">
                {t('app-rules')}
              </Text>
            </Pressable>
          </Center>
        </ScrollView>
        <SignInModalFooter
          variant={variant}
          px={5}
          onPress={() => {
            setVariant(variant === 'signin' ? 'signup' : 'signin');
          }}
        />
      </Box>
    </SafeAreaView>
  );
}

export default WelcomeScreenContent;
