import {Center, Icon, Text} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ChatListScreenPlaceholderProps {}

function ChatListScreenPlaceholder(props: ChatListScreenPlaceholderProps) {
  const {t} = useTranslation();

  return (
    <Center flex={1}>
      <Text fontWeight={700} fontSize="lg" maxW="75%" textAlign="center">
        {t('chat.no-chats')}
      </Text>
      <Icon
        as={MaterialCommunityIcons}
        name={'heart'}
        size={70}
        color="secondary.400"
      />
    </Center>
  );
}

export default ChatListScreenPlaceholder;
