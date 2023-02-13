import {Box, HStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import FilterButton, {FilterButtonProps} from '~components/FilterButton';
import PremiumButton from '~components/PremiumButton';
import IconButton from '~components/ui/IconButton';
import {feedFiewType} from '~src/types';

export interface FeedScreenHeaderProps {
  FilterButtonProps: FilterButtonProps;
  ToggleViewButtonProps: {
    viewVariant: feedFiewType;
    onPress: () => void;
  };
  isShowPremiumButton: boolean;
}

function FeedScreenHeader(props: FeedScreenHeaderProps) {
  const {t} = useTranslation();

  return (
    <Box px={2} py={2} h={'40px'}>
      <HStack alignItems="center" justifyContent="space-between">
        <HStack space={3}>
          <FilterButton {...props.FilterButtonProps} />
          <IconButton
            iconName={
              props.ToggleViewButtonProps.viewVariant === 'feed'
                ? 'grid-large'
                : 'view-sequential-outline'
            }
            label={t(
              `feed-screen.view-variant-${
                props.ToggleViewButtonProps.viewVariant === 'feed'
                  ? 'grid'
                  : 'feed'
              }`,
            )}
            onPress={props.ToggleViewButtonProps.onPress}
          />
        </HStack>
        {props.isShowPremiumButton ? <PremiumButton /> : null}
      </HStack>
    </Box>
  );
}

export default FeedScreenHeader;
