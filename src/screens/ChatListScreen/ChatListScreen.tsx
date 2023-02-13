import React from 'react';
import {Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import * as ChatScreen from '~src/screens/ChatScreen/ChatScreen';
import ChatListScreenContainer from './ChatListScreenContainer';

export interface ChatListScreenProps {}

const ChatListScreen: ScreenFC<ChatListScreenProps> = props => {
  return (
    <ChatListScreenContainer
      onChatPress={async ({targetUserId, id, profile}) => {
        if (targetUserId) {
          Navigation.push(
            props.componentId,
            await ChatScreen.layoutOptions({targetUserId, profile, chatId: id}),
          );
        }
      }}
    />
  );
};
ChatListScreen.screenName = 'ChatListScreen';
ChatListScreen.options = {
  topBar: {
    visible: false,
  },
};

export default ChatListScreen;
