import React from 'react';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import {
  LayoutStackChildren,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import UserSuspendedScreenContainer, {
  UserSuspendedScreenContainerProps,
} from './UserSuspendedScreenContainer';

export interface UserSuspendedScreenProps
  extends UserSuspendedScreenContainerProps {}

const UserSuspendedScreen: ScreenFC<UserSuspendedScreenProps> = props => {
  return <UserSuspendedScreenContainer {...props} />;
};

UserSuspendedScreen.screenName = 'UserSuspendedScreen';
export const layoutOptions: (
  props?: UserSuspendedScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: UserSuspendedScreen.screenName,
    options: {
      modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
      hardwareBackButton: {
        dismissModalOnPress: false,
      },
      modal: {
        swipeToDismiss: false,
      },
      topBar: {
        visible: false,
      },
    },
  },
});

export default UserSuspendedScreen;
