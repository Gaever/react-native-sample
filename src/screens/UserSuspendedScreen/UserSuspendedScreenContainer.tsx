import React from 'react';
import {observer} from 'mobx-react-lite';
import UserSuspendedScreenContent, {
  UserSuspendedScreenContentProps,
} from './UserSuspendedScreenContent';
import {useAppState} from '~store/app-state';

export interface UserSuspendedScreenContainerProps
  extends Pick<UserSuspendedScreenContentProps, 'variant'> {}

const UserSuspendedScreenContainer = observer(
  (props: UserSuspendedScreenContainerProps) => {
    const {logOut} = useAppState();
    return <UserSuspendedScreenContent {...props} onLogoutPress={logOut} />;
  },
);

export default UserSuspendedScreenContainer;
