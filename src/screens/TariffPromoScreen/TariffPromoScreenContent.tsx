import {
  Box,
  Button,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Promocode from '~components/Promocode';
import SignInModalFormWrapper from '~components/SignInModalFormWrapper';
import LogoSvg from '~src/svg/logo-svg';
import {WareDictItem} from '~src/types';
import {WARE_VARIANT} from '~src/utils/consts';

export interface TariffPromoScreenContentProps {
  onContinuePress: (ware: WareDictItem | null, promocode: string) => void;
  onRejectPress: () => void;
  wares: WareDictItem[];
  cur: string;
  promocodeError: string | undefined;
  isLoading: boolean;
  simpleTariffPromo: boolean;
}

export interface TariffPickerProps {
  disabled: boolean;
  selected: number | null;
  wares: WareDictItem[];
  onChange: (index: number) => void;
  cur: string;
}

export interface TariffPromoPickerItemProps extends React.PropsWithChildren {
  selected: boolean;
  disabled: boolean;
  isPopular?: boolean;
  onPress: () => void;
}

function TariffPromoPickerItem(props: TariffPromoPickerItemProps) {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <Pressable
      onPress={() => {
        if (!props.disabled) {
          props.onPress();
        }
      }}>
      <Box mt={props.isPopular ? 4 : 0}>
        {props.isPopular ? (
          <Box
            position="absolute"
            bg="secondary.400"
            top="-25px"
            left={5}
            p={1}
            pl={2}
            pr={2}
            borderTopRadius={5}>
            <Text fontSize="sm" color="white">
              {t('tariff-screen.is-popular')}
            </Text>
          </Box>
        ) : null}
        <Box
          borderRadius={theme.radii['xl']}
          bg={props.selected ? 'black' : 'gray.300'}
          p={3}
          borderWidth={4}
          {...(props.selected
            ? {borderColor: 'secondary.400', shadow: 5}
            : {borderColor: 'transparent'})}>
          <Text
            fontSize="md"
            lineHeight="30px"
            color={props.selected ? 'white' : null}>
            {props.children}
          </Text>
        </Box>
      </Box>
    </Pressable>
  );
}

function TariffPicker(props: TariffPickerProps) {
  const {t} = useTranslation();

  return (
    <VStack space={6}>
      {props.wares.map((item, index) => (
        <TariffPromoPickerItem
          disabled={props.disabled}
          key={item.id}
          isPopular={item.variant === WARE_VARIANT['premium-30-day']}
          selected={props.selected === index}
          onPress={() => {
            props.onChange(index);
          }}>
          <Text>
            <Text fontWeight="bold">{t(`wares.${item.variant}.title`)}</Text>{' '}
            {t(`wares.${item.variant}.description`, '')}
          </Text>
          {'\n'}
          <Text fontWeight="bold">
            {props.cur} {item.amount}
          </Text>
        </TariffPromoPickerItem>
      ))}
    </VStack>
  );
}

function TariffPromoScreenContent(props: TariffPromoScreenContentProps) {
  const {t} = useTranslation();
  const theme = useTheme();
  const [promocode, setPromocode] = useState('');

  const [selectedWareIndex, setSelectedWareIndex] = useState<number | null>(
    props.wares.findIndex(
      item => item.variant === WARE_VARIANT['premium-30-day'],
    ),
  );

  const isSubmitDisabled =
    props.isLoading || (selectedWareIndex === null && !promocode);

  if (props.simpleTariffPromo) {
    return (
      <SignInModalFormWrapper pt={0}>
        <ScrollView>
          <Box px={9} pb={170} flex={1} pt={3} width="100%">
            <HStack space={1}>
              <Box pb={5} w="100%" alignItems="center">
                <LogoSvg
                  width={150}
                  height={70}
                  fill={theme.colors.primary[400]}
                />
              </Box>
            </HStack>
            <Box mt={4}>
              <Promocode
                error={props.promocodeError}
                disabled={props.isLoading}
                value={promocode}
                onChange={value => {
                  setPromocode(value);
                }}
                showSubmit={false}
              />
            </Box>
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
          <Button
            disabled={isSubmitDisabled}
            backgroundColor={isSubmitDisabled ? 'gray.300' : null}
            isLoading={props.isLoading}
            onPress={() => {
              const selectedWare =
                selectedWareIndex !== null
                  ? props.wares?.[selectedWareIndex]
                  : null;
              props.onContinuePress(selectedWare, promocode);
            }}>
            {t('tariff-screen.continue-simple')}
          </Button>
          <Button
            disabled={props.isLoading}
            onPress={props.onRejectPress}
            variant="ghost"
            colorScheme="gray.400">
            {t('tariff-screen.reject-simple')}
          </Button>
        </Box>
      </SignInModalFormWrapper>
    );
  }

  return (
    <SignInModalFormWrapper pt={0}>
      <ScrollView>
        <Box px={9} pb={170} flex={1} pt={3} width="100%">
          <HStack space={1}>
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
              t('tariff-screen.advantages.0'),
              t('tariff-screen.advantages.1'),
              t('tariff-screen.advantages.2'),
              t('tariff-screen.advantages.3'),
              t('tariff-screen.advantages.4'),
            ].map(item => (
              <HStack alignItems="center" key={item} space={2}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="check"
                  color="black"
                  size={5}
                />
                <Text fontSize="md">{item}</Text>
              </HStack>
            ))}
          </VStack>
          <TariffPicker
            disabled={props.isLoading}
            cur={props.cur}
            wares={props.wares || []}
            selected={selectedWareIndex}
            onChange={setSelectedWareIndex}
          />
          <Box mt={4}>
            <Promocode
              isHighlighted={!!(promocode && selectedWareIndex === null)}
              error={props.promocodeError}
              disabled={props.isLoading}
              value={promocode}
              onFocus={() => {
                setSelectedWareIndex(null);
              }}
              onChange={value => {
                setPromocode(value);
                setSelectedWareIndex(null);
              }}
              showSubmit={false}
            />
          </Box>
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
        <Button
          disabled={isSubmitDisabled}
          backgroundColor={isSubmitDisabled ? 'gray.300' : null}
          isLoading={props.isLoading}
          onPress={() => {
            const selectedWare =
              selectedWareIndex !== null
                ? props.wares?.[selectedWareIndex]
                : null;
            props.onContinuePress(selectedWare, promocode);
          }}>
          {t('tariff-screen.continue')}
        </Button>
        <Button
          disabled={props.isLoading}
          onPress={props.onRejectPress}
          variant="ghost"
          colorScheme="gray.400">
          {t('tariff-screen.reject')}
        </Button>
      </Box>
    </SignInModalFormWrapper>
  );
}

export default TariffPromoScreenContent;
