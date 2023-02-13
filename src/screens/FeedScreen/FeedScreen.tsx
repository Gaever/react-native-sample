import React, {useCallback} from 'react';
import {Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import * as DetailsScreen from '~src/screens/DetailsScreen/DetailsScreen';
import {User} from '~src/types';
import {useCardActionsNavigation} from '~src/utils/use-actions';
import * as TopProfilePromoScreen from '~src/screens/TopProfilePromoScreen/TopProfilePromoScreen';
import FeedScreenContainer, {
  FeedScreenContainerProps,
} from './FeedScreenContainer';
import * as FilterModal from './FilterModal';
import {PROFILE_TAB} from '~src/app';
import * as PremiumScreen from '~src/screens/PremiumScreen/PremiumScreen';
import * as TariffScreen from '~src/screens/TariffPromoScreen/TariffPromoScreen';
import * as TopProfilePlaceholderScreen from '../TopProfilePlaceholderScreen/TopProfilePlaceholderScreen';

export interface FeedScreenProps {}

const FeedScreen: ScreenFC<FeedScreenProps> = props => {
  const {navigateToChatRoom, onUnauthorizedPress} = useCardActionsNavigation({
    componentId: props.componentId,
  });

  const navigateToUser = useCallback(async (user: User) => {
    Navigation.push(
      props.componentId,
      await DetailsScreen.layoutOptions({targetUser: user}),
    );
  }, []);

  const onFilterPress = useCallback(async () => {
    Navigation.showModal({
      stack: {
        children: [await FilterModal.layoutOptions()],
      },
    });
  }, []);

  const onAddTopProfilePress: FeedScreenContainerProps['onAddTopProfilePress'] =
    useCallback(async (variant, isFreeAccess) => {
      if (isFreeAccess) {
        Navigation.showModal({
          stack: {
            children: [await TopProfilePlaceholderScreen.layoutOptions()],
          },
        });

        return;
      }

      if (variant === 'redirect-to-purchases') {
        await Navigation.popToRoot(PROFILE_TAB);
        await Navigation.push(
          PROFILE_TAB,
          await PremiumScreen.layoutOptions({}),
        );
        Navigation.mergeOptions(props.componentId, {
          bottomTabs: {
            currentTabId: PROFILE_TAB,
          },
        });
      }

      if (variant === 'top-promo') {
        Navigation.showModal({
          stack: {
            children: [await TopProfilePromoScreen.layoutOptions()],
          },
        });
      }

      if (variant === 'tariff-promo') {
        Navigation.showModal({
          stack: {
            children: [await TariffScreen.layoutOptions()],
          },
        });
      }
    }, []);

  return (
    <FeedScreenContainer
      onDetailsPress={navigateToUser}
      onChatPress={navigateToChatRoom}
      onUnauthorizedPress={onUnauthorizedPress}
      onFilterPress={onFilterPress}
      onAddTopProfilePress={onAddTopProfilePress}
    />
  );
};
FeedScreen.screenName = 'FeedScreen';
FeedScreen.options = {
  topBar: {
    visible: false,
  },
};

export default FeedScreen;
