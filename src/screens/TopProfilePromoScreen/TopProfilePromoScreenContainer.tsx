import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import {WARE_VARIANT} from '~src/utils/consts';
import {useAppState, WareDictStoreContext} from '~store/app-state';
import TopProfilePromoScreenContent from './TopProfilePromoScreenContent';

export interface TopProfilePromoContainerProps {
  onContinuePress: (wareDictItemVariant: string) => void;
}

const TopProfilePromoScreenContainer = observer(
  (props: TopProfilePromoContainerProps) => {
    const {wareDict: wares} = useContext(WareDictStoreContext);
    const {cur} = useAppState();
    const top1dayWare = wares.find(
      item => item.cur === cur && item.variant === WARE_VARIANT['top-1-day'],
    );

    return (
      <TopProfilePromoScreenContent
        ware={top1dayWare!}
        onContinuePress={() => {
          props.onContinuePress(top1dayWare?.variant!);
        }}
      />
    );
  },
);

export default TopProfilePromoScreenContainer;
