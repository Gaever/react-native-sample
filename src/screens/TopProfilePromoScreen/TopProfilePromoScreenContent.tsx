import {
  Box,
  Button,
  HStack,
  Icon,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {WareDictItem} from '~src/types';

import React from 'react';
import stylesheet from '~src/styles';
import LogoSvg from '~src/svg/logo-svg';

export interface TopProfilePromoContentProps {
  onContinuePress: () => void;
  ware: WareDictItem;
}

function TopProfilePromoScreenContent(props: TopProfilePromoContentProps) {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <SafeAreaView style={stylesheet.modalContainer}>
      <ScrollView>
        <Box px={9} pb={120} flex={1} width="100%">
          <HStack space={1} pt={3}>
            <Box pb={5} w="100%" alignItems="center">
              <LogoSvg
                width={150}
                height={70}
                fill={theme.colors.primary[400]}
              />
            </Box>
          </HStack>
          <VStack space={2} pb={8}>
            {[
              t('top-profile-promo-screen.advantages.0'),
              t('top-profile-promo-screen.advantages.1'),
              t('top-profile-promo-screen.advantages.2'),
            ].map(item => (
              <HStack alignItems="center" key={item} space={2}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="check"
                  color="black"
                  size={5}
                />
                <Text>{item}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </ScrollView>
      <Box
        position="absolute"
        bottom={0}
        flex={1}
        width="100%"
        px={9}
        py={5}
        pb={1}
        style={{
          shadowColor: theme.colors.gray[300],
          shadowOffset: {
            height: -5,
            width: 0,
          },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }}
        bg="white">
        <SafeAreaView>
          <Button
            onPress={() => {
              props.onContinuePress();
            }}>
            <Text fontWeight={700} color="white">
              {t('top-profile-promo-screen.continue')} {props.ware?.amount}{' '}
              {props.ware?.cur}
            </Text>
          </Button>
        </SafeAreaView>
      </Box>
    </SafeAreaView>
  );
}

export default TopProfilePromoScreenContent;
