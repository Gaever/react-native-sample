import {Box, Button, IStackProps, ScrollView, Text, VStack} from 'native-base';
import React from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import {GenericFormProps} from '../types';
import ButtonLink from './ui/ButtonLink';
import FCTextInput from './ui/FCTextInput';

export type SignUpFormData = {
  email?: string;
};

export interface SignUpFormProps extends GenericFormProps<SignUpFormData> {
  vStackProps?: IStackProps;
  px?: number;
  onPolicyPress: () => void;
  onRulesPress: () => void;
}

function SignUpForm(props: SignUpFormProps) {
  const px = props.px || 9;

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<SignUpFormData>({
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
            />
          </VStack>
        </Box>
      </ScrollView>
      <Box px={px} pb={5}>
        <Button onPress={handleSubmit(props.onSubmit)}>
          {t('sign-in-modal.sign-up-with-email-screen.continue')}
        </Button>
        <Box px={px} pb={5}>
          <Button onPress={handleSubmit(props.onSubmit)}>
            {t('sign-in-modal.sign-in-with-email-screen.continue')}
          </Button>
          <Box pt={2}>
            <Text textAlign="center">
              {t('sign-in-modal.sign-in-with-email-screen.confirm-rules.0')}
              <ButtonLink
                TextProps={{top: Platform.select({ios: '1px', android: '2px'})}}
                onPress={props.onPolicyPress}>
                {t('sign-in-modal.sign-in-with-email-screen.confirm-rules.1')}{' '}
              </ButtonLink>
              {t('sign-in-modal.sign-in-with-email-screen.confirm-rules.2')}{' '}
              <ButtonLink
                TextProps={{top: Platform.select({ios: '1px', android: '2px'})}}
                onPress={props.onRulesPress}>
                {t('sign-in-modal.sign-in-with-email-screen.confirm-rules.3')}
              </ButtonLink>
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUpForm;
