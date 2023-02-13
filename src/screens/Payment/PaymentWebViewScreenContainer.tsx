import {gql, useMutation, useSubscription} from '@apollo/client';
import {useMutation as useReactMutation} from '@tanstack/react-query';
import {observer} from 'mobx-react-lite';
import {Box, Center, Spinner} from 'native-base';
import React, {useEffect} from 'react';
import {WebView} from 'react-native-webview';
import SignInModalFormWrapper from '~components/SignInModalFormWrapper';
import {WareDictItem} from '~src/types';
import {USER_STATUS, WARE_STATUS} from '~src/utils/consts';
import {useAppState, useRefetchUser} from '~store/app-state';

export interface PaymentWebViewScreenContainerProps {
  wareDictItem: WareDictItem;
  promocode?: string;
  onPaymentSucceed: () => void;
}

const CREATE_PAYMENT_MUTATION = gql`
  mutation ($cur: String!, $wareVariant: String, $promocode: String) {
    createPayment(
      arg1: {cur: $cur, wareVariant: $wareVariant, promocode: $promocode}
    ) {
      cardHref
      paymentGateOrderId
      sbpHref
      wareId
      isFree
    }
  }
`;

const WARE_GQL = gql`
  subscription ($wareId: uuid) {
    wares(where: {id: {_eq: $wareId}}) {
      status
      user {
        status
      }
    }
  }
`;

const PaymentWebViewScreenContainer = observer(
  (props: PaymentWebViewScreenContainerProps) => {
    const {setIsPayedAccess} = useAppState();
    const [createPaymentMutate, createPaymentMutationData] = useMutation(
      CREATE_PAYMENT_MUTATION,
    );
    const refetchUser = useRefetchUser();
    const refetchUserMutation = useReactMutation(refetchUser, {
      onSuccess: () => {
        props.onPaymentSucceed();
      },
    });

    const wareId = createPaymentMutationData.data?.createPayment?.wareId;
    const cardHref = createPaymentMutationData.data?.createPayment?.cardHref;

    const wareSubscription = useSubscription(WARE_GQL, {
      variables: {wareId},
      skip: !wareId,
      onData: ({data}) => {
        const userStatus = data?.data?.wares?.[0]?.user?.status;
        setIsPayedAccess(userStatus === USER_STATUS.payed);
      },
    });
    const wareStatus = wareSubscription.data?.wares?.[0]?.status;

    useEffect(() => {
      if (
        wareStatus === WARE_STATUS.payed ||
        wareStatus === WARE_STATUS.activated
      ) {
        refetchUserMutation.mutate();
      }
    }, [wareStatus]);

    useEffect(() => {
      if (props.wareDictItem.variant) {
        createPaymentMutate({
          variables: {
            cur: props.wareDictItem.cur,
            wareVariant: props.wareDictItem.variant,
            promocode: props.promocode,
          },
        });
      }
    }, []);

    if (createPaymentMutationData.loading || !createPaymentMutationData.data) {
      return (
        <Box w="100%" h="100%" borderRadius="lg">
          <Center flex={1}>
            <Spinner size="lg" color="gray.400" />
          </Center>
        </Box>
      );
    }

    return (
      <SignInModalFormWrapper>
        <WebView source={{uri: cardHref}} />
      </SignInModalFormWrapper>
    );
  },
);
export default PaymentWebViewScreenContainer;
