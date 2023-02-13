import {ApolloClient, gql, useApolloClient} from '@apollo/client';
import jwtDecode, {JwtPayload} from 'jwt-decode';
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  reaction,
} from 'mobx';
import React, {useCallback} from 'react';
import * as Keychain from 'react-native-keychain';
import {onLogout} from '~src/api';
import {User, WareDictItem} from '~src/types';
import {USER_STATUS} from '~src/utils/consts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import initNotifications from '~src/push-messaging';

export class Store {
  isNotFirstOpen: boolean = false;
  isShallUpdateApp: boolean = false;

  isAppLoading: boolean = true;
  isAppCrashedOnLoad: boolean = false;
  isFreeAccess: boolean = false;

  isPayedAccess = false;
  authJwt = '';
  user: User | null = null;
  isAuthorizedView: boolean = false;
  cur: string = 'RUB';
  openedChatTargetUserId: string = '';

  chatRoomsQuery: any = null;

  constructor() {
    makeAutoObservable(this, {
      openedChatTargetUserId: observable,
      setOpenedChatTargetUserId: action.bound,
      chatRoomsQuery: observable,
      setChatRoomsQuery: action.bound,
      isShallUpdateApp: observable,
      setIsShallUpdateApp: action.bound,
      isFreeAccess: observable,
      setIsFreeAccess: action.bound,
      isNotFirstOpen: observable,
      setIsNotFirstOpen: action.bound,
      user: observable,
      setUser: action.bound,
      isAuthorized: computed,
      userId: computed,
      isPayedAccess: observable,
      authJwt: observable,
      setAuthJwt: action.bound,
      setIsPayedAccess: action.bound,
      isProfileFilled: computed,
      logOut: action.bound,
      queriesEnabled: computed,
      isAuthorizedView: observable,
      setIsAuthorizedView: action.bound,
      isAppLoading: observable,
      isAppCrashedOnLoad: observable,
      setIsAppLoading: action.bound,
      setIsAppCrashedOnLoad: action.bound,
      cur: observable,
      setCur: action.bound,
    });
  }

  setOpenedChatTargetUserId(value: string) {
    this.openedChatTargetUserId = value;
  }

  setChatRoomsQuery(value: any) {
    this.chatRoomsQuery = value;
  }

  setIsShallUpdateApp(value: boolean) {
    this.isShallUpdateApp = value;
  }

  setIsFreeAccess(value: boolean) {
    this.isFreeAccess = value;
  }

  logOut() {
    this.setAuthJwt('');
    this.setUser(null);
    this.setIsPayedAccess(false);
    this.setIsAuthorizedView(false);
  }

  setIsNotFirstOpen(value: boolean) {
    this.isNotFirstOpen = value;
  }

  setCur(value: string) {
    this.cur = value;
  }

  setIsAuthorizedView(value: boolean) {
    this.isAuthorizedView = value;
  }

  get isAuthorized() {
    return !!this.authJwt;
  }

  get queriesEnabled() {
    return Boolean(
      this.userId &&
        this.user?.status &&
        [USER_STATUS.profileFilled, USER_STATUS.payed].includes(
          this.user.status as USER_STATUS,
        ) &&
        this.isProfileFilled,
    );
  }

  get isProfileFilled() {
    return !!(this.user?.name && this.user?.age && this.user?.gender);
  }

  get userId() {
    if (!this.authJwt) return null;
    const payload = jwtDecode<JwtPayload>(this.authJwt);
    return payload?.sub ?? null;
  }

  setUser(value: User | null) {
    this.user = value;
  }

  setIsPayedAccess(value: boolean) {
    this.isPayedAccess = value;
  }

  setAuthJwt(value: string) {
    this.authJwt = value;
  }

  setIsAppLoading(value: boolean) {
    this.isAppLoading = value;
  }
  setIsAppCrashedOnLoad(value: boolean) {
    this.isAppCrashedOnLoad = value;
  }
}

class WareDictStore {
  wareDict: WareDictItem[] = [];

  constructor() {
    makeObservable(this, {
      wareDict: observable,
      setWareDict: action.bound,
    });
  }

  setWareDict(value: WareDictItem[]) {
    this.wareDict = value;
  }
}

class FeedStore {
  likedUserIds: Record<string, true> = {};
  claimedUserIds: Record<string, true> = {};
  userIdToAvatarPlaceholder: Record<string, number> = {};
  claimedUserIdsLength: number = 0;

  constructor() {
    makeObservable(this, {
      userIdToAvatarPlaceholder: observable,
      likedUserIds: observable,
      claimedUserIds: observable,
      claimedUserIdsLength: observable,
      setUserIdToAvatarPlaceholder: action.bound,
      addLikedUserId: action.bound,
      addClaimedUserId: action.bound,
    });
  }

  addLikedUserId(value: string) {
    if (!this.likedUserIds) this.likedUserIds = {};
    this.likedUserIds[value] = true;
  }

  addClaimedUserId(value: string) {
    if (!this.claimedUserIds) this.claimedUserIds = {};
    this.claimedUserIds[value] = true;
    this.claimedUserIdsLength = this.claimedUserIdsLength + 1;
  }

  setUserIdToAvatarPlaceholder(userId: string, avatarNumber: number) {
    if (!this.userIdToAvatarPlaceholder) this.userIdToAvatarPlaceholder = {};
    this.userIdToAvatarPlaceholder[userId] = avatarNumber;
  }
}

class FilterStore {
  filters: Record<string, any> | null = null;

  constructor() {
    makeObservable(this, {
      filters: observable,
      setFilters: action.bound,
    });
  }

  setFilters(value: Record<string, any> | null) {
    this.filters = value;
  }
}

export const store = new Store();
export const feedStore = new FeedStore();
export const filterStore = new FilterStore();
export const wareDictStore = new WareDictStore();

reaction(
  () => store.authJwt,
  async (authJwt, prevAuthJwt) => {
    try {
      if (authJwt) {
        await Keychain.setGenericPassword('authjwt', authJwt);
      } else {
        const payload = jwtDecode<JwtPayload>(prevAuthJwt);
        const userId = payload?.sub;
        await Keychain.resetGenericPassword();
        if (userId) {
          await onLogout(userId);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
);

reaction(
  () => store.cur,
  async cur => {
    await AsyncStorage.setItem('cur', cur);
  },
);

reaction(
  () => store.isNotFirstOpen,
  async isNotFirstOpen => {
    await AsyncStorage.setItem('isNotFirstOpen', isNotFirstOpen ? 'yes' : 'no');
  },
);

export async function restoreAppState() {
  const credentials = await Keychain.getGenericPassword();

  if (credentials) {
    store.setAuthJwt(credentials.password);
  }

  const cur = await AsyncStorage.getItem('cur');
  store.setCur(cur || 'RUB');

  const isNotFirstOpen = await AsyncStorage.getItem('isNotFirstOpen');
  store.setIsNotFirstOpen(isNotFirstOpen === 'yes' ? true : false);
}

export const StoreContext = React.createContext(store);
export const FilterContext = React.createContext(filterStore);
export const FeedStoreContext = React.createContext(feedStore);
export const WareDictStoreContext = React.createContext(wareDictStore);

const APP_STATE_GQL = gql`
  query ($userId: uuid) {
    users(where: {id: {_eq: $userId}}) {
      status
      applied_filters
      profiles {
        gender
        name
        age
        dont_show_photos
      }
    }
    app_config {
      key
      value
    }
  }
`;

export const useAppState = () => React.useContext(StoreContext);

export const refetchUser = async (store: Store, ac: ApolloClient<any>) => {
  if (store.userId) {
    const query = await ac.query({
      query: APP_STATE_GQL,
      variables: {
        userId: store.userId,
      },
    });

    const isPayedAccess = query?.data?.users?.[0]?.status === USER_STATUS.payed;
    const user = query?.data?.users?.[0] || null;
    const profile = user?.profiles?.[0];
    const filters = query?.data?.users?.[0]?.applied_filters || null;
    const appConfig = query?.data?.app_config;
    const isFreeAccess =
      appConfig?.find?.((item: any) => item.key === 'is_free_access')?.value ===
      'true';

    store.setIsPayedAccess(isFreeAccess || isPayedAccess);
    store.setIsFreeAccess(isFreeAccess);

    if (user) {
      store.setUser({
        profileId: user.id,
        gender: profile?.gender,
        age: profile?.age,
        name: profile?.name,
        status: user?.status,
        dont_show_photos: profile?.dont_show_photos,
      });

      filterStore.setFilters(filters);
      await initNotifications(ac, store);
    } else {
      store.logOut();
    }
  }
};

export function useRefetchUser() {
  const store = useAppState();
  const ac = useApolloClient();

  return useCallback(async () => {
    try {
      await refetchUser(store, ac);
    } catch (error) {
      console.error(error);
    }
  }, [store]);
}
