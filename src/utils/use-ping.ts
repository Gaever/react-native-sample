import {ApolloClient, gql, useMutation} from '@apollo/client';
import moment from 'moment';
import {useCallback} from 'react';
import {useAppState} from '~store/app-state';

const PING_USER_MUTATION = gql`
  mutation ($userId: uuid!, $last_seen: timestamp!) {
    update_users(where: {id: {_eq: $userId}}, _set: {last_seen: $last_seen}) {
      returning {
        id
      }
    }
  }
`;

export async function ping(
  ac: ApolloClient<any>,
  userId: string | undefined | null,
) {
  if (!userId) {
    return;
  }

  try {
    await ac.mutate({
      mutation: PING_USER_MUTATION,
      variables: {userId, last_seen: moment.utc().toDate()},
    });
  } catch {}
}

function usePing() {
  const {userId} = useAppState();
  const [mutate] = useMutation(PING_USER_MUTATION, {
    variables: {
      userId,
      last_seen: moment.utc().toDate(),
    },
  });

  const doPing = useCallback(() => {
    if (userId) {
      mutate();
    }
  }, [mutate, userId]);

  return doPing;
}

export default usePing;
