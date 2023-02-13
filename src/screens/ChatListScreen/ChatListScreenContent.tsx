import {Box} from 'native-base';
import React from 'react';
import {FlatList, ListRenderItem} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChatListMessage from '~components/ChatListMessage';
import stylesheet from '~src/styles';
import {ChatRoom} from '~src/types';
import ChatListScreenPlaceholder from './ChatListScreenPlaceholder';

export interface ChatListScreenContentProps {
  chatRooms: ChatRoom[];
  onChatPress: (lastMessage: ChatRoom) => void;
  dontShowPhotos: boolean;
}

const renderItem: (
  props: ChatListScreenContentProps,
) => ListRenderItem<ChatRoom> =
  props =>
  ({item}) =>
    (
      <ChatListMessage
        {...item}
        dontShowPhotos={props.dontShowPhotos}
        onPress={() => {
          props.onChatPress(item);
        }}
      />
    );

function ChatListCreenContent(props: ChatListScreenContentProps) {
  return (
    <SafeAreaView style={stylesheet.container}>
      <Box flex={1}>
        {(props.chatRooms?.length || 0) > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={props.chatRooms}
            keyExtractor={message => message.targetUserId!}
            renderItem={renderItem(props)}
          />
        ) : null}
        {(props.chatRooms?.length || 0) < 1 ? (
          <ChatListScreenPlaceholder />
        ) : null}
      </Box>
    </SafeAreaView>
  );
}

export default ChatListCreenContent;
