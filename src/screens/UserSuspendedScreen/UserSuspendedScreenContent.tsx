import {Button, Center, Icon, Text, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface UserSuspendedScreenContentProps {
  variant: 'disabled' | 'moderation';
  onLogoutPress: () => void;
}

function UserSuspendedScreenContent(props: UserSuspendedScreenContentProps) {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={{flex: 1}}>
      <Center flex={1} p={4}>
        <VStack space={6} alignItems="center">
          <Icon
            as={MaterialCommunityIcons}
            name="exclamation"
            size={70}
            color="secondary.400"
          />

          <Text textAlign="left" fontSize="lg">
            {t(`user-suspended-${props.variant}.message`)}
          </Text>
          <Button colorScheme="secondary" mt={4} onPress={() => {}}>
            {t(`user-suspended-${props.variant}.logout`)}
          </Button>
        </VStack>
      </Center>
    </SafeAreaView>
  );
}

export default UserSuspendedScreenContent;
