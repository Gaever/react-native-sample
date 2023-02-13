import {useMutation} from '@tanstack/react-query';
import {observer} from 'mobx-react-lite';
import {Box, Button, Spinner} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorLayout from '~components/ErrorLayout';
import OAuth, {OAuthProps} from '~src/utils/OAuth';
import {useAppState, useRefetchUser} from '~store/app-state';
import useFeatures from '~src/utils/use-features';
import WelcomeScreenContent, {
  WelcomeScreenContentProps,
} from './WelcomeScreenContent';
import FirstTimeView from '~components/FirstTimeView';

export interface WelcomeScreenContainerProps
  extends Partial<WelcomeScreenContentProps> {
  onSignIn: (nextPage: string | null) => void;
}

const WelcomeScreenContainer = observer(
  (props: WelcomeScreenContainerProps) => {
    const {
      setAuthJwt,
      setIsAuthorizedView,
      logOut,
      isNotFirstOpen,
      setIsNotFirstOpen,
    } = useAppState();
    const features = useFeatures();
    const refetchUser = useRefetchUser();

    useEffect(() => {
      logOut();
    }, []);

    const onSuccessSignIn = useCallback(
      async (result: {
        authJwt: string | null | undefined;
        nextPage?: string | null | undefined;
      }) => {
        const token = result?.authJwt;
        const nextPage = result?.nextPage || null;
        if (token) {
          setAuthJwt(token);
          if (!nextPage) {
            setIsAuthorizedView(true);
          }
          await refetchUser();
          props.onSignIn(nextPage);
        }
      },
      [],
    );

    const {t} = useTranslation();
    const oauthMutation = useMutation(
      async (provider: OAuthProps['provider']) => OAuth({provider}),
      {
        onSuccess: async result => {
          onSuccessSignIn({authJwt: result?.jwt, nextPage: result?.nextPage});
        },
      },
    );

    if (oauthMutation.isLoading) {
      return (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Spinner color="gray.400" />
        </Box>
      );
    }

    if (
      (oauthMutation.status === 'success' && !oauthMutation.data) ||
      oauthMutation.error
    ) {
      return (
        <ErrorLayout
          error={t('generic-error')!}
          actionsButtons={
            <Button onPress={props.onBackPress}>{t('close-modal')}</Button>
          }
        />
      );
    }

    if (!isNotFirstOpen) {
      return (
        <FirstTimeView
          onClose={() => {
            setIsNotFirstOpen(true);
          }}
        />
      );
    }

    return (
      <WelcomeScreenContent
        onSignInWithSms={async result => {
          onSuccessSignIn({
            authJwt: result?.authJwt,
            nextPage: result?.nextPage,
          });
        }}
        variant={props.variant}
        onBackPress={() => {
          props.onBackPress?.();
        }}
        onSignUpPress={() => {
          props.onSignUpPress?.();
        }}
        onPolicyPress={props.onPolicyPress}
        onRulesPress={props.onRulesPress}
        onSignInWithProviderPress={async provider => {
          oauthMutation.mutate(provider);
        }}
        onSignInWithEmailPress={async () => {
          props.onSignInWithEmailPress?.();
        }}
        features={features['signIn']}
      />
    );
  },
);

export default WelcomeScreenContainer;
