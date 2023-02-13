import {gql, useMutation, useQuery} from '@apollo/client';
import {observer} from 'mobx-react-lite';
import React, {useCallback, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {Ware} from '~src/types';
import {WARE_STATUS, WARE_VARIANT} from '~src/utils/consts';
import localTime from '~src/utils/local-time';
import useFeatures from '~src/utils/use-features';
import {useAppState, WareDictStoreContext} from '~store/app-state';
import PremiumScreenContent, {
  PremiumScreenContentProps,
} from './PremiumScreenContent';

export interface PremiumScreenContainerProps
  extends Pick<PremiumScreenContentProps, 'onWareBuyPress' | 'initialTab'> {
  onWareActivate: () => void;
}

const ACTIVATE_WARE_MUTATION = gql`
  mutation ($wareId: String = "") {
    activateWare(arg1: {wareId: $wareId}) {
      success
    }
  }
`;

const WARES_QUERY = gql`
  query ($userId: uuid!) {
    wares(where: {userId: {_eq: $userId}}, order_by: {created_at: desc}) {
      id
      status
      variant
      expires_at
      created_at
      activated_at
      paymentId: paymentsId
      payment {
        amount
        error: error_message
        cur
        id
        sbp_href
        status
        variant
        created_at
        expires_at
        finalized_at
      }
    }
  }
`;

const PremiumScreenContainer = observer(
  (props: PremiumScreenContainerProps) => {
    const {userId, cur} = useAppState();
    const {wareDict} = useContext(WareDictStoreContext);
    const waresQuery = useQuery(WARES_QUERY, {
      variables: {userId},
      skip: !userId,
    });
    const {t} = useTranslation();
    const [activateWareMutation, activateWareMutationData] = useMutation(
      ACTIVATE_WARE_MUTATION,
      {
        onCompleted: () => {
          waresQuery.refetch();
          Alert.alert(
            t('premium-screen.purchase-activated-success-alert-title'),
            t('premium-screen.purchase-activated-success-alert-text')!,
          );
        },
      },
    );
    const wares = waresQuery.data?.wares || [];
    const {simpleTariffPromo} = useFeatures();

    const onWareActivatePress = useCallback(
      (ware: Ware) => {
        if (ware.variant === WARE_VARIANT['top-1-day']) {
          const activatedLeverages = wares.find(
            (item: any) =>
              item.variant === WARE_VARIANT['top-1-day'] &&
              item.status === WARE_STATUS.activated &&
              localTime(item.expires_at).isAfter(localTime(new Date())),
          );
          if (activatedLeverages) {
            Alert.alert(
              t('premium-screen.wait-for-prev-levarege-expired-title'),
              t('premium-screen.wait-for-prev-levarege-expired-text')!,
            );
          } else {
            activateWareMutation({variables: {wareId: ware.id}});
          }
        } else {
          activateWareMutation({variables: {wareId: ware.id}});
        }
      },
      [activateWareMutation, wares],
    );

    const isLoading = activateWareMutationData.loading;

    return (
      <PremiumScreenContent
        initialTab={props.initialTab}
        wares={wares}
        wareDict={wareDict.filter(item => item.cur === cur)}
        onWareBuyPress={props.onWareBuyPress}
        onWareActivatePress={onWareActivatePress}
        isLoading={isLoading}
        purchaseListLoading={waresQuery.loading}
        simpleTariffPromo={simpleTariffPromo}
      />
    );
  },
);

export default PremiumScreenContainer;
