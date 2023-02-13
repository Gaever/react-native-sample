import React, {useCallback} from 'react';
import {LayoutStackChildren, Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import {CHAT_TAB} from '~src/app';
import * as DetailsScreen from '~src/screens/DetailsScreen/DetailsScreen';
import {User} from '~src/types';
import {useClaimActionNavigation} from '~src/utils/use-actions';
import ChatScreenContainer from './ChatScreenContainer';

export interface ChatScreenProps {
  targetUserId: string;
  chatId?: string;
  profile?: any;
}

const ChatScreen: ScreenFC<ChatScreenProps> = props => {
  const {onClaimPress} = useClaimActionNavigation({
    componentId: props.componentId,
    targetUserId: props.targetUserId,
  });

  const navigateToUser = useCallback(async (user: User) => {
    Navigation.push(
      props.componentId,
      await DetailsScreen.layoutOptions({targetUser: user}),
    );
  }, []);

  const navigateToChatList = useCallback(() => {
    Navigation.popToRoot(CHAT_TAB);
  }, []);

  return (
    <ChatScreenContainer
      targetUserId={props.targetUserId}
      onAvatarPress={navigateToUser}
      onBackPress={navigateToChatList}
      onClaimPress={onClaimPress}
      componentId={props.componentId}
      chatId={props.chatId}
      profile={props.profile}
    />
  );
};
ChatScreen.screenName = 'ChatScreen';

export const layoutOptions: (
  props: ChatScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,

    name: ChatScreen.screenName,
    options: {
      topBar: {
        visible: false,
      },
    },
  },
});

export default ChatScreen;
