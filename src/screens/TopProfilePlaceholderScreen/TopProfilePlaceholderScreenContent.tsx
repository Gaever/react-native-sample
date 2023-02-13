import {Center, Icon, Text, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface TopProfilePlaceholderScreenContentProps {}

function TopProfilePlaceholderScreenContent(
  props: TopProfilePlaceholderScreenContentProps,
) {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Center flex={1} p={4}>
        <VStack space={6} alignItems="center">
          <Icon
            as={MaterialCommunityIcons}
            name="heart"
            size={70}
            color="secondary.400"
          />

          <Text textAlign="center" fontSize="2xl">
            {t('top-profile-placeholder-screen.text')}
          </Text>
        </VStack>
      </Center>
    </SafeAreaView>
  );
}

export default TopProfilePlaceholderScreenContent;
