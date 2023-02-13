import {Box, Button, Icon, Link, Text} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import stylesheet from '~src/styles';
import SbpLogoSvg from '~src/svg/sbp-logo';

export interface ChoosePaymentScreenContentProps {
  amount: number;
  cur: string;
  onSbpPayPress: () => void;
  onBankCardPayPress: () => void;
  paymentMethods: string[];
}

function ChoosePaymentScreenContent(props: ChoosePaymentScreenContentProps) {
  return (
    <Box style={stylesheet.container} px={9} pt={9}>
      <Box bg="gray.300" borderRadius="xl" p={3}>
        <Text fontWeight={700} fontSize={25} textAlign="center">
          К оплате: {props.amount} {props.cur}
        </Text>
      </Box>
      {props.paymentMethods.includes('sbp') ? (
        <>
          <Button
            onPress={props.onSbpPayPress}
            variant="elevated"
            height="75px"
            borderRadius="2xl"
            shadow={1}
            mt={10}>
            <SbpLogoSvg height={50} />
          </Button>
          <Text color="gray.400" fontSize={10} mt={2}>
            Банки, поддерживающие оплату через СБП: Сбер, Тинькофф, Альфа-Банк,
            ВТД, Райффайзенбанк, Росбанк, Открытие и прочие. Полный список
            банков,{' '}
            <Link
              href="https://sbp.nspk.ru/participants"
              _text={{color: 'primary.400', fontSize: 10, top: '1px'}}>
              sbp.nspk.ru/participants
            </Link>
            .
          </Text>
        </>
      ) : null}
      {props.paymentMethods.includes('bankCard') ? (
        <>
          <Button
            onPress={props.onBankCardPayPress}
            variant="elevated"
            height="75px"
            borderRadius="2xl"
            shadow={1}
            leftIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="credit-card"
                color="primary.400"
                size={30}
              />
            }
            mt={10}>
            Оплата банковской картой
          </Button>
          <Text color="gray.400" fontSize={10} mt={2}>
            Банки, поддерживающие оплату через СБП: Сбер, Тинькофф, Альфа-Банк,
            ВТД, Райффайзенбанк, Росбанк, Открытие и прочие. Полный список
            банков,{' '}
            <Link
              href="https://sbp.nspk.ru/participants"
              _text={{color: 'primary.400', fontSize: 10, top: '1px'}}>
              sbp.nspk.ru/participants
            </Link>
            .
          </Text>
        </>
      ) : null}
    </Box>
  );
}

export default ChoosePaymentScreenContent;
