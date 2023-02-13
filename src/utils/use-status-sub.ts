import {gql, useApolloClient, useSubscription} from '@apollo/client';
import {useCallback, useEffect} from 'react';
import {Navigation} from 'react-native-navigation';
import {getRoot} from '~src/app';
import {refetchUser, store, useAppState} from '~store/app-state';
import {USER_STATUS} from './consts';

const USER_STATUS_SUB = gql`
  subscription ($userId: uuid) {
    users(where: {id: {_eq: $userId}}) {
      status
    }
  }
`;

function useStatusSub() {
  const {userId} = useAppState();
  const sub = useSubscription(USER_STATUS_SUB, {
    variables: {
      userId,
    },
    skip: !userId,
  });
  const status = sub?.data?.users?.[0]?.status;
  const ac = useApolloClient();

  const onStatusChange = useCallback(async () => {
    await refetchUser(store, ac);
    await Navigation.setRoot(await getRoot(store, false));
  }, [store, ac]);

  useEffect(() => {
    if ([USER_STATUS.moderation, USER_STATUS.disabled].includes(status)) {
      onStatusChange();
    }
  }, [status]);
}

export default useStatusSub;
