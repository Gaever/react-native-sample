import {observer} from 'mobx-react-lite';
import React, {useContext} from 'react';
import {WARE_VARIANT} from '~src/utils/consts';
import formatError from '~src/utils/format-error';
import useFeatures from '~src/utils/use-features';
import usePromocode from '~src/utils/use-promocode';
import {useAppState, WareDictStoreContext} from '~store/app-state';
import TariffScreenContent, {
  TariffPromoScreenContentProps,
} from './TariffPromoScreenContent';

export interface TariffScreenContainerProps
  extends Pick<
    TariffPromoScreenContentProps,
    'onContinuePress' | 'onRejectPress'
  > {}

const TariffScreenContainer = observer((props: TariffScreenContainerProps) => {
  const {isAuthorizedView, setIsAuthorizedView, cur} = useAppState();
  const {wareDict: wares} = useContext(WareDictStoreContext);
  const {simpleTariffPromo} = useFeatures();
  const waresOfCur = wares
    .filter(
      item => item.cur === cur && item.variant !== WARE_VARIANT['top-1-day'],
    )
    .sort((a, b) => {
      const w: Record<string, number> = {
        [WARE_VARIANT['access-3-day']]: 1,
        [WARE_VARIANT['premium-30-day']]: 2,
        [WARE_VARIANT['access-7-day']]: 3,
        [WARE_VARIANT['access-30-day']]: 4,
        [WARE_VARIANT['access-120-day']]: 5,
      };
      return w[a.variant] - w[b.variant];
    });
  const {promocodePreviewQuery} = usePromocode();

  return (
    <TariffScreenContent
      simpleTariffPromo={simpleTariffPromo}
      onRejectPress={() => {
        if (!isAuthorizedView) {
          setIsAuthorizedView(true);
        } else {
          props.onRejectPress();
        }
      }}
      onContinuePress={async (ware, promocode) => {
        if (promocode) {
          const {data, error} = await promocodePreviewQuery.mutateAsync(
            promocode,
          );

          if (!error && !data?.promocodePreview?.error) {
            props.onContinuePress(ware, promocode);
          }
        } else {
          props.onContinuePress(ware, promocode);
        }
      }}
      isLoading={promocodePreviewQuery.isLoading}
      promocodeError={
        formatError(promocodePreviewQuery.data?.data?.promocodePreview?.error)
          ?.error || formatError(promocodePreviewQuery.data?.error)?.error
      }
      wares={waresOfCur}
      cur={cur}
    />
  );
});

export default TariffScreenContainer;
