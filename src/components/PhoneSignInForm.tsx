import {RECAPTCHA_BASE_URL} from '@env';
import {useMutation} from '@tanstack/react-query';
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Spinner,
  Text,
  TextField,
} from 'native-base';
import React, {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import Recaptcha, {RecaptchaHandles} from 'react-native-recaptcha-that-works';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  firebaseSmsSignIn,
  firebaseSmsValidate,
  getFirebaseRecaptchaSiteKey,
  smsVerifyRes,
} from '~src/api';
import {WelcomeScreenContentProps} from '~src/screens/SignInModal/WelcomeScreenContent';
import formatError from '~src/utils/format-error';
import PhoneInput from './PhoneInput';

function sanitizePhone(phone: string) {
  return phone.replace(/[^\d]/gim, '');
}

export interface PhoneInputProps {
  variant: WelcomeScreenContentProps['variant'];
  onSuccess: (data: smsVerifyRes) => void;
}

function PhoneSignInForm(props: PhoneInputProps) {
  const [stage, setStage] = useState<'enter-phone' | 'enter-code'>(
    'enter-phone',
  );
  const [isRecaptchaValidating, setIsRecaptchaValidating] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState<any>(undefined);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState<string>('');

  const getFirebaseRecaptchaMutation = useMutation(
    getFirebaseRecaptchaSiteKey,
    {
      onSuccess: data => {
        setRecaptchaSiteKey(data.siteKey || '');
      },
    },
  );

  const {t} = useTranslation();
  const $recaptcha = useRef<RecaptchaHandles>(null);

  const phoneForm = useForm<{phone: string}>({
    defaultValues: {
      phone: '',
    },
  });
  const codeForm = useForm<{code: string}>({
    defaultValues: {
      code: '',
    },
  });
  const submitPhoneMutation = useMutation(firebaseSmsSignIn, {
    onSuccess: () => {
      setStage('enter-code');
    },
  });
  const submitCodeMutation = useMutation(firebaseSmsValidate, {
    onSuccess: data => {
      props.onSuccess(data);
    },
  });

  const onVerify = (token: string) => {
    setIsRecaptchaValidating(false);
    submitPhoneMutation.mutate({
      phone: sanitizePhone(phoneForm.getValues('phone')),
      recaptchaToken: token,
    });
  };

  const onExpire = () => {
    setIsRecaptchaValidating(false);
  };

  const onRecaptchaError = (error: string) => {
    setIsRecaptchaValidating(false);
    setRecaptchaError(error);
  };

  const onSubmitPhone = async () => {
    await getFirebaseRecaptchaMutation.mutateAsync();
    setIsRecaptchaValidating(true);
    $recaptcha.current?.open();
  };

  if (stage === 'enter-phone') {
    return (
      <Box>
        <Recaptcha
          ref={$recaptcha}
          siteKey={recaptchaSiteKey}
          baseUrl={RECAPTCHA_BASE_URL}
          onVerify={onVerify}
          onExpire={onExpire}
          onError={onRecaptchaError}
          size="invisible"
          hideBadge
          loadingComponent={<Box />}
          footerComponent={<Box />}
          headerComponent={<Box />}
          style={{backgroundColor: 'transparent'}}
        />

        <Text color="gray.600" fontSize="xs" textAlign="center" mb={4}>
          {t(
            `sign-in-modal.welcome-screen.variant-${props.variant}.phone-title`,
          )}
        </Text>
        <Box mb={4} alignItems="center" justifyContent="center">
          <PhoneInput
            error={
              formatError(
                // @ts-expect-error
                submitPhoneMutation.error?.phone ||
                  submitPhoneMutation.error ||
                  recaptchaError,
              )?.error
            }
            isLoading={
              (submitPhoneMutation.isLoading || isRecaptchaValidating) &&
              !recaptchaError
            }
            onChange={value => {
              phoneForm.setValue('phone', value);
            }}
          />
        </Box>
        <Button
          disabled={submitPhoneMutation.isLoading || isRecaptchaValidating}
          onPress={phoneForm.handleSubmit(onSubmitPhone)}>
          {t(
            `sign-in-modal.welcome-screen.variant-${props.variant}.phone-submit`,
          )}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Text color="gray.600" fontSize="xs" textAlign="center" mb={4}>
        {t(`sign-in-modal.welcome-screen.variant-${props.variant}.phone-title`)}
      </Text>

      <Box mb={4}>
        <Box borderWidth={1} borderColor="gray.300" borderRadius="lg">
          <HStack
            h="63px"
            w="100%"
            // space={2}
            flexDir="row"
            alignItems="center"
            justifyContent="space-between">
            <Box>
              <IconButton
                hitSlop={8}
                onPress={() => {
                  setStage('enter-phone');
                }}
                icon={
                  <Icon
                    as={MaterialCommunityIcons}
                    name="arrow-left"
                    size={7}
                    color="gray.500"
                  />
                }
              />
            </Box>
            <Box flex={1}>
              {/* @ts-ignore */}
              <TextField
                h="100%"
                // w="50%"
                autoFocus
                placeholder={t(`sign-in-modal.welcome-screen.enter-sms-code`)!}
                onChangeText={text => {
                  codeForm.setValue('code', text);
                }}
                fontSize="xl"
                pt={5}
                // ml={4}
                fontWeight={600}
                maxLength={codeForm.getValues('code') ? 6 : undefined}
                keyboardType="number-pad"
                borderBottomWidth={0}
                bg="red.100"
                width="100%"
                autoCapitalize="none"
              />
            </Box>
            <Box
              alignItems="center"
              justifyContent="center"
              pl={2}
              pr={4}
              h="100%">
              {submitPhoneMutation.isLoading ? (
                <Spinner size="sm" color="gray.500" />
              ) : (
                <Pressable onPress={onSubmitPhone}>
                  <Text fontSize="xs" color="gray.500" fontWeight={600}>
                    {t(`sign-in-modal.welcome-screen.resend-code`)}
                  </Text>
                </Pressable>
              )}
            </Box>
          </HStack>
        </Box>
        {submitPhoneMutation.error || submitCodeMutation.error ? (
          <Text color="error.500" fontSize="sm" ml={4}>
            {
              formatError(
                // @ts-expect-error
                submitPhoneMutation.error?.phone ||
                  submitPhoneMutation.error ||
                  // @ts-expect-error
                  submitCodeMutation.error?.code ||
                  submitCodeMutation.error,
              )?.error
            }
          </Text>
        ) : null}
      </Box>

      <Button
        isLoading={submitCodeMutation.isLoading}
        disabled={submitCodeMutation.isLoading}
        onPress={codeForm.handleSubmit(({code}) =>
          submitCodeMutation.mutate({
            phone: sanitizePhone(phoneForm.getValues('phone')),
            code,
            sessionInfo: submitPhoneMutation.data?.sessionInfo!,
          }),
        )}>
        {t(
          `sign-in-modal.welcome-screen.variant-${props.variant}.phone-submit`,
        )}
      </Button>
    </Box>
  );
}

export default PhoneSignInForm;
