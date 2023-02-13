import {
  ApolloClient,
  gql,
  useApolloClient,
  useMutation,
  useSubscription,
} from '@apollo/client';
import {useMutation as useReactMutation} from '@tanstack/react-query';
import {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import uuid from 'react-native-uuid';
import {
  ChatMessage,
  ChatMessageFeedbackStatus,
  ChatRoom,
  User,
} from '~src/types';
import {useAppState} from '~store/app-state';
import {CHAT_MESSAGE_VARIANT, CHAT_ROOM_STATUS} from './consts';
import {truncatePush} from './truncate';

const CHAT_ROOM_QUERY = gql`
  query ($_and: [chat_rooms_bool_exp!] = {}) {
    chat_rooms(where: {_and: $_and}) {
      id
      status
      initial_messages: chat_messages(order_by: {created_at: asc}, limit: 4) {
        id
        author_user_id
        variant
      }
    }
  }
`;

const INSERT_ROOM_MUTATION = gql`
  mutation ($object: chat_rooms_insert_input = {}) {
    insert_chat_rooms_one(object: $object) {
      id
    }
  }
`;

const OPEN_ROOM_MUTATION = gql`
  mutation (
    $roomId: uuid = ""
    $setChatRoom: chat_rooms_set_input = {}
    $insertChatMessage: chat_message_insert_input = {}
  ) {
    update_chat_rooms_by_pk(pk_columns: {id: $roomId}, _set: $setChatRoom) {
      id
    }
    insert_chat_message_one(object: $insertChatMessage) {
      id
    }
  }
`;

const INSERT_MESSAGE_MUTATION = gql`
  mutation ($object: chat_message_insert_input = {}) {
    insert_chat_message_one(object: $object) {
      id
    }
  }
`;

const CHAT_QUERY = gql`
  subscription (
    $currentUserId: uuid = ""
    $targetUserId: uuid = ""
    $limit: Int = 10
    $offset: Int = 0
  ) {
    users(where: {id: {_eq: $targetUserId}}) {
      id
      profiles {
        id
        name
        avatar: photos(path: "$.[0].uri")
      }
      chat_rooms_users__links(
        where: {
          user: {id: {_neq: $currentUserId}}
          chat_room: {
            status: {_in: ["request", "open", "closed"]}
            _and: [
              {chat_rooms_users__links: {userId: {_eq: $currentUserId}}}
              {chat_rooms_users__links: {userId: {_eq: $targetUserId}}}
            ]
          }
        }
      ) {
        chat_room {
          id
          created_at
          status
          chat_messages(
            order_by: {created_at: desc}
            limit: $limit
            offset: $offset
          ) {
            id
            author_user_id
            text
            status
            variant
            created_at
          }
          initial_messages: chat_messages(
            order_by: {created_at: asc}
            limit: 4
          ) {
            id
            author_user_id
            variant
          }
        }
      }
    }
  }
`;

const READ_LAST_MESSAGE_MUTATION = gql`
  mutation ($last_read_message_id: uuid, $chat_room_id: uuid, $user_id: uuid) {
    insert_messages_read_one(
      object: {
        last_read_message_id: $last_read_message_id
        chat_room_id: $chat_room_id
        user_id: $user_id
      }
      on_conflict: {
        constraint: messages_read_pkey
        update_columns: last_read_message_id
      }
    ) {
      chat_room_id
    }
  }
`;

const SEND_PUSH_GQL = gql`
  mutation ($title: String, $message: String, $target_user_id: uuid) {
    AddPushMessage(
      title: $title
      message: $message
      target_user_id: $target_user_id
    ) {
      success
    }
  }
`;

async function getRoom<T>(
  ac: ApolloClient<T>,
  args: {
    currentUserId: string;
    targetUserId: string;
  },
) {
  const roomQuery = await ac.query({
    query: CHAT_ROOM_QUERY,
    variables: {
      _and: {
        _and: [
          {chat_rooms_users__links: {userId: {_eq: args.currentUserId}}},
          {chat_rooms_users__links: {userId: {_eq: args.targetUserId}}},
        ],
      },
    },
  });

  const room = roomQuery?.data?.chat_rooms?.[0];

  return room;
}

async function addMessage<T>(
  ac: ApolloClient<T>,
  args: {
    messageId?: string;
    roomId: string;
    currentUserId: string;
    variant: CHAT_MESSAGE_VARIANT;
    text?: string;
  },
) {
  await ac.mutate({
    mutation: INSERT_MESSAGE_MUTATION,
    variables: {
      object: {
        author_user_id: args.currentUserId,
        chat_room_id: args.roomId,
        variant: args.variant,
        ...(args.text ? {text: args.text} : null),
        ...(args.messageId ? {id: args.messageId} : null),
      },
    },
  });
}

async function addLikeMessage<T>(
  ac: ApolloClient<T>,
  args: {
    roomId: string | undefined;
    currentUserId: string;
    targetUserId: string;
    initialMessages: any;
  },
) {
  const roomId = args.roomId;

  const isRequestByTargetUser =
    args.targetUserId &&
    args?.initialMessages?.[0]?.author_user_id === args.targetUserId;

  if (roomId && !isRequestByTargetUser) {
    await addMessage(ac, {
      roomId,
      currentUserId: args.currentUserId,
      variant: CHAT_MESSAGE_VARIANT.like,
    });
  }
  if (roomId && isRequestByTargetUser) {
    await ac.mutate({
      mutation: OPEN_ROOM_MUTATION,
      variables: {
        roomId,
        setChatRoom: {
          status: CHAT_ROOM_STATUS.open,
        },
        insertChatMessage: {
          author_user_id: args.currentUserId,
          variant: CHAT_MESSAGE_VARIANT.like,
          chat_room_id: roomId,
        },
      },
    });
  }
  if (!roomId) {
    await addRoom(ac, {
      currentUserId: args.currentUserId,
      targetUserId: args.targetUserId,
      variant: CHAT_MESSAGE_VARIANT.like,
    });
  }
}

async function addRoom<T>(
  ac: ApolloClient<T>,
  args: {
    currentUserId: string;
    targetUserId: string;
    variant: CHAT_MESSAGE_VARIANT;
    text?: string;
    messageId?: string;
  },
) {
  await ac.mutate({
    mutation: INSERT_ROOM_MUTATION,
    variables: {
      object: {
        status: CHAT_ROOM_STATUS.request,
        chat_rooms_users__links: {
          data: [{userId: args.currentUserId}, {userId: args.targetUserId}],
        },
        chat_messages: {
          data: {
            author_user_id: args.currentUserId,
            variant: args.variant,
            ...(args.text ? {text: args.text} : null),
            ...(args.messageId ? {id: args.messageId} : null),
          },
        },
      },
    },
  });
}

async function addRequestMessage<T>(
  ac: ApolloClient<T>,
  args: {
    roomId: string | undefined;
    currentUserId: string;
    targetUserId: string;
    text: string;
    messageId?: string;
  },
) {
  const roomId = args.roomId;

  if (roomId) {
    await addMessage(ac, {
      messageId: args.messageId,
      currentUserId: args.currentUserId,
      roomId,
      variant: CHAT_MESSAGE_VARIANT.message,
      text: args.text,
    });
  } else {
    await addRoom(ac, {
      messageId: args.messageId,
      currentUserId: args.currentUserId,
      targetUserId: args.targetUserId,
      variant: CHAT_MESSAGE_VARIANT.message,
      text: args.text,
    });
  }
}

async function addResponseMessage<T>(
  ac: ApolloClient<T>,
  args: {
    roomId: string;
    currentUserId: string;
    text: string;
    messageId?: string;
  },
) {
  const roomId = args.roomId;

  await ac.mutate({
    mutation: OPEN_ROOM_MUTATION,
    variables: {
      roomId,
      setChatRoom: {
        status: CHAT_ROOM_STATUS.open,
      },
      insertChatMessage: {
        ...(args.messageId ? {id: args.messageId} : null),
        author_user_id: args.currentUserId,
        variant: CHAT_MESSAGE_VARIANT.message,
        text: args.text,
        chat_room_id: roomId,
      },
    },
  });
}

function mapChatQuery(
  chatQuery: any,
  tmpMessages: ChatMessage[],
): {
  chatRoom: ChatRoom;
  chatMessages: ChatMessage[];
  initialMessages: ChatMessage[];
} {
  const data = chatQuery?.data?.users?.[0];
  const chatRoom = data?.chat_rooms_users__links?.[0]?.chat_room;
  const profile = data?.profiles?.[0];
  const messages: ChatMessage[] = chatRoom?.chat_messages || [];
  const initialMessages: ChatMessage[] = chatRoom?.initial_messages || [];
  const name = profile?.name;
  const picture = profile?.avatar;
  const status = chatRoom?.status;

  const newTmpMessages = tmpMessages.filter(
    tmpMessage => !messages.find(message => tmpMessage.id === message.id),
  );

  return {
    chatRoom: {
      chatRoomId: chatRoom?.id,
      targetUserId: data?.id,
      created_at: new Date(chatRoom?.created_at),
      isUnread: true,
      picture,
      name,
      status,
    },
    chatMessages: [...newTmpMessages, ...messages],
    initialMessages,
  };
}

function useChat(props: {
  chatId?: string;
  currentUserId: string;
  currentUser: User | null;
  targetUserId?: string;
}) {
  const ac = useApolloClient();
  const {t} = useTranslation();
  const {chatRoomsQuery} = useAppState();

  const [tmpMessages, setTmpMessages] = useState<ChatMessage[]>([]);

  const sendPush = useCallback(
    async (args: {targetUserId: string; title?: string; message?: string}) => {
      await ac.mutate({
        mutation: SEND_PUSH_GQL,
        variables: {
          target_user_id: args.targetUserId,
          title: args.title,
          message: args.message,
        },
      });
    },
    [],
  );

  const preloadedMessages = props.chatId
    ? chatRoomsQuery?.data?.chat_rooms?.find(
        (item: any) => item?.id === props.chatId,
      )?.chat_messages
    : undefined;

  const chatSubscription = useSubscription(CHAT_QUERY, {
    skip: !(props.targetUserId && props.currentUserId),
    variables: {
      currentUserId: props.currentUserId,
      targetUserId: props.targetUserId,
      limit: 100,
    },
    onData: options => {
      const [mutate] = readLastMessageMutation;
      const chatRoom =
        options.data.data?.users?.[0]?.chat_rooms_users__links?.[0]?.chat_room;
      const lastMessageId = chatRoom?.chat_messages?.[0]?.id;
      const chatRoomId = chatRoom?.id;

      if (lastMessageId && chatRoomId) {
        mutate({
          variables: {
            last_read_message_id: lastMessageId,
            chat_room_id: chatRoomId,
            user_id: props.currentUserId,
          },
        });
      }
    },
  });

  const likeMutation = useReactMutation(
    async (args: {targetUserId: string; currentUser: User}) => {
      const {currentUserId} = props;
      const {targetUserId} = args;
      const room = await getRoom(ac, {
        currentUserId,
        targetUserId,
      });
      const roomId = room?.id;
      const initialMessages = room?.initial_messages;
      await addLikeMessage(ac, {
        roomId,
        currentUserId,
        targetUserId,
        initialMessages,
      });
      await sendPush({targetUserId, title: t('push.like-title')!});
    },
  );

  const requestMessageMutation = useReactMutation(
    async (args: {
      targetUserId: string;
      text: string;
      messageId?: string;
      currentUser: User;
    }) => {
      const {targetUserId, text, messageId} = args;
      const {currentUserId} = props;

      const room = await getRoom(ac, {
        currentUserId,
        targetUserId,
      });
      const roomId = room?.id;
      await addRequestMessage(ac, {
        roomId,
        currentUserId,
        targetUserId,
        text,
        messageId,
      });
      await sendPush({
        targetUserId,
        title: args.currentUser.name,
        message: truncatePush(text),
      });
    },
  );

  const responseMessageMutation = useReactMutation(
    async (args: {
      targetUserId: string;
      currentUser: User;
      roomId: string;
      text: string;
      messageId?: string;
    }) => {
      const {roomId, text, messageId} = args;
      const {currentUserId} = props;

      await addResponseMessage(ac, {
        roomId,
        currentUserId,
        text,
        messageId,
      });

      await sendPush({
        targetUserId: args.targetUserId,
        title: args.currentUser.name,
        message: truncatePush(text),
      });
    },
  );

  const sendMessageMutation = useReactMutation(
    async (args: {
      targetUserId: string;
      currentUser: User;
      roomId: string;
      text: string;
      messageId?: string;
    }) => {
      const {roomId, text, messageId} = args;
      // throw new Error('kekvs');

      await addMessage(ac, {
        roomId,
        currentUserId: props.currentUserId,
        variant: CHAT_MESSAGE_VARIANT.message,
        text,
        messageId,
      });

      await sendPush({
        targetUserId: args.targetUserId,
        title: args.currentUser.name,
        message: truncatePush(text),
      });
    },
  );

  const readLastMessageMutation = useMutation(READ_LAST_MESSAGE_MUTATION);

  const {chatRoom, chatMessages, initialMessages} = useMemo(
    () => mapChatQuery(chatSubscription, tmpMessages),
    [chatSubscription, tmpMessages],
  );

  const completeChatMessages =
    (chatMessages?.length || 0) < 1 && preloadedMessages
      ? preloadedMessages
      : chatMessages;

  const hasRequestMessage = initialMessages.length > 0;
  const isChatRequested = chatRoom?.status === CHAT_ROOM_STATUS.request;
  const isChatRoomExists = !!chatRoom.chatRoomId;
  const isRequestFromTargetUser =
    hasRequestMessage &&
    initialMessages[0]?.author_user_id === props.targetUserId;
  const isRequestFromCurrentUser =
    hasRequestMessage &&
    initialMessages[0]?.author_user_id === props.currentUserId;
  const isCurrentUserHasRequestTextMessage = !!initialMessages.find(
    item =>
      item.variant === CHAT_MESSAGE_VARIANT.message &&
      item.author_user_id === props.currentUserId,
  );
  const isChatHasResponse = !!(
    isRequestFromCurrentUser &&
    initialMessages.find(item => item.author_user_id === props.targetUserId)
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (
        chatSubscription.loading ||
        chatSubscription.error ||
        (isChatRequested && isCurrentUserHasRequestTextMessage)
      ) {
        return;
      }

      const messageId = String(uuid.v4());
      const message: ChatMessage = {
        id: messageId,
        variant: CHAT_MESSAGE_VARIANT.message,
        text,
        author_user_id: props.currentUserId,
        created_at: new Date(),
        status: ChatMessageFeedbackStatus.Loading,
      };

      setTmpMessages(prev => [...prev, message]);

      try {
        if (
          !isChatRoomExists ||
          (isChatRequested && isRequestFromCurrentUser)
        ) {
          // Клик по кнопке "написать" в карточке из ленты анкет. Лайк не ставили.
          // Чата не существует. Создаем комнату и добавляем в нее сообщение.

          await requestMessageMutation.mutateAsync({
            currentUser: props.currentUser!,
            targetUserId: props.targetUserId!,
            text,
            messageId,
          });
        }

        if (isChatRoomExists && isChatRequested && isRequestFromTargetUser) {
          // Отвечаем на входящее приглашение (лайк или сообщение)
          await responseMessageMutation.mutateAsync({
            targetUserId: props.targetUserId!,
            currentUser: props.currentUser!,
            roomId: chatRoom.chatRoomId!,
            text,
            messageId,
          });
        }

        if (isChatRoomExists && chatRoom.status === CHAT_ROOM_STATUS.open) {
          // Отправляем обычное текстовое сообщение
          await sendMessageMutation.mutateAsync({
            currentUser: props.currentUser!,
            targetUserId: props.targetUserId!,
            roomId: chatRoom.chatRoomId!,
            text,
            messageId,
          });
        }
      } catch (error) {
        setTmpMessages(prev =>
          prev.map(item =>
            item.id === messageId
              ? {...item, status: ChatMessageFeedbackStatus.Error}
              : item,
          ),
        );
      }
    },
    [chatRoom, chatSubscription, setTmpMessages, tmpMessages],
  );

  const resendErrorMessage = useCallback(
    (message: ChatMessage) => {
      setTmpMessages(prev => prev.filter(item => item.id !== message.id));
      sendMessage(message.text!);
    },
    [tmpMessages],
  );

  const removeErrorMessage = useCallback(
    (message: ChatMessage) => {
      setTmpMessages(prev => prev.filter(item => item.id !== message.id));
    },
    [tmpMessages],
  );

  return {
    likeMutation,
    requestMessageMutation,
    responseMessageMutation,
    sendMessageMutation,
    chatSubscription,
    chatRoom,
    chatMessages: completeChatMessages,
    isRequestFromCurrentUser,
    isRequestFromTargetUser,
    isCurrentUserHasRequestTextMessage,
    isChatHasResponse,
    isChatRoomExists,
    readLastMessageMutation,
    sendMessage,
    resendErrorMessage,
    removeErrorMessage,
  };
}

export default useChat;
