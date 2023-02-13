import {
  gql,
  useMutation as useGqlMutation,
  useSubscription,
} from '@apollo/client';
import {useMutation as useHttpMutation} from '@tanstack/react-query';
import {observer} from 'mobx-react-lite';
import {Box, Spinner} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {uploadAsset} from '~src/api';
import {ProfileFormData, User} from '~src/types';
import {apolloClient} from '~src/utils/apollo-client';
import {useAppState, useRefetchUser} from '~store/app-state';
import CreateProfileScreenContent, {
  CreateProfileScreenContentProps,
} from './CreateProfileScreenContent';
import {HASURA_URL, HASURA_WS_URL} from '@env';

export interface CreateProfileScreenContainerProps
  extends Pick<
    CreateProfileScreenContentProps,
    'showSubmitButton' | 'registerSubmitHandler'
  > {
  onSubmit: (isFreeAccess: boolean) => void;
  variant: 'create' | 'update';
  onPreviewPress?: (user: User) => void;
  showOnPreviewPress: boolean;
}

const PROFILE_SUBSCRIPTION_GQL = gql`
  subscription ($userId: uuid) {
    profile(where: {user: {id: {_eq: $userId}}}) {
      photos
      about
      age
      appearance
      can_move
      children
      citizenship
      city
      country
      disability
      dont_show_photos
      earn
      education
      gender
      hidgab
      marrige
      nation
      polygamy
      religion
      show_online
      wives
      name
      is_agent
      user {
        name
      }
    }
  }
`;

const CREATE_PROFILE_MUTATION = gql`
  mutation ($arg1: ProfileFormInput = {}) {
    createProfile(arg1: $arg1) {
      success
    }
  }
`;

const UPDATE_PROFILE_GQL = gql`
  mutation ($form: profile_set_input = {}, $userId: uuid, $name: String) {
    update_profile(_set: $form, where: {user: {id: {_eq: $userId}}}) {
      affected_rows
    }
    update_users(_set: {name: $name}, where: {id: {_eq: $userId}}) {
      affected_rows
    }
  }
`;

function formatGqlProfileResponse(profileSub: any) {
  if (!profileSub?.data?.profile?.[0]) return undefined;
  const {user, __typename, ...form} = profileSub?.data?.profile?.[0];

  return {
    ...form,
    name: user?.name,
  };
}

function clearEmptyPhotos(form: any) {
  if ((form?.photos?.length || 0) < 1) {
    return {
      ...form,
      photos: null,
    };
  }
  return form;
}

const CreateProfileScreenContainer = observer(
  (props: CreateProfileScreenContainerProps) => {
    const {t} = useTranslation();
    const refetchUser = useRefetchUser();

    const {userId, isAuthorizedView, logOut, authJwt, setIsAuthorizedView} =
      useAppState();
    const [ac, setAc] = useState<any>();

    useEffect(() => {
      setAc(
        apolloClient({
          gqlHttpUri: HASURA_URL,
          gqlWsUri: HASURA_WS_URL,
          getAuthJwt: () => authJwt,
          onTokenExpired: async () => {
            logOut();
          },
        }),
      );
    }, [authJwt]);

    const profileSub = useSubscription(PROFILE_SUBSCRIPTION_GQL, {
      skip: !userId,
      client: ac,
      variables: {
        userId,
      },
    });

    const form = formatGqlProfileResponse(profileSub);
    const formExists = form !== undefined;
    const {isFreeAccess} = useAppState();

    const onSubmitCompleted = useCallback(() => {
      if (isFreeAccess && !isAuthorizedView) {
        setIsAuthorizedView(true);
      }
      props.onSubmit(isFreeAccess);
    }, [isFreeAccess, isAuthorizedView]);

    const [insertProfileMutation] = useGqlMutation(CREATE_PROFILE_MUTATION, {
      onCompleted: onSubmitCompleted,
      client: ac,
    });
    const [updateProfileMutation] = useGqlMutation(UPDATE_PROFILE_GQL, {
      onCompleted: onSubmitCompleted,
      client: ac,
    });
    const uploadAssetMutation = useHttpMutation(uploadAsset);

    const onSubmit = useCallback(
      async (formData: ProfileFormData) => {
        const form = clearEmptyPhotos(formData);
        const {name} = form;
        if (
          form.marrige !== undefined &&
          form.marrige !== 'free' &&
          form.marrige !== 'occupied'
        ) {
          delete form.marrige;
        }

        if (formExists) {
          await updateProfileMutation({
            variables: {
              form,
              userId,
              name,
            },
          });
        } else {
          const res = await insertProfileMutation({
            variables: {
              arg1: form,
            },
          });

          // @ts-ignore
          if (!res.data?.createProfile?.success) {
            throw new Error('Failed to create profile');
          }
        }
        await refetchUser();
      },
      [formExists, userId, insertProfileMutation, updateProfileMutation],
    );

    if (userId && profileSub.loading) {
      return (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Spinner color="gray.400" />
        </Box>
      );
    }

    return (
      <CreateProfileScreenContent
        form={form}
        initialValues={form}
        onSubmit={onSubmit}
        onPreviewPress={() => {
          props?.onPreviewPress?.(form);
        }}
        showOnPreviewPress={props.showOnPreviewPress}
        onUploadAsset={uploadAssetMutation.mutateAsync}
        registerSubmitHandler={props.registerSubmitHandler}
        showSubmitButton={props.showSubmitButton}
        submitTitle={
          props.variant === 'create'
            ? t('sign-in-modal.create-profile-screen.continue')
            : t('save')
        }
      />
    );
  },
);

export default CreateProfileScreenContainer;
