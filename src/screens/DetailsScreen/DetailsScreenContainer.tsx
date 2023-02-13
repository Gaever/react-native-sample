import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import {useCardActions, useCardActionsProps} from '~src/utils/use-actions';
import {FeedStoreContext, useAppState} from '~store/app-state';
import DetailsScreenContent, {
  DetailsScreenContentProps,
} from './DetailsScreenContent';

export interface DetailsScreenContainerProps
  extends Pick<
      DetailsScreenContentProps,
      'user' | 'onBackPress' | 'onClaimPress' | 'isPreview'
    >,
    useCardActionsProps {}

const DetailsScreenContainer = observer(
  (props: DetailsScreenContainerProps) => {
    const {likedUserIds, addLikedUserId: addId} = useContext(FeedStoreContext);
    const {onChatPress, onLikePress} = useCardActions({
      onUnauthorizedPress: props.onUnauthorizedPress,
      onChatPress: props.onChatPress,
    });
    const {user} = useAppState();

    const isLiked = !!likedUserIds?.[props.user.profileId!];

    return (
      <DetailsScreenContent
        dontShowPhotos={!!user?.dont_show_photos}
        isLiked={isLiked}
        onChatPress={() => {
          onChatPress(props.user);
        }}
        onLikePress={() => {
          if (onLikePress(props.user)) {
            addId(props.user.profileId);
          }
        }}
        user={props.user}
        onBackPress={props.onBackPress}
        onClaimPress={props.onClaimPress}
        isPreview={props.isPreview}
      />
    );
  },
);

export default DetailsScreenContainer;
