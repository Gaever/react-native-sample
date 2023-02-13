import {
  Actionsheet,
  Box,
  Button,
  FlatList,
  HStack,
  KeyboardAvoidingView,
  Text,
} from 'native-base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItem, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '~components/chat/Header';
import MatchRequestPlaceholder from '~components/chat/MatchRequestPlaceholder';
import Message, {MessageProps} from '~components/chat/Message';
import SendInput, {SendInputProps} from '~components/chat/SendInput';
import PremiumButton from '~components/PremiumButton';
import stylesheet from '~src/styles';
import {ChatMessage} from '~src/types';
import {CHAT_MESSAGE_VARIANT, CHAT_ROOM_STATUS} from '~src/utils/consts';

export interface ChatScreenContentProps {
  isPayedAccess: boolean;
  status: CHAT_ROOM_STATUS | undefined;
  messages: ChatMessage[];
  avatar: string | undefined;
  name: string | undefined;
  chatRoomId: string | undefined;
  currentUserId: string;
  targetUserId: string;
  isSubmitting: boolean;
  isChatRoomExists: boolean;
  isRequestFromCurrentUser: boolean;
  isRequestFromTargetUser: boolean;
  isCurrentUserHasRequestTextMessage: boolean;
  isChatHasResponse: boolean;
  dontShowPhotos: boolean;
  onBackPress: () => void;
  onAvatarPress: () => void;
  onClaimPress: () => void;
  onMessageSubmit: SendInputProps['onSubmit'];
  onResendMessagePress: (message: ChatMessage) => void;
  onDeleteFailedMessagePress: (message: ChatMessage) => void;
}

interface RenderMessageProps extends ChatScreenContentProps {
  onErrorPress: (message: ChatMessage) => void;
}

const renderItem: (props: RenderMessageProps) => ListRenderItem<ChatMessage> =
  parentProps => props => {
    const likeDirection =
      (props.item.variant === CHAT_MESSAGE_VARIANT.like &&
        props.item.author_user_id === parentProps.currentUserId &&
        'out') ||
      (props.item.variant === CHAT_MESSAGE_VARIANT.like &&
        props.item.author_user_id === parentProps.targetUserId &&
        'in') ||
      undefined;

    return (
      <Message
        {...props.item}
        onErrorPress={() => {
          parentProps.onErrorPress(props.item);
        }}
        key={props.item.id}
        likeDirection={likeDirection}
        self={props.item.author_user_id === parentProps.currentUserId}
      />
    );
  };

function ChatScreenContent(props: ChatScreenContentProps) {
  const {t} = useTranslation();
  const [isErrorActionSheetOpen, setIsErrorActionSheetOpen] = useState(false);
  const [failedMessage, setFailedMessage] = useState<ChatMessage | null>(null);

  const sendInputEnabled =
    props.status === CHAT_ROOM_STATUS.open ||
    !props.isChatRoomExists ||
    (props.isChatRoomExists && !props.isCurrentUserHasRequestTextMessage);

  return (
    <SafeAreaView style={[stylesheet.container]}>
      <KeyboardAvoidingView
        flex={1}
        {...Platform.select({
          ios: {
            keyboardVerticalOffset: 0,
            behavior: 'padding',
          },
        })}>
        <Header
          avatar={props.avatar || ''}
          name={props.name || ''}
          onBackPress={props.onBackPress}
          onClaimPress={props.onClaimPress}
          onAvatarPress={props.onAvatarPress}
          dontShowPhotos={props.dontShowPhotos}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          inverted={!!props.messages?.length}
          data={props.messages}
          keyExtractor={message => message.id}
          ListFooterComponent={<Box pt={6} />}
          ListHeaderComponent={<Box pt={2} />}
          ListEmptyComponent={<Box />}
          renderItem={renderItem({
            ...props,
            onErrorPress: message => {
              setIsErrorActionSheetOpen(true);
              setFailedMessage(message);
            },
          })}
        />

        {sendInputEnabled && props.isPayedAccess ? (
          <SendInput
            onSubmit={props.onMessageSubmit}
            isDisabled={
              props.status === CHAT_ROOM_STATUS.request && props.isSubmitting
            }
          />
        ) : null}

        {!props.isPayedAccess ? (
          <MatchRequestPlaceholder>
            <HStack alignItems="center" mt={3}>
              <PremiumButton />
              <Box mt="2px" ml={2}>
                {t('chat.pay-to-chat')}
              </Box>
            </HStack>
          </MatchRequestPlaceholder>
        ) : null}

        {!sendInputEnabled &&
        props.isPayedAccess &&
        props.status === CHAT_ROOM_STATUS.request ? (
          <MatchRequestPlaceholder>
            {t('chat.await-response')}
          </MatchRequestPlaceholder>
        ) : null}

        {!sendInputEnabled &&
        props.isPayedAccess &&
        props.status === CHAT_ROOM_STATUS.closed ? (
          <MatchRequestPlaceholder>
            {t('chat.chat-closed')}
          </MatchRequestPlaceholder>
        ) : null}

        <Actionsheet
          isOpen={isErrorActionSheetOpen}
          onClose={() => {
            setFailedMessage(null);
            setIsErrorActionSheetOpen(false);
          }}>
          <Actionsheet.Content>
            <Actionsheet.Item
              onPress={() => {
                if (failedMessage) {
                  props.onResendMessagePress(failedMessage);
                  setFailedMessage(null);
                }
                setIsErrorActionSheetOpen(false);
              }}>
              {t('chat.resend-failed')}
            </Actionsheet.Item>
            <Actionsheet.Item
              _text={{color: 'red.400'}}
              onPress={() => {
                if (failedMessage) {
                  props.onDeleteFailedMessagePress(failedMessage);
                  setFailedMessage(null);
                }
                setIsErrorActionSheetOpen(false);
              }}>
              {t('chat.cancel-failed')}
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ChatScreenContent;
