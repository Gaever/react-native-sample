import {Box, Button, Center, Icon, Text, VStack} from 'native-base';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import stylesheet from '~src/styles';

export interface PaymentSuccessScreenContentProps {
  subtitle?: string;
  onPress: () => void;
}

function PaymentSuccessScreenContent(props: PaymentSuccessScreenContentProps) {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={stylesheet.modalContainer}>
      <Box flex={1} h="100%" pt={5}>
        <Box px={9}>
          <Text fontSize={30} fontWeight={800}>
            {t('payment.success.title')}
          </Text>
          <Text>{props.subtitle}</Text>
          <Center pt={5}>
            <Icon
              as={MaterialCommunityIcons}
              name="check"
              color="primary.400"
              size={150}
            />
          </Center>
        </Box>
        <VStack position="absolute" bottom={0} w="100%" px={9} space={2} pb={5}>
          <Button onPress={props.onPress}>
            {t('payment.success.to-main-screen')}
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

export default PaymentSuccessScreenContent;
