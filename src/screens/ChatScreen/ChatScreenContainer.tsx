import {gql, useQuery} from '@apollo/client';
import {observer} from 'mobx-react-lite';
import {Box, Spinner} from 'native-base';
import React, {useCallback} from 'react';
import {User} from '~src/types';
import useChat from '~src/utils/use-chat';
import {useAppState} from '~store/app-state';
import ChatScreenContent, {ChatScreenContentProps} from './ChatScreenContent';
import {
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks';

export interface ChatScreenContainerProps
  extends Pick<ChatScreenContentProps, 'onBackPress'> {
  targetUserId: string;
  chatId?: string;
  profile?: any;
  onAvatarPress: (user: User) => void;
  onClaimPress: () => void;
  componentId: string;
}

const PROFILE_GQL = gql`
  query ($targetUserId: uuid) {
    profile(
      where: {
        user: {
          status: {_in: ["payed", "profileFilled"]}
          id: {_eq: $targetUserId}
        }
        name: {_is_null: false}
        age: {_is_null: false}
      }
    ) {
      age
      profileId: id
      created_at
      name
      photos
      userId
      show_online
      religion
      polygamy
      nation
      marrige
      hidgab
      gender
      education
      earn
      disability
      country
      city
      citizenship
      children
      can_move
      appearance
      about
      wives
    }
  }
`;

const ChatScreenContainer = observer((props: ChatScreenContainerProps) => {
  const {
    userId,
    queriesEnabled,
    user: currentUser,
    isPayedAccess,
    setOpenedChatTargetUserId,
  } = useAppState();
  const {
    sendMessageMutation,
    chatRoom,
    chatMessages,
    chatSubscription,
    isRequestFromCurrentUser,
    isRequestFromTargetUser,
    isCurrentUserHasRequestTextMessage,
    isChatHasResponse,
    isChatRoomExists,
    sendMessage,
    resendErrorMessage,
    removeErrorMessage,
  } = useChat({
    chatId: props.chatId,
    currentUser,
    currentUserId: userId!,
    targetUserId: props.targetUserId,
  });
  const profileQuery = useQuery(PROFILE_GQL, {
    variables: {
      targetUserId: props.targetUserId,
    },
    skip: !queriesEnabled || !!props.profile,
  });
  const user: User | undefined =
    props.profile || profileQuery.data?.profile?.[0];

  const isSubmitting = sendMessageMutation.isLoading;

  useNavigationComponentDidAppear(e => {
    if (e.componentId === props.componentId) {
      setOpenedChatTargetUserId(props.targetUserId);
    }
  });

  useNavigationComponentDidDisappear(e => {
    if (e.componentId === props.componentId) {
      setOpenedChatTargetUserId('');
    }
  });

  const onAvatarPress = useCallback(() => {
    if (user) {
      props.onAvatarPress?.(user);
    }
  }, [user, props.onAvatarPress]);

  if (
    (chatSubscription.loading &&
      !props.chatId &&
      (chatMessages?.length || 0) < 1) ||
    chatSubscription.error
  )
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Spinner color="gray.400" />
      </Box>
    );

  return (
    <ChatScreenContent
      dontShowPhotos={!!currentUser?.dont_show_photos}
      onDeleteFailedMessagePress={removeErrorMessage}
      onResendMessagePress={resendErrorMessage}
      isPayedAccess={isPayedAccess}
      onClaimPress={props.onClaimPress}
      onAvatarPress={onAvatarPress}
      onBackPress={props.onBackPress}
      onMessageSubmit={sendMessage}
      status={chatRoom?.status}
      messages={chatMessages}
      isSubmitting={isSubmitting}
      isChatRoomExists={isChatRoomExists}
      isRequestFromCurrentUser={isRequestFromCurrentUser}
      isRequestFromTargetUser={isRequestFromTargetUser}
      isCurrentUserHasRequestTextMessage={isCurrentUserHasRequestTextMessage}
      isChatHasResponse={isChatHasResponse}
      avatar={chatRoom?.picture}
      name={chatRoom?.name}
      chatRoomId={chatRoom.chatRoomId}
      currentUserId={userId!}
      targetUserId={props.targetUserId!}
    />
  );
});

export default ChatScreenContainer;
