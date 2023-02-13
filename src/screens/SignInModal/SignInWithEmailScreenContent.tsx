import {Box, Spinner} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import SignInForm, {SignInFormProps} from '~components/SignInForm';
import {SignInModalFooterProps} from '~components/SignInModalFooter';
import SignInModalFormWrapper from '~components/SignInModalFormWrapper';
import {Text} from 'native-base';

export interface SignInWithEmailScreenContentProps
  extends Pick<SignInFormProps, 'onPolicyPress' | 'onRulesPress'> {
  onSignUpPress: () => void;
  onSubmit: (args: {email: string}) => void;
  variant: 'form' | 'sent' | 'loading';
  footerVariant: SignInModalFooterProps['variant'];
}

function SignInWithEmailScreenContent(
  props: SignInWithEmailScreenContentProps,
) {
  const {t} = useTranslation();
  return (
    <SignInModalFormWrapper
      SignInModalFooterProps={{
        variant: props.footerVariant,
        onPress: props.onSignUpPress,
      }}>
      {props.variant === 'form' ? (
        <SignInForm
          onPolicyPress={props.onPolicyPress}
          onRulesPress={props.onRulesPress}
          onSubmit={async ({email}) => {
            if (email) {
              props.onSubmit({email});
            }
          }}
        />
      ) : null}

      {props.variant === 'loading' ? (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Spinner color="gray.400" />
        </Box>
      ) : null}

      {props.variant === 'sent' ? (
        <Box px={9}>
          <Text fontSize="lg">
            {t('sign-in-modal.sign-in-with-email-screen.check-email')}
          </Text>
        </Box>
      ) : null}
    </SignInModalFormWrapper>
  );
}

export default SignInWithEmailScreenContent;
