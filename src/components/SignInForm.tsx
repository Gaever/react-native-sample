import {Box, Button, IStackProps, ScrollView, Text, VStack} from 'native-base';
import React from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import {GenericFormProps} from '../types';
import ButtonLink from './ui/ButtonLink';
import FCTextInput from './ui/FCTextInput';

export type SignInFormData = {
  email?: string;
};

export interface SignInFormProps extends GenericFormProps<SignInFormData> {
  vStackProps?: IStackProps;
  px?: number;
  onPolicyPress: () => void;
  onRulesPress: () => void;
}

function SignInForm(props: SignInFormProps) {
  const px = props.px || 9;

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<SignInFormData>({
    defaultValues: props.initialValues,
  });
  const {t} = useTranslation();

  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <Box flex={1} px={px}>
          <VStack flex={1} space={6} {...props.vStackProps}>
            <FCTextInput
              control={control}
              name="email"
              error={errors.email?.message}
              label={t('form.email')!}
              rules={{
                required: true,
                pattern: {
                  value:
                    /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/g,
                  message: t('errors.email'),
                },
              }}
            />
          </VStack>
        </Box>
      </ScrollView>
      <Box px={px} pb={5}>
        <Button onPress={handleSubmit(props.onSubmit)}>
          {t('sign-in-modal.sign-in-with-email-screen.continue')}
        </Button>
        <Box pt={2}>
          <Text textAlign="center">
            {t('sign-in-modal.sign-in-with-email-screen.confirm-rules.0')}
            <ButtonLink
              TextProps={{top: Platform.select({ios: '1px', android: '4px'})}}
              onPress={props.onPolicyPress}>
              {t('sign-in-modal.sign-in-with-email-screen.confirm-rules.1')}{' '}
            </ButtonLink>
            {t('sign-in-modal.sign-in-with-email-screen.confirm-rules.2')}{' '}
            <ButtonLink
              TextProps={{top: Platform.select({ios: '1px', android: '4px'})}}
              onPress={props.onRulesPress}>
              {t('sign-in-modal.sign-in-with-email-screen.confirm-rules.3')}
            </ButtonLink>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default SignInForm;
