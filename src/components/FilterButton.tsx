import React from 'react';
import {useTranslation} from 'react-i18next';
import IconButton from './ui/IconButton';

export interface FilterButtonProps {
  onPress: () => void;
}

function FilterButton(props: FilterButtonProps) {
  const {t} = useTranslation();

  return (
    <IconButton
      label={t('feed-screen.header.filter')}
      onPress={props.onPress}
      iconName="tune"
    />
  );
}

export default FilterButton;
