import React, {useState} from 'react';
import {Platform} from 'react-native';
import {
  LayoutStackChildren,
  Navigation,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import i18n from '~src/i18n';
import FilterModalContainer from './FilterModalContainer';

export interface FilterScreenProps {}

const FilterModal: ScreenFC<FilterScreenProps> = props => {
  const [onSubmitCb, setOnSubmitCb] = useState<(() => void) | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useNavigationButtonPress(e => {
    if (e.buttonId === 'FilterScreen.button-close') {
      Navigation.dismissModal(props.componentId);
    }

    if (e.buttonId === 'FilterScreen.button-save') {
      setIsSubmitting(true);
      if (!isSubmitting) {
        onSubmitCb?.();
      }
    }
  });

  return (
    <FilterModalContainer
      onSubmit={() => {
        setIsSubmitting(false);
        Navigation.dismissModal(props.componentId);
      }}
      registerSubmitHandler={setOnSubmitCb}
    />
  );
};

FilterModal.screenName = 'FilterModal';
export const layoutOptions: (
  props?: FilterScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: FilterModal.screenName,
    options: {
      modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
      modal: {
        swipeToDismiss: false,
      },
      topBar: {
        title: {
          text: i18n.t('filter-modal.modal-title')!,
          alignment: 'center',
        },
        leftButtons: [
          {
            id: 'FilterScreen.button-close',
            text: i18n.t('close-modal')!,
            ...Platform.select({
              ios: null,
              android: {
                color: '#000000',
              },
            }),
          },
        ],
        rightButtons: [
          {
            id: 'FilterScreen.button-save',
            text: i18n.t('apply')!,
            ...Platform.select({
              ios: null,
              android: {
                color: '#000000',
              },
            }),
          },
        ],
      },
    },
  },
});

export default FilterModal;
