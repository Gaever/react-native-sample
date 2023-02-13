import {gql, useApolloClient} from '@apollo/client';
import {useMutation} from '@tanstack/react-query';
import {useAppState} from '~store/app-state';

const PROMOCODE_PREVIEW_GQL = gql`
  query ($cur: String!, $promocode: String!) {
    promocodePreview(arg1: {cur: $cur, promocode: $promocode}) {
      is_free
      total_amount
      error
    }
  }
`;

function usePromocode(props?: {onSuccess?: (data: any) => void}) {
  const {cur} = useAppState();
  const ac = useApolloClient();
  const promocodePreviewQuery = useMutation(
    async (promocode: string) =>
      ac.query({query: PROMOCODE_PREVIEW_GQL, variables: {cur, promocode}}),
    {
      onSuccess: props?.onSuccess,
    },
  );

  return {
    promocodePreviewQuery,
  };
}

export default usePromocode;
