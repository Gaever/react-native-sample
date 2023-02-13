import {useMutation} from '@tanstack/react-query';
import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect} from 'react';
import ErrorLayout from '~components/ErrorLayout';
import {emailSignIn, testEmailSignIn} from '~src/api';
import SignInWithEmailScreenContent, {
  SignInWithEmailScreenContentProps,
} from '~src/screens/SignInModal/SignInWithEmailScreenContent';
import {APPLE_TEST_EMAIL, ANDROID_TEST_EMAIL} from '@env';
import {refetchUser, store, useAppState} from '~store/app-state';
import {useApolloClient} from '@apollo/client';
import {Box, Spinner} from 'native-base';

export interface SignInWithEmailScreenContainerProps
  extends Pick<
    SignInWithEmailScreenContentProps,
    'onPolicyPress' | 'onRulesPress'
  > {
  onSignUpPress: () => void;
  onTestSignIn: (nextPage: string | null) => void;
  footerVariant: SignInWithEmailScreenContentProps['footerVariant'];
}

const SignInWithEmailScreenContainer = observer(
  (props: SignInWithEmailScreenContainerProps) => {
    const {setAuthJwt, setIsAuthorizedView} = useAppState();

    const emailSignInMutation = useMutation(async (args: {email: string}) => {
      if (
        args.email === APPLE_TEST_EMAIL ||
        args.email === ANDROID_TEST_EMAIL
      ) {
        return testEmailSignIn(args);
      } else {
        return emailSignIn(args);
      }
    });
    const state: SignInWithEmailScreenContentProps['variant'] =
      (emailSignInMutation.isLoading && 'loading') ||
      (emailSignInMutation.status === 'success' && 'sent') ||
      'form';

    const ac = useApolloClient();

    const onTestSingIn = useCallback(
      async (authJwt: string, nextPage: string) => {
        setAuthJwt(authJwt);
        await refetchUser(store, ac);
        if (!nextPage) {
          setIsAuthorizedView(true);
        }
        props.onTestSignIn(nextPage || null);
      },
      [ac, props.onTestSignIn],
    );

    useEffect(() => {
      // @ts-expect-error
      if (emailSignInMutation.data?.authJwt) {
        onTestSingIn(
          // @ts-expect-error
          emailSignInMutation.data?.authJwt,
          // @ts-expect-error
          emailSignInMutation.data?.nextPage,
        );
      }
    }, [emailSignInMutation.data, props.onTestSignIn]);

    if (emailSignInMutation.error) {
      return (
        <ErrorLayout
          // @ts-expect-error
          error={emailSignInMutation.error?.error || ''}
          actionsButtons={null}
        />
      );
    }

    if (
      emailSignInMutation.variables?.email === APPLE_TEST_EMAIL ||
      emailSignInMutation.variables?.email === ANDROID_TEST_EMAIL
    ) {
      return (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Spinner color="gray.400" />
        </Box>
      );
    }

    return (
      <SignInWithEmailScreenContent
        onSignUpPress={props.onSignUpPress}
        variant={state}
        onPolicyPress={props.onPolicyPress}
        onRulesPress={props.onRulesPress}
        footerVariant={props.footerVariant}
        onSubmit={({email}) => {
          emailSignInMutation.mutate({email});
        }}
      />
    );
  },
);

export default SignInWithEmailScreenContainer;
