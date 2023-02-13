import React, {useCallback, useContext} from 'react';
import RNPickerSelect, {PickerSelectProps} from 'react-native-picker-select';

import _uniq from 'lodash/uniq';
import {observer} from 'mobx-react-lite';
import {useAppState, WareDictStoreContext} from '~store/app-state';
import useFeatures from '~src/utils/use-features';

export interface CurrencyPickerProps {
  onChange: (cur: string) => void;
  onClose: () => void;
  visible: boolean;
}

const CurrencyPicker = observer((props: CurrencyPickerProps) => {
  const {cur, setCur} = useAppState();
  const {wareDict: wares} = useContext(WareDictStoreContext);
  const currencies: PickerSelectProps['items'] = _uniq(
    wares.map(item => item.cur),
  )
    .filter(Boolean)
    .map(item => ({
      label: item,
      value: item,
    }));
  const features = useFeatures();

  const onClose = useCallback(() => {
    props.onChange(cur);
    props.onClose();
  }, [cur]);

  if (!features['currencyPicker']) {
    return null;
  }

  return (
    // @ts-expect-error
    <RNPickerSelect
      modalProps={{
        visible: props.visible,
      }}
      value={cur}
      textInputProps={{
        style: {
          display: 'none',
        },
      }}
      items={currencies}
      onValueChange={itemValue => {
        setCur(itemValue);
      }}
      onClose={onClose}
      onDonePress={onClose}
    />
  );
});

export default CurrencyPicker;
