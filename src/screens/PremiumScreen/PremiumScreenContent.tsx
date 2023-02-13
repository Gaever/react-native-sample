import {
  Box,
  Button,
  Center,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useWindowDimensions} from 'react-native';
import {TabView} from 'react-native-tab-view';
import KeyValueLi from '~components/ui/KeyValueLi';
import TabBarItem from '~components/ui/TabBarItem';
import {Ware, WareDictItem} from '~src/types';
import {WARE_STATUS} from '~src/utils/consts';
import localTime from '~src/utils/local-time';

export interface PremiumScreenContentProps
  extends PurchasesProps,
    WaresListProps {
  initialTab?: 'purchases' | 'wares';
  simpleTariffPromo?: boolean;
}

export interface PurchasesProps {
  wares: Ware[];
  onWareActivatePress: (ware: Ware) => void;
  isLoading: boolean;
  purchaseListLoading: boolean;
}

function Purchases(props: PurchasesProps) {
  const {t} = useTranslation();

  return (
    <ScrollView flex={1} scrollEnabled={!props.isLoading}>
      {props.isLoading || props.purchaseListLoading ? (
        <>
          <Box
            position="absolute"
            flex={1}
            justifyContent="center"
            zIndex={10}
            width="100%"
            height="100%"
            bg="white"
            opacity={0.7}></Box>
          <Box
            position="absolute"
            flex={1}
            pt={4}
            justifyContent="center"
            zIndex={11}
            width="100%"
            height="100%">
            <Spinner color="gray.400" size="lg" />
          </Box>
        </>
      ) : null}
      <Box mt={4}>
        {props.wares.length > 0 && !props.purchaseListLoading ? (
          <VStack space={6} px={4} mb={2}>
            {props.wares.map(item => (
              <Box key={item.id} shadow={2} borderRadius="lg" bg="white" p={4}>
                <VStack space={3}>
                  <Box>
                    <Text fontSize="lg" fontWeight={500}>
                      {t(`premium-screen.variants.${item.variant}`)}
                    </Text>
                  </Box>
                  {item.status ? (
                    <KeyValueLi
                      label={t('premium-screen.wares.status')!}
                      value={t(`premium-screen.ware-status.${item.status}`)!}
                    />
                  ) : null}

                  {item.created_at ? (
                    <KeyValueLi
                      label={t('premium-screen.wares.created_at')!}
                      value={localTime(item.created_at).format(
                        'DD.MM.yyyy HH:mm',
                      )}
                    />
                  ) : null}

                  {item.activated_at ? (
                    <KeyValueLi
                      label={t('premium-screen.wares.activated_at')!}
                      value={localTime(item.activated_at).format(
                        'DD.MM.yyyy HH:mm',
                      )}
                    />
                  ) : null}

                  {![WARE_STATUS.created, WARE_STATUS.payed].includes(
                    item.status as WARE_STATUS,
                  ) && item.expires_at ? (
                    <KeyValueLi
                      label={t('premium-screen.wares.expires_at')!}
                      value={localTime(item.expires_at).format(
                        'DD.MM.yyyy HH:mm',
                      )}
                    />
                  ) : null}

                  {item?.payment ? (
                    <Text fontSize="md">
                      {t('premium-screen.payment.label')}
                    </Text>
                  ) : null}

                  {item.payment?.created_at ? (
                    <KeyValueLi
                      label={t('premium-screen.payment.created_at')!}
                      value={localTime(item.payment?.created_at).format(
                        'DD.MM.yyyy HH:mm',
                      )}
                    />
                  ) : null}

                  {item.payment?.confirmed_at ? (
                    <KeyValueLi
                      label={t('premium-screen.payment.confirmed_at')!}
                      value={localTime(item.payment?.confirmed_at).format(
                        'DD.MM.yyyy HH:mm',
                      )}
                    />
                  ) : null}

                  {item.payment?.status ? (
                    <KeyValueLi
                      label={t('premium-screen.payment.status')!}
                      value={
                        t(
                          `premium-screen.payment-status.${item.payment.status}`,
                        )!
                      }
                    />
                  ) : null}

                  {item.status === 'payed' ? (
                    <Button
                      onPress={() => {
                        props.onWareActivatePress(item);
                      }}>
                      {t('premium-screen.activate')}
                    </Button>
                  ) : null}
                </VStack>
              </Box>
            ))}
          </VStack>
        ) : null}
        {props.wares.length < 1 && !props.purchaseListLoading ? (
          <Box m={2}>
            <Text fontSize="md">{t('premium-screen.no-payments')}</Text>
          </Box>
        ) : null}
      </Box>
      <Box pb={8} />
    </ScrollView>
  );
}

export interface WaresListProps {
  wareDict: WareDictItem[];
  onWareBuyPress: (wareDictItem: WareDictItem) => void;
}

function WaresList(props: WaresListProps) {
  const {t} = useTranslation();

  return (
    <ScrollView flex={1}>
      <VStack mt={4} space={6} px={4}>
        {(props.wareDict || []).map(item => (
          <Pressable
            key={item.variant}
            onPress={() => {
              props.onWareBuyPress(item);
            }}>
            <Center
              p={4}
              shadow={2}
              bg={{
                linearGradient: {
                  colors: ['secondary.500', 'primary.300'],
                  start: [1, 0],
                  end: [0, 1],
                },
              }}
              borderRadius="lg">
              <Text color="white" fontWeight={700} fontSize="lg">
                {t(`premium-screen.variants.${item.variant}`)}
              </Text>
              <Text color="white" fontSize="sm" fontWeight={600}>
                {item.amount} {item.cur}
              </Text>
            </Center>
          </Pressable>
        ))}
      </VStack>
      {/* <Box bg="white" shadow={2} m={4} p={4} mt={6} borderRadius="lg">
        <Promocode onSubmit={() => {}} />
        </Box> */}
      {/* <Box bg="white" m={4} borderRadius="lg">
        <Promocode onSubmit={() => {}} />
      </Box> */}
    </ScrollView>
  );
}

function PremiumScreenContent(props: PremiumScreenContentProps) {
  const {t} = useTranslation();

  const [routes] = useState([
    {key: 'purchases', title: t('premium-screen.purchases-tab-title')},
    {key: 'wares', title: t('premium-screen.ware-list-tab-title')},
  ]);
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();
  const simpleTariffPromo = props.simpleTariffPromo;

  return (
    <TabView
      swipeEnabled={false}
      renderTabBar={props =>
        simpleTariffPromo ? null : <TabBarItem {...props} />
      }
      renderScene={({route}) => {
        switch (route.key) {
          case 'purchases':
            return (
              <Purchases
                wares={props.wares}
                onWareActivatePress={props.onWareActivatePress}
                isLoading={props.isLoading}
                purchaseListLoading={props.purchaseListLoading}
              />
            );
          case 'wares':
            return (
              <WaresList
                wareDict={props.wareDict}
                onWareBuyPress={props.onWareBuyPress}
              />
            );
        }
      }}
      initialLayout={{width: layout.width}}
      navigationState={{index, routes}}
      onIndexChange={setIndex}
    />
  );
}

export default PremiumScreenContent;
