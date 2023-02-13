import {Center, Icon, Text} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface FeedScreenPlaceholderProps {
  isFilterApplied: boolean;
}

function FeedScreenPlaceholder(props: FeedScreenPlaceholderProps) {
  const {t} = useTranslation();

  return (
    <Center flex={1}>
      <Text fontWeight={700} fontSize="lg" maxW="75%" textAlign="center">
        {props.isFilterApplied
          ? t('feed-screen.no-profiles-change-filter')
          : t('feed-screen.no-profiles')}
      </Text>
      <Icon
        as={MaterialCommunityIcons}
        name={props.isFilterApplied ? 'heart-broken' : 'heart'}
        size={70}
        color="secondary.400"
      />
    </Center>
  );
}

export default FeedScreenPlaceholder;
