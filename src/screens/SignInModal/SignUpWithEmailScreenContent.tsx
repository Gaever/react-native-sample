import React from 'react';
import {SignInFormProps} from '~components/SignInForm';
import SignInModalFormWrapper from '~components/SignInModalFormWrapper';
import SignUpForm from '~components/SignUpForm';

export interface SignUpWithEmailScreenContentProps
  extends Pick<SignInFormProps, 'onPolicyPress' | 'onRulesPress'> {
  onSignInPress: () => void;
  onSubmit: () => void;
}

function SignUpWithEmailScreenContent(
  props: SignUpWithEmailScreenContentProps,
) {
  return (
    <SignInModalFormWrapper
      SignInModalFooterProps={{
        variant: 'signup',
        onPress: props.onSignInPress,
      }}>
      <SignUpForm
        onPolicyPress={props.onPolicyPress}
        onRulesPress={props.onRulesPress}
        onSubmit={async () => {
          props.onSubmit();
        }}
      />
    </SignInModalFormWrapper>
  );
}

export default SignUpWithEmailScreenContent;
