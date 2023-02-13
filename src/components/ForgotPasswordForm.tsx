import {
  Box,
  Button,
  FormControl,
  Input,
  IStackProps,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {GenericFormProps} from '../types';
import {useGenericForm} from '../utils/use-generic-form';
import ButtonLink from './ui/ButtonLink';
import FCTextInput from './ui/FCTextInput';
import TextInput from './ui/TextInput';

export type ForgotPasswordFormData = {
  email?: string;
  password?: string;
};

export interface ForgotPasswordFormProps
  extends GenericFormProps<ForgotPasswordFormData> {
  vStackProps?: IStackProps;
  px?: number;
}

function ForgotPasswordForm(props: ForgotPasswordFormProps) {
  const px = props.px || 9;

  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<ForgotPasswordFormData>({
    defaultValues: props.initialValues,
  });
  const {t} = useTranslation();

  return (
    <Box flex={1}>
      <ScrollView flex={1}>
        <Box flex={1} px={px}>
          <VStack flex={1} space={6} {...props.vStackProps}>
            <Box pt={4}>
              <Text fontSize={12} fontWeight={600}>
                Введите свой адрес эл. почты и мы отправим вам инструкции по
                сбросу пароля
              </Text>
            </Box>

            <FCTextInput
              control={control}
              name="email"
              error={errors.email?.message}
              label={t('form.email')!}
            />
            <FCTextInput
              control={control}
              name="password"
              error={errors.password?.message}
              label={t('form.password')!}
            />
          </VStack>
        </Box>
      </ScrollView>
      <Box px={px} pb={5}>
        <Button onPress={handleSubmit(props.onSubmit)}>
          {t('sign-in-modal.forgot-password-screen.continue')}
        </Button>
      </Box>
    </Box>
  );
}

export default ForgotPasswordForm;
