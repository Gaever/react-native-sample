import {Button, Center, Icon, Text, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ShallUpdateAppScreenContentProps {}

function ShallUpdateAppScreenContent() {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={{flex: 1}}>
      <Center flex={1} p={4}>
        <VStack space={6} alignItems="center">
          <Icon
            as={MaterialCommunityIcons}
            name="cog"
            size={70}
            color="secondary.400"
          />

          <Text textAlign="center" fontSize="lg">
            {t(`shall-update-screen.text`)}{' '}
            {Platform.select({ios: 'AppStore', android: 'Play Market'})}
          </Text>
        </VStack>
      </Center>
    </SafeAreaView>
  );
}

export default ShallUpdateAppScreenContent;
