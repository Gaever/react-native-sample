import {useMutation} from '@tanstack/react-query';
import {observer} from 'mobx-react-lite';
import {Box, Spinner} from 'native-base';
import React, {useEffect} from 'react';
import ErrorLayout from '~components/ErrorLayout';
import {validateEmailSignInToken} from '~src/api';
import {useAppState, useRefetchUser} from '~store/app-state';

export interface ValidateEmailScreenContainerProps {
  emailValidationToken: string;
  onErrorPress: () => void;
  onSuccess: (nextPage: string | null) => void;
}

const ValidateEmailScreenContainer = observer(
  (props: ValidateEmailScreenContainerProps) => {
    const {setAuthJwt, setIsAuthorizedView} = useAppState();
    const refetchUser = useRefetchUser();

    const validateEmailSignInTokenMutation = useMutation(
      validateEmailSignInToken,
      {
        onSuccess: async ({authJwt, nextPage}) => {
          setAuthJwt(authJwt!);
          await refetchUser();

          if (!nextPage) {
            setIsAuthorizedView(true);
          }

          props.onSuccess(nextPage || null);
        },
      },
    );

    useEffect(() => {
      validateEmailSignInTokenMutation.mutate({
        token: props.emailValidationToken,
      });
    }, []);

    if (validateEmailSignInTokenMutation.isLoading) {
      return (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Spinner color="gray.400" />
        </Box>
      );
    }

    if (validateEmailSignInTokenMutation.error) {
      return (
        <ErrorLayout
          // @ts-expect-error
          error={validateEmailSignInTokenMutation.error?.error || ''}
          actionsButtons={null}
        />
      );
    }

    return null;
  },
);

export default ValidateEmailScreenContainer;
