import {useApolloClient, useMutation} from '@apollo/client';
import {useInfiniteQuery, UseInfiniteQueryResult} from '@tanstack/react-query';
import _uniqueId from 'lodash/uniqueId';
import moment from 'moment';
import {useCallback, useContext, useMemo, useState} from 'react';
import getImagePlaceholder from '~src/utils/get-image-placeholder';
import localTime from '~src/utils/local-time';
import {FeedStoreContext, useAppState} from '~store/app-state';
import {INC_USER_LEVERAGE_VIEW_COUNT, PROFILES_GQL} from './gql';
import {getUsersWhereCond, mapViewedLeverageIds} from './shared';

function mapFilters(filters: any, today: Date): [Record<string, any>, boolean] {
  const result: Map<string, any> = new Map();
  result.set('_and', []);
  result.set('_or', []);

  if (filters?.ageMin && filters?.ageMax) {
    const youngestBirthday = moment(today)
      .subtract(filters.ageMin, 'years')
      .add(1, 'day')
      .toDate();
    const eldestBirthday = moment(today)
      .subtract(filters.ageMax, 'years')
      .subtract(1, 'day')
      .toDate();

    result.get('_and').push({age: {_gte: eldestBirthday}});
    result.get('_and').push({age: {_lte: youngestBirthday}});
  }

  if (filters?.isOnlyWithPhoto) {
    result.set('photos', {_is_null: false});
  }
  if (filters?.country) {
    result.set('country', {_eq: filters.country});
  }
  if (filters?.friends) {
    result.set('friends', {_eq: true});
  }
  if (filters?.earn) {
    result.set('earn', {_eq: filters.earn});
  }
  if (filters?.nation) {
    result.set('nation', {_eq: filters.nation});
  }
  if (filters?.city) {
    result.set('city', {_eq: filters.city});
  }
  if (filters?.can_move) {
    result.set('can_move', {_eq: filters.can_move});
  }
  if (filters?.disability === 'yes') {
    result.set('disability', {_is_null: false});
  }
  if (filters?.disability === 'no') {
    result.set('disability', {_is_null: true});
  }
  if (filters?.is_agent === 'yes') {
    result.set('is_agent', {_eq: true});
  }
  if (filters?.is_agent === 'no') {
    result.get('_or').push({is_agent: {_eq: false}});
    result.get('_or').push({is_agent: {_is_null: true}});
  }
  if (filters?.education) {
    result.set('education', {_eq: filters.education});
  }
  if (filters?.marrige) {
    result.set('marrige', {_eq: filters.marrige});
  }
  if (filters?.children === 'yes') {
    result.get('_or').push({children: {_eq: '0'}});
    result.get('_or').push({children: {_is_null: true}});
  }
  if (filters?.children === 'no') {
    result.set('children', {
      _in: ['1', '2', '3', '4', '5', '>5'],
    });
  }
  if (filters?.religion) {
    result.set('religion', {_eq: filters.religion});
  }
  if (filters?.polygamy) {
    result.set('polygamy', {_eq: filters.polygamy});
  }
  if (filters?.hidgab) {
    result.set('hidgab', {_eq: filters.hidgab});
  }
  if (filters?.wives) {
    result.set('wives', {_eq: filters.wives});
  }

  if (result.get('_and').length < 1) result.delete('_and');
  if (result.get('_or').length < 1) result.delete('_or');

  return [Object.fromEntries(result), result.size > 0];
}

function mapImagePlaceholder(
  user: any,
  dontShowPhotos: boolean,
  userIdToAvatarPlaceholder: Record<string, number>,
  setUserIdToAvatarPlaceholder: (userId: string, avatarNumber: number) => void,
) {
  const isNoPhotos =
    !user?.photos?.find((item: any) => item?.uri) || dontShowPhotos;
  if (isNoPhotos) {
    const existAvatarNumber = userIdToAvatarPlaceholder[user?.userId];
    const [ph, avatarNumber] = getImagePlaceholder(
      user?.gender!,
      existAvatarNumber,
    );
    if (existAvatarNumber === undefined) {
      setUserIdToAvatarPlaceholder(user?.userId, avatarNumber);
    }

    return {
      ...user,
      imagePlaceholder: ph,
    };
  }

  return user;
}

function mapGqlResponse(
  profilesQuery: UseInfiniteQueryResult<any>,
  claimedUserIds: Record<string, true>,
  everyNthProfileIsLeveraged: number,
  dontShowPhotos: boolean,
  userIdToAvatarPlaceholder: Record<string, number>,
  setUserIdToAvatarPlaceholder: (userId: string, avatarNumber: number) => void,
) {
  const users: any[] = [];
  const user_leverages: any[] = [];
  const result: any[] = [];

  let userLeveragesIndex = 0;
  let usersIndex = 0;

  profilesQuery.data?.pages?.forEach?.(item => {
    if (Array.isArray(item?.data?.users)) {
      users.push(...item.data.users);
    }
    if (Array.isArray(item?.data?.user_leverages)) {
      user_leverages.push(...item.data.user_leverages);
    }
  });

  for (let i = 0; i < users.length + user_leverages.length; i++) {
    const profile = users?.[usersIndex]?.profiles?.[0]
      ? {
          ...users?.[usersIndex]?.profiles?.[0],
          last_seen: users?.[usersIndex]?.last_seen,
        }
      : undefined;

    const leveragedProfile =
      user_leverages?.[userLeveragesIndex]?.user_leverage_users__links?.[0]
        ?.user?.profiles?.[0];

    if ((i + 1) % everyNthProfileIsLeveraged === 0) {
      if (leveragedProfile && !claimedUserIds[leveragedProfile?.userId]) {
        result.push(
          mapImagePlaceholder(
            {...leveragedProfile, isLeveraged: true},
            dontShowPhotos,
            userIdToAvatarPlaceholder,
            setUserIdToAvatarPlaceholder,
          ),
        );
      }

      userLeveragesIndex++;
    }

    if (profile && !claimedUserIds[profile?.userId]) {
      result.push(
        mapImagePlaceholder(
          profile,
          dontShowPhotos,
          userIdToAvatarPlaceholder,
          setUserIdToAvatarPlaceholder,
        ),
      );
    }

    usersIndex++;
  }

  return result;
}

function useProfilesInfinite(props: {
  filters: Record<string, any> | null;
  batchSize: number;
  everyNthProfileIsLeveraged: number;
}) {
  const {userId, user, queriesEnabled} = useAppState();
  const {
    claimedUserIds,
    claimedUserIdsLength,
    userIdToAvatarPlaceholder,
    setUserIdToAvatarPlaceholder,
  } = useContext(FeedStoreContext);

  const [today] = useState(
    localTime().set({hour: 0, minute: 0, second: 0}).toDate(),
  );
  const [mappedFilters, isFiltersApplied] = mapFilters(props.filters, today);

  const [randomQueryKey, setRandomQueryKey] = useState(_uniqueId());
  const [isInitiallyFetched, setIsInitiallyFetched] = useState(false);
  const [isNewPageLoading, setIsNewPageLoading] = useState(false);

  const leveragesLimit = props.batchSize / props.everyNthProfileIsLeveraged;
  const usersLimit = props.batchSize - leveragesLimit;

  const usersWhereCond = getUsersWhereCond({
    userId,
    gender: user?.gender,
    filters: mappedFilters,
  });

  const now = moment.utc().toDate();

  const variables = {
    usersWhere: {
      ...usersWhereCond,
      user_leverage_users__links_aggregate: {
        count: {
          predicate: {
            _lte: 0,
          },
          filter: {
            user_leverage: {
              expires_at: {_gte: now},
            },
          },
        },
      },
    },
    leveragesWhere: {
      expires_at: {_gte: now},
      user_leverage_users__links: {
        user: usersWhereCond,
      },
    },
    usersLimit,
    usersOffset: 0,
    leveragesLimit,
    leveragesOffset: 0,
  };

  const ac = useApolloClient();
  const [incUserLeveragesViewsMutation] = useMutation(
    INC_USER_LEVERAGE_VIEW_COUNT,
  );
  const profilesQuery = useInfiniteQuery<any>({
    keepPreviousData: true,
    queryKey: ['feed', mappedFilters, randomQueryKey],
    enabled: queriesEnabled,
    queryFn: ({pageParam = 0}) =>
      ac.query({
        query: PROFILES_GQL,
        variables: {
          ...variables,
          usersOffset: pageParam,
          leveragesOffset: pageParam,
        },
      }),
    onSettled: () => {
      setIsInitiallyFetched(true);
      setIsNewPageLoading(false);
    },
    onSuccess: (data: any) => {
      const viewedIds = mapViewedLeverageIds(data);
      incUserLeveragesViewsMutation({variables: {userLeveragesIds: viewedIds}});
    },
    getNextPageParam: (lastPage, allPages) => {
      const lastPageUsersLength: number = lastPage?.data?.users?.length || 0;
      const hasNextPage = lastPageUsersLength >= usersLimit;
      const offset = (allPages?.length || 0) * usersLimit;
      return hasNextPage ? offset : undefined;
    },
  });

  const profiles = useMemo(
    () =>
      mapGqlResponse(
        profilesQuery,
        claimedUserIds,
        props.everyNthProfileIsLeveraged,
        !!user?.dont_show_photos,
        userIdToAvatarPlaceholder,
        setUserIdToAvatarPlaceholder,
      ),
    [
      profilesQuery.data?.pages.length,
      profilesQuery.isPreviousData,
      claimedUserIdsLength,
    ],
  );

  const isShowPlaceholder =
    profilesQuery.status !== 'loading' && (profiles?.length || 0) < 1;

  const isEndReached =
    !profilesQuery.hasNextPage && (profiles?.length || 0) > 0;

  const isInitiallyLoading = !isInitiallyFetched && profilesQuery.isLoading;
  const isRefetching = profilesQuery.isLoading;

  const onRefresh = useCallback(() => {
    setRandomQueryKey(_uniqueId());
  }, []);

  const onEndReached = useCallback(() => {
    if (profilesQuery.isLoading || isEndReached) return;
    setIsNewPageLoading(true);
    profilesQuery.fetchNextPage();
  }, [profilesQuery, isEndReached]);

  return {
    variables,
    profiles,
    profilesQuery,
    isRefetching,
    isFiltersApplied,
    isNewPageLoading,
    isShowPlaceholder,
    isInitiallyFetched,
    isInitiallyLoading,
    isEndReached,
    onRefresh,
    onEndReached,
  };
}

export default useProfilesInfinite;
