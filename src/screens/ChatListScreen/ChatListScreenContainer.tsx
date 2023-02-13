import {gql} from '@apollo/client';
import {observer} from 'mobx-react-lite';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ChatRoom} from '~src/types';
import {CHAT_MESSAGE_VARIANT} from '~src/utils/consts';
import useStatusSub from '~src/utils/use-status-sub';
import {getIsOnline} from '~src/utils/utils';
import {useAppState} from '~store/app-state';
import ChatListScreenContent, {
  ChatListScreenContentProps,
} from './ChatListScreenContent';

export interface ChatListScreenContainerProps
  extends Pick<ChatListScreenContentProps, 'onChatPress'> {}

const ChatListScreenContainer = observer(
  (props: ChatListScreenContainerProps) => {
    const {userId, chatRoomsQuery, user} = useAppState();
    useStatusSub();
    const {t} = useTranslation();

    const chatRooms: ChatRoom[] = useMemo(
      () =>
        (chatRoomsQuery?.data?.chat_rooms || []).map?.((item: any) => {
          const lastMessage = item?.chat_messages?.[0];
          const likeDirection =
            (lastMessage?.variant === CHAT_MESSAGE_VARIANT.like &&
              lastMessage?.author_user_id === userId &&
              'out') ||
            (lastMessage?.variant === CHAT_MESSAGE_VARIANT.like &&
              lastMessage?.author_user_id !== userId &&
              'in') ||
            undefined;

          const lastMessageText =
            (lastMessage?.variant === CHAT_MESSAGE_VARIANT.like &&
              likeDirection === 'in' &&
              t('chat-room.variant-like.you-were-liked')) ||
            (lastMessage?.variant === CHAT_MESSAGE_VARIANT.like &&
              likeDirection === 'out' &&
              t('chat-room.variant-like.you-liked')) ||
            lastMessage?.text ||
            '';
          const user = item?.chat_rooms_users__links?.[0]?.user;
          const profile = user?.profiles?.[0];
          const name = profile?.name;
          const picture = profile?.avatar;
          const lastReadMessage =
            item?.messages_reads?.[0]?.last_read_message_id;
          const isUnread = lastMessage?.id !== lastReadMessage;
          // @ts-expect-error
          const isOnline = getIsOnline({
            last_seen: user?.last_seen,
            show_online: profile?.show_online,
          });

          return {
            id: item?.id || '',
            targetUserId: user?.id,
            lastMessage: lastMessageText,
            lastMessageDate: lastMessage?.created_at,
            isUnread,
            isOnline,
            picture,
            name,
            profile,
          };
        }),
      [chatRoomsQuery?.data, userId],
    );

    return (
      <ChatListScreenContent
        chatRooms={chatRooms}
        dontShowPhotos={!!user?.dont_show_photos}
        onChatPress={props.onChatPress}
      />
    );
  },
);

export default ChatListScreenContainer;
