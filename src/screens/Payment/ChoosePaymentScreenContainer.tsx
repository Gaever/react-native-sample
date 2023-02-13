import {observer} from 'mobx-react-lite';
import React, {useContext, useEffect} from 'react';
import {WareDictItem} from '~src/types';
import useFeatures from '~src/utils/use-features';
import usePromocode from '~src/utils/use-promocode';
import {useAppState, WareDictStoreContext} from '~store/app-state';
import ChoosePaymentScreenContent from './ChoosePaymentScreenContent';

export interface ChoosePaymentScreenContainerProps {
  wareDictItemVariant: string | null;
  promocode?: string;
  onBankCardPayPress: (wareDictItem: WareDictItem, promocode?: string) => void;
  onSbpPayPress: (wareDictItem: WareDictItem, promocode?: string) => void;
}

const ChoosePaymentScreenContainer = observer(
  (props: ChoosePaymentScreenContainerProps) => {
    const {cur} = useAppState();
    const features = useFeatures();
    const {wareDict} = useContext(WareDictStoreContext);
    const wareDictItem = wareDict.find(
      item => item.variant === props.wareDictItemVariant && item.cur === cur,
    )!;

    const {promocodePreviewQuery} = usePromocode();
    const isFree = promocodePreviewQuery?.data?.data?.promocodePreview?.is_free;

    useEffect(() => {
      if (props.promocode) {
        promocodePreviewQuery.mutate(props.promocode);
      }
    }, []);

    useEffect(() => {
      if (isFree) {
        props.onBankCardPayPress(wareDictItem, props.promocode);
      }
    }, [isFree]);

    if ((props.promocode && promocodePreviewQuery.isLoading) || isFree) {
      return null;
    }

    return (
      <ChoosePaymentScreenContent
        paymentMethods={[
          (features.payment.bankCard && 'bankCard') || '',
          (features.payment.sbp && 'sbp') || '',
        ].filter(Boolean)}
        onBankCardPayPress={() => {
          props.onBankCardPayPress(wareDictItem, props.promocode);
        }}
        onSbpPayPress={() => {
          props.onSbpPayPress(wareDictItem, props.promocode);
        }}
        amount={wareDictItem.amount}
        cur={cur}
      />
    );
  },
);

export default ChoosePaymentScreenContainer;
