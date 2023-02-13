import {Box, Button, Circle, HStack, Icon, Text, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import stylesheet from '~src/styles';

export interface PaymentFailedScreenContentProps {
  error?: string;
  onReturnToPaymentOptionsPress: () => void;
  onReturnToMainScreenPress: () => void;
}

function PaymentFailedScreenContent(props: PaymentFailedScreenContentProps) {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={stylesheet.modalContainer}>
      <Box flex={1} h="100%" pt={5}>
        <Box px={9}>
          <Text fontSize={30} fontWeight={800}>
            {t('payment.failed.title')}
          </Text>
          <HStack alignItems="center" mt={4}>
            <Circle h="25px" w="25px" borderWidth={2} borderColor="gray.400">
              <Icon
                as={MaterialCommunityIcons}
                name="exclamation-thick"
                size="18px"
                color="gray.400"
              />
            </Circle>
            <Box ml={2}>
              <Text>{t('payment.failed.subtitle')}</Text>
            </Box>
          </HStack>
          <Text mt={6}>{props.error || t('generic-error')}</Text>
        </Box>
        <VStack position="absolute" bottom={0} w="100%" px={9} space={2} pb={5}>
          <Button
            variant="outline"
            colorScheme="secondary"
            onPress={props.onReturnToPaymentOptionsPress}>
            {t('payment.failed.choose-payment-method')}
          </Button>
          <Button
            variant="outline"
            colorScheme="secondary"
            onPress={props.onReturnToMainScreenPress}>
            {t('payment.failed.to-main-screen')}
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

export default PaymentFailedScreenContent;
