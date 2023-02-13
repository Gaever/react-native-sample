import {useCallback, useContext} from 'react';
import {Navigation} from 'react-native-navigation';
import {CHAT_TAB} from '~src/app';
import * as ChatScreen from '~src/screens/ChatScreen/ChatScreen';
import * as ClaimScreen from '~src/screens/ClaimScreen/ClaimScreen';
import * as WelcomeScreen from '~src/screens/SignInModal/WelcomeScreen';
import * as TariffScreen from '~src/screens/TariffPromoScreen/TariffPromoScreen';
import {User} from '~src/types';
import {FeedStoreContext, useAppState} from '~store/app-state';
import useChat from './use-chat';

export interface useCardActionsNavigationProps {
  componentId: string;
}

export function useCardActionsNavigation(props: useCardActionsNavigationProps) {
  const navigateToChatRoom = useCallback(async (targetUser: User) => {
    await Navigation.push(
      CHAT_TAB,
      await ChatScreen.layoutOptions({targetUserId: targetUser.userId!}),
    );
    Navigation.mergeOptions(props.componentId, {
      bottomTabs: {
        currentTabId: CHAT_TAB,
      },
    });
  }, []);

  const onUnauthorizedPress = useCallback(
    async (userId: string | null, isPayedAccess: boolean) => {
      if (!userId) {
        Navigation.showModal({
          stack: {
            children: [await WelcomeScreen.layoutOptions()],
          },
        });
      } else if (!isPayedAccess) {
        Navigation.showModal({
          stack: {
            children: [await TariffScreen.layoutOptions()],
          },
        });
      }
    },
    [],
  );

  return {
    navigateToChatRoom,
    onUnauthorizedPress,
  };
}

export interface useCardActionsProps {
  onUnauthorizedPress: (userId: string | null, isPayedAccess: boolean) => void;
  onChatPress?: (user: User, index?: number) => void;
}

export function useCardActions(props: useCardActionsProps) {
  const {userId, user, isPayedAccess} = useAppState();
  const {likeMutation} = useChat({currentUser: user, currentUserId: userId!});

  const handleUnauthorized = useCallback(() => {
    if (!isPayedAccess) {
      props.onUnauthorizedPress(userId, isPayedAccess);
      return false;
    }

    return true;
  }, [userId, isPayedAccess]);

  const onLikePress = useCallback(
    (user: User) => {
      // if (!handleUnauthorized()) {
      //   return false;
      // }
      likeMutation.mutate({targetUserId: user.userId!, currentUser: user});
      return true;
    },
    [userId, user, isPayedAccess],
  );

  const onChatPress = useCallback(
    (user: User) => {
      // if (!handleUnauthorized()) {
      //   return;
      // }
      props.onChatPress?.(user);
    },
    [userId, isPayedAccess],
  );

  return {
    onLikePress,
    onChatPress,
  };
}

export interface useClaimActionNavigationProps {
  targetUserId: string;
  componentId: string;
}

export function useClaimActionNavigation(props: useClaimActionNavigationProps) {
  const onClaimSubmit = useCallback(
    async (claimModalComponentId: string) => {
      await Navigation.dismissModal(claimModalComponentId);
      Navigation.pop(props.componentId);
    },
    [props.componentId],
  );

  const onClaimPress = useCallback(async () => {
    Navigation.showModal({
      stack: {
        children: [
          await ClaimScreen.layoutOptions({
            targetUserId: props.targetUserId,
            onSubmit: onClaimSubmit,
          }),
        ],
      },
    });
  }, [props.targetUserId]);

  return {
    onClaimPress,
  };
}
