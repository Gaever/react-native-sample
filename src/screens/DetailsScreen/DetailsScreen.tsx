import React, {useCallback} from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import {User} from '~src/types';
import {
  useCardActionsNavigation,
  useClaimActionNavigation,
} from '~src/utils/use-actions';
import DetailsScreenContainer, {
  DetailsScreenContainerProps,
} from './DetailsScreenContainer';

export interface DetailsScreenProps
  extends Pick<DetailsScreenContainerProps, 'isPreview'> {
  targetUser: User;
}

const DetailsScreen: ScreenFC<DetailsScreenProps> = props => {
  const {targetUser} = props;
  const {navigateToChatRoom, onUnauthorizedPress} = useCardActionsNavigation({
    componentId: props.componentId,
  });
  const {onClaimPress} = useClaimActionNavigation({
    componentId: props.componentId,
    targetUserId: props.targetUser.userId!,
  });

  const goBack = useCallback(() => {
    Navigation.pop(props.componentId);
  }, [props.componentId]);

  return (
    <DetailsScreenContainer
      user={targetUser}
      onClaimPress={onClaimPress}
      onBackPress={goBack}
      onChatPress={navigateToChatRoom}
      onUnauthorizedPress={onUnauthorizedPress}
      isPreview={props.isPreview}
    />
  );
};

DetailsScreen.screenName = 'DetailsScreen';

export const layoutOptions: (
  props: DetailsScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,

    name: DetailsScreen.screenName,
    options: {
      topBar: {
        visible: false,
      },
    },
  },
});

export default DetailsScreen;
