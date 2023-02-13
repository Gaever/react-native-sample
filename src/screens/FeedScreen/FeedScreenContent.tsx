import {Box, Center, Spinner} from 'native-base';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import DatingCardList, {DatingCardListProps} from '~components/DatingCardList';
import {FilterButtonProps} from '~components/FilterButton';
import TopProfiles, {TopProfilesProps} from '~components/TopProfiles';
import stylesheet from '~src/styles';
import {feedFiewType} from '~src/types';
import FeedScreenHeader from './FeedScreenHeader';

export interface FeedScreenContentProps {
  TopProfilesProps: TopProfilesProps;
  DatingCardListProps: Pick<
    DatingCardListProps,
    | 'profiles'
    | 'onLikePress'
    | 'onDetailsPress'
    | 'onRejectPress'
    | 'onChatPress'
    | 'refreshControl'
    | 'ListHeaderComponent'
    | 'refreshControl'
    | 'onEndReached'
    | 'feedOnEndReachedThreshold'
    | 'gridOnEndReachedThreshold'
    | 'isEndReached'
    | 'isMoreLoading'
    | 'isFiltersApplied'
    | 'isShowPlaceholder'
    | 'dontShowPhotos'
  >;
  FilterButtonProps: FilterButtonProps;
  isInitiallyLoading: boolean;
  isShowTopProfiles: boolean;
  isShowPremiumButton: boolean;
}

function FeedScreenContent(props: FeedScreenContentProps) {
  const [viewVariant, setViewVariant] = useState<feedFiewType>('grid');

  return (
    <SafeAreaView style={stylesheet.container}>
      <FeedScreenHeader
        isShowPremiumButton={props.isShowPremiumButton}
        FilterButtonProps={props.FilterButtonProps}
        ToggleViewButtonProps={{
          viewVariant,
          onPress: () => {
            if (viewVariant === 'feed') {
              setViewVariant('grid');
            } else {
              setViewVariant('feed');
            }
          },
        }}
      />

      {props.isInitiallyLoading ? (
        <Box w="100%" h="100%" borderRadius="lg">
          <Center flex={1}>
            <Spinner size="lg" color="gray.400" />
          </Center>
        </Box>
      ) : null}

      {!props.isInitiallyLoading ? (
        <DatingCardList
          variant={viewVariant}
          isShowTopProfiles={props.isShowTopProfiles}
          ListHeaderComponent={
            <Box pb={4} pt={3}>
              <TopProfiles {...props.TopProfilesProps} />
            </Box>
          }
          {...props.DatingCardListProps}
        />
      ) : null}
    </SafeAreaView>
  );
}

export default FeedScreenContent;
