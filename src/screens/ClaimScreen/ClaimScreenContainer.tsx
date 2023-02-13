import {gql, useMutation} from '@apollo/client';
import {observer} from 'mobx-react-lite';
import React, {useCallback, useContext} from 'react';
import {FeedStoreContext, useAppState} from '~store/app-state';
import ClaimScreenContent from './ClaimScreenContent';

export interface ClaimScreenContainerProps {
  onSubmit: () => void;
  targetUserId: string;
}

const ADD_CLAIM_MUTATION = gql`
  mutation (
    $claim: claims_insert_input = {}
    $chat_rooms_set_input: chat_rooms_set_input = {}
    $chat_rooms_bool_exp: chat_rooms_bool_exp = {}
  ) {
    insert_claims_one(object: $claim) {
      id
    }
    update_chat_rooms(
      where: $chat_rooms_bool_exp
      _set: $chat_rooms_set_input
    ) {
      returning {
        id
      }
    }
  }
`;

const ClaimScreenContainer = observer((props: ClaimScreenContainerProps) => {
  const {userId} = useAppState();
  const [addClaimMutation] = useMutation(ADD_CLAIM_MUTATION);
  const {addClaimedUserId} = useContext(FeedStoreContext);

  const submitClaim = useCallback(
    async (variant: string, message?: string) => {
      await addClaimMutation({
        variables: {
          claim: {
            user_1_id: userId,
            user_2_id: props.targetUserId,
            variant,
            message,
          },
          chat_rooms_set_input: {
            status: 'closed-claimed',
          },
          chat_rooms_bool_exp: {
            _and: [
              {chat_rooms_users__links: {userId: {_eq: userId}}},
              {chat_rooms_users__links: {userId: {_eq: props.targetUserId}}},
            ],
          },
        },
      });
      addClaimedUserId(props.targetUserId);
      props.onSubmit();
    },
    [addClaimMutation, userId, props.targetUserId],
  );

  return <ClaimScreenContent onSubmit={submitClaim} />;
});

export default ClaimScreenContainer;
