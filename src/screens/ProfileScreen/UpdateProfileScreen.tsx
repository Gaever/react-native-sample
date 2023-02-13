import React, {useState} from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import i18n from '~src/i18n';
import CreateProfileScreenContainer from '~src/screens/SignInModal/CreateProfileScreenContainer';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import * as DetailsScreen from '~src/screens/DetailsScreen/DetailsScreen';
import {User} from '~src/types';
import {Platform} from 'react-native';

export interface UpdateProfileScreenProps {}

const UpdateProfileScreen: ScreenFC<UpdateProfileScreenProps> = props => {
  const [onSubmitCb, setOnSubmitCb] = useState<(() => void) | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useNavigationButtonPress(e => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      if (e.buttonId === 'UpdateProfileScreen.button-save') {
        onSubmitCb?.();
      }
    }
  });

  return (
    <CreateProfileScreenContainer
      onSubmit={() => {
        setIsSubmitting(false);
        Navigation.pop(props.componentId);
      }}
      showOnPreviewPress
      registerSubmitHandler={setOnSubmitCb}
      showSubmitButton={false}
      variant="update"
      onPreviewPress={async (user: User) => {
        Navigation.push(
          props.componentId,
          await DetailsScreen.layoutOptions({
            targetUser: user,
            isPreview: true,
          }),
        );
      }}
    />
  );
};

UpdateProfileScreen.screenName = 'UpdateProfileScreen';
export const layoutOptions: (
  props?: UpdateProfileScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: UpdateProfileScreen.screenName,
    options: {
      topBar: {
        title: {
          text: i18n.t('sign-in-modal.create-profile-screen.modal-title')!,
        },
        backButton: {
          showTitle: false,
        },
        rightButtons: [
          {
            id: 'UpdateProfileScreen.button-save',
            text: i18n.t('save')!,
            ...Platform.select({
              ios: null,
              android: {
                color: '#000000',
              },
            }),
          },
        ],
      },
    },
  },
});

export default UpdateProfileScreen;
