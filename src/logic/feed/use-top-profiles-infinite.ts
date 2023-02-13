import {useApolloClient, useMutation} from '@apollo/client';
import {useInfiniteQuery, UseInfiniteQueryResult} from '@tanstack/react-query';
import _uniqueId from 'lodash/uniqueId';
import moment from 'moment';
import {useCallback, useContext, useMemo, useState} from 'react';
import {FeedStoreContext, useAppState} from '~store/app-state';
import {INC_USER_LEVERAGE_VIEW_COUNT, LEVERAGED_PROFILES_GQL} from './gql';
import {getUsersWhereCond, mapViewedLeverageIds} from './shared';
import _flatten from 'lodash/flatten';

function mapGqlResponse(
  profilesQuery: UseInfiniteQueryResult<any>,
  claimedUserIds: Record<string, true>,
) {
  const user_leverages = _flatten(
    profilesQuery.data?.pages?.map?.(item => item?.data?.user_leverages),
  );
  const result: any[] = [];

  user_leverages?.forEach?.(item => {
    const profile = item?.user_leverage_users__links?.[0]?.user?.profiles?.[0];

    if (claimedUserIds[profile?.userId] || !profile) {
      return;
    }

    result.push(profile);
  });

  return result;
}

function useLeveragedProfilesInfinite(props: {batchSize: number}) {
  const {userId, user, queriesEnabled} = useAppState();
  const [randomQueryKey, setRandomQueryKey] = useState(_uniqueId());
  const [isInitiallyFetched, setIsInitiallyFetched] = useState(false);
  const {claimedUserIds, claimedUserIdsLength} = useContext(FeedStoreContext);
  const [isNewPageLoading, setIsNewPageLoading] = useState(false);

  const usersWhereCond = getUsersWhereCond({
    userId,
    gender: user?.gender,
  });

  const variables = {
    where: {
      expires_at: {_gte: moment.utc().toDate()},
      user_leverage_users__links: {
        user: usersWhereCond,
      },
    },
    limit: props.batchSize,
    offset: 0,
  };

  const ac = useApolloClient();
  const [incUserLeveragesViewsMutation] = useMutation(
    INC_USER_LEVERAGE_VIEW_COUNT,
  );
  const profilesQuery = useInfiniteQuery<any>({
    queryKey: ['leveraged-profiles', randomQueryKey],
    enabled: queriesEnabled,
    keepPreviousData: true,
    queryFn: ({pageParam = 0}) =>
      ac.query({
        query: LEVERAGED_PROFILES_GQL,
        variables: {
          ...variables,
          offset: pageParam,
        },
      }),
    onSettled: () => {
      setIsInitiallyFetched(true);
      setIsNewPageLoading(false);
    },
    onSuccess: data => {
      const viewedIds = mapViewedLeverageIds(data);
      incUserLeveragesViewsMutation({variables: {userLeveragesIds: viewedIds}});
    },

    getNextPageParam: (lastPage, allPages) => {
      const lastPageLength: number =
        lastPage?.data?.user_leverages?.length || 0;
      const hasNextPage = lastPageLength >= props.batchSize;
      const offset = (allPages?.length || 0) * props.batchSize;
      return hasNextPage ? offset : undefined;
    },
  });

  const profiles = useMemo(
    () => mapGqlResponse(profilesQuery, claimedUserIds),
    [
      profilesQuery.data?.pages.length,
      claimedUserIdsLength,
      profilesQuery.isPreviousData,
    ],
  );

  const isShowPlaceholder =
    profilesQuery.status !== 'loading' && (profiles?.length || 0) < 1;

  const isEndReached =
    !profilesQuery.hasNextPage && (profiles?.length || 0) > 0;

  const isRefetching = profilesQuery.isLoading;

  const onRefresh = useCallback(() => {
    setRandomQueryKey(_uniqueId());
  }, []);

  const onEndReached = useCallback(() => {
    if (profilesQuery.isLoading || isEndReached) return;
    setIsNewPageLoading(true);
    profilesQuery.fetchNextPage({});
  }, [profilesQuery, isEndReached]);

  return {
    variables,
    profiles,
    profilesQuery,
    isRefetching,
    isNewPageLoading,
    isShowPlaceholder,
    isInitiallyFetched,
    isEndReached,
    onRefresh,
    onEndReached,
  };
}

export default useLeveragedProfilesInfinite;
