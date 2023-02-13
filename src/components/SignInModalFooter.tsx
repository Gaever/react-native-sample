import {HStack, Text, IBoxProps, Box} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacityProps} from 'react-native';
import ButtonLink from './ui/ButtonLink';

export interface SignInModalFooterProps extends IBoxProps {
  variant: 'signin' | 'signup';
  onPress?: TouchableOpacityProps['onPress'];
}

function SignInModalFooter(props: SignInModalFooterProps) {
  const {variant, onPress, ...boxProps} = props;
  const {t} = useTranslation();

  return (
    <Box minH={50} justifyContent="center" {...boxProps}>
      <HStack justifyContent="space-between">
        <Text color="gray.600" fontSize={12}>
          {t(`sign-in-modal.modal-footer.variant-${variant}.text`)}
        </Text>
        <ButtonLink onPress={onPress}>
          {t(`sign-in-modal.modal-footer.variant-${variant}.link`)}
        </ButtonLink>
      </HStack>
    </Box>
  );
}

export default SignInModalFooter;
