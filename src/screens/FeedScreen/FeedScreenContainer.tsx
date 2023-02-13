import {observer} from 'mobx-react-lite';
import React, {useCallback, useContext} from 'react';
import {RefreshControl} from 'react-native';
import {DatingCardListProps} from '~components/DatingCardList';
import useProfilesInfinite from '~src/logic/feed/use-profiles-infinite';
import useLeveragedProfilesInfinite from '~src/logic/feed/use-top-profiles-infinite';
import {USER_STATUS} from '~src/utils/consts';
import {useCardActions, useCardActionsProps} from '~src/utils/use-actions';
import useFeatures from '~src/utils/use-features';
import useStatusSub from '~src/utils/use-status-sub';
import {FilterContext, useAppState} from '~store/app-state';
import FeedScreenContent from './FeedScreenContent';

export interface FeedScreenContainerProps
  extends Pick<DatingCardListProps, 'onDetailsPress' | 'onLikePress'>,
    useCardActionsProps {
  onFilterPress: () => void;
  onAddTopProfilePress: (
    variant: 'top-promo' | 'tariff-promo' | 'redirect-to-purchases',
    isFreeAccess: boolean,
  ) => void;
}

const FeedScreenContainer = observer((props: FeedScreenContainerProps) => {
  const {onChatPress, onLikePress} = useCardActions({
    onUnauthorizedPress: props.onUnauthorizedPress,
    onChatPress: props.onChatPress,
  });
  useStatusSub();
  const {filters} = useContext(FilterContext);
  const {user, isFreeAccess} = useAppState();

  const {
    profiles,
    isFiltersApplied,
    isRefetching: isProfilesRefetching,
    isNewPageLoading: isMoreUsersLoading,
    isShowPlaceholder: isShowProfilesPlaceholder,
    isInitiallyLoading: isProfilesInitiallyLoading,
    isEndReached: isProfilesEndReached,
    onEndReached: onProfilesEndReached,
    onRefresh: onProfilesRefresh,
  } = useProfilesInfinite({
    filters,
    batchSize: 10,
    everyNthProfileIsLeveraged: 5,
  });
  const {
    profiles: leveragedProfiles,
    isRefetching: isLeveragedUsersRefetching,
    isNewPageLoading: isMoreLeveragedProfilesLoading,
    isEndReached: isLeveragedProfilesEndReached,
    onEndReached: onLeveragedProfilesEndReached,
    onRefresh: onLeveragedProfilesRefresh,
  } = useLeveragedProfilesInfinite({batchSize: 10});

  const {simpleTariffPromo} = useFeatures();

  const onRefresh = useCallback(
    async () =>
      Promise.all([onProfilesRefresh(), onLeveragedProfilesRefresh()]),
    [onProfilesRefresh, onLeveragedProfilesRefresh],
  );

  const onAddTopProfilePress = useCallback(() => {
    if (user?.status === USER_STATUS.payed && simpleTariffPromo) {
      props.onAddTopProfilePress('redirect-to-purchases', isFreeAccess);
    }
    if (user?.status !== USER_STATUS.payed && simpleTariffPromo) {
      props.onAddTopProfilePress('tariff-promo', isFreeAccess);
    }
    if (!simpleTariffPromo) {
      props.onAddTopProfilePress('top-promo', isFreeAccess);
    }
  }, [user, isFreeAccess]);

  const isRefetching = isProfilesRefetching || isLeveragedUsersRefetching;

  return (
    <FeedScreenContent
      isInitiallyLoading={isProfilesInitiallyLoading}
      DatingCardListProps={{
        dontShowPhotos: user?.dont_show_photos ?? false,
        profiles: profiles,
        onLikePress,
        onDetailsPress: props.onDetailsPress,
        onChatPress,
        isFiltersApplied,
        isShowPlaceholder: isShowProfilesPlaceholder,
        isMoreLoading: isMoreUsersLoading,
        isEndReached: isProfilesEndReached,
        gridOnEndReachedThreshold: 0.5,
        feedOnEndReachedThreshold: 1,
        refreshControl: (
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        ),
        onEndReached: onProfilesEndReached,
      }}
      isShowTopProfiles={!isFreeAccess}
      isShowPremiumButton={!isFreeAccess}
      FilterButtonProps={{
        onPress: props.onFilterPress,
      }}
      TopProfilesProps={{
        dontShowPhotos: user?.dont_show_photos ?? false,
        users: leveragedProfiles,
        onPress: props.onDetailsPress,
        isEndReached: isLeveragedProfilesEndReached,
        isMoreLoading: isMoreLeveragedProfilesLoading,
        onEndReached: onLeveragedProfilesEndReached,
        onEndReachedThreshold: 0.1,
        onAddPress: onAddTopProfilePress,
      }}
    />
  );
});

export default FeedScreenContainer;
