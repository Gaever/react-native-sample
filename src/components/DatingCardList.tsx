import {TFunction} from 'i18next';
import {Box, HStack, Spinner} from 'native-base';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, FlatListProps} from 'react-native';
import BigList, {BigListRenderItem} from 'react-native-big-list';
import DatingCard from '~components/DatingCard';
import FeedScreenPlaceholder from '~src/screens/FeedScreen/FeedScreenPlaceholder';
import {feedFiewType, User} from '~src/types';
import useFeatures from '~src/utils/use-features';
import DatingCardSmall from './DatingCardSmall';

export interface DatingCardListProps
  extends Pick<
    FlatListProps<User[]>,
    | 'refreshControl'
    | 'onEndReached'
    | 'ListHeaderComponent'
    | 'ListFooterComponent'
  > {
  feedOnEndReachedThreshold: number;
  gridOnEndReachedThreshold: number;
  profiles: User[];
  onDetailsPress: (user: User, index?: number) => void;
  onLikePress?: (user: User, index?: number) => void;
  onRejectPress?: (user: User, index?: number) => void;
  onChatPress?: (user: User, index?: number) => void;
  variant: feedFiewType;
  isShowPlaceholder: boolean;
  isFiltersApplied: boolean;
  isMoreLoading: boolean;
  isEndReached: boolean;
  dontShowPhotos: boolean;
  isShowTopProfiles: boolean;
}

function usersGrid(u: any) {
  const arr: any[] = [];

  u.forEach((item: any, index: number) => {
    if (index % 2 === 0) {
      arr.push([]);
    }
    arr[arr.length - 1].push(item);
  });

  return arr;
}

const ITEM_HEIGHT = Dimensions.get('window').width * 0.7;

const renderGridItem: (
  props: DatingCardListProps,
) => BigListRenderItem<[User, User]> =
  props =>
  ({item, index}) => {
    const item1 = item[0];
    const item2 = item[1];

    return (
      <HStack
        px={2}
        space={2}
        key={`feed-grid-${item1?.profileId}-${item2?.profileId}`}>
        <DatingCardSmall
          dontShowPhotos={props.dontShowPhotos}
          user={item1}
          isLeveraged={item1?.isLeveraged}
          onDetailsPress={() => {
            props.onDetailsPress(item1, index);
          }}
        />
        {item2 ? (
          <DatingCardSmall
            dontShowPhotos={props.dontShowPhotos}
            user={item2}
            isLeveraged={item2?.isLeveraged}
            onDetailsPress={() => {
              props.onDetailsPress(item2, index + 1);
            }}
          />
        ) : (
          <Box flex={1} />
        )}
      </HStack>
    );
  };

const renderFeedItem: (props: DatingCardListProps) => BigListRenderItem<User> =
  props =>
  ({item, index}) =>
    (
      <Box pb={'20px'} px={2} key={`feed-${item.profileId}`} flex={1}>
        <DatingCard
          showTags
          user={item}
          dontShowPhotos={props.dontShowPhotos}
          isLeveraged={item?.isLeveraged}
          {...(props.onLikePress
            ? {
                onLikePress: () => {
                  props.onLikePress?.(item, index);
                },
              }
            : null)}
          {...(props.onRejectPress
            ? {
                onRejectPress: () => {
                  props.onRejectPress?.(item, index);
                },
              }
            : null)}
          {...(props.onChatPress
            ? {
                onChatPress: () => {
                  props.onChatPress?.(item, index);
                },
              }
            : null)}
          onDetailsPress={() => {
            props.onDetailsPress?.(item, index);
          }}
        />
      </Box>
    );

const renderListFooterConponent = (
  props: DatingCardListProps,
  t: TFunction,
) => {
  if (props.isMoreLoading) {
    // Подгружаются профили
    return (
      <Box py={2}>
        <Spinner size="lg" color="gray.400" />
      </Box>
    );
  }

  if (props.isEndReached) {
    // Достигли дна
    return (
      <Box
        flex={1}
        textAlign="center"
        alignItems="center"
        justifyContent="flex-start">
        {t('feed-screen.on-end-reached')}
      </Box>
    );
  }

  return null;
};

function DatingCardList(props: DatingCardListProps) {
  const {t} = useTranslation();
  // const topProfilesHeight = props.isShowTopProfiles ? 165 : 0;
  const topProfilesHeight = 165;

  const ListHeaderComponent = props.ListHeaderComponent ? (
    props.ListHeaderComponent
  ) : (
    <Box pt={4} />
  );

  const userGridData = useMemo(() => {
    if (props.variant !== 'grid') return [];
    return usersGrid(props.profiles);
  }, [props.profiles, props.variant]);

  if (props.isShowPlaceholder) {
    return (
      <BigList
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <FeedScreenPlaceholder isFilterApplied={props.isFiltersApplied} />
        )}
        data={[1]}
        itemHeight={ITEM_HEIGHT}
        headerHeight={topProfilesHeight}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={props.refreshControl}
        onEndReached={props.onEndReached}
      />
    );
  }

  if (props.variant === 'grid') {
    return (
      <BigList
        renderItem={renderGridItem(props)}
        data={userGridData}
        itemHeight={ITEM_HEIGHT}
        headerHeight={topProfilesHeight}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={props.refreshControl}
        onEndReached={props.onEndReached}
        onEndReachedThreshold={props.gridOnEndReachedThreshold}
        hideFooterOnEmpty
        ListFooterComponent={renderListFooterConponent(props, t)}
        footerHeight={60}
      />
    );
  }

  return (
    <BigList
      batchSizeThreshold={10}
      renderItem={renderFeedItem(props)}
      data={props.profiles}
      itemHeight={410}
      headerHeight={topProfilesHeight}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={props.refreshControl}
      onEndReached={props.onEndReached}
      onEndReachedThreshold={props.feedOnEndReachedThreshold}
      hideFooterOnEmpty
      ListFooterComponent={renderListFooterConponent(props, t)}
      footerHeight={60}
    />
  );
}

export default DatingCardList;
