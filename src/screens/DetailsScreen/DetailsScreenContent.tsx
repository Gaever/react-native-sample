import {
  AspectRatio,
  Box,
  Circle,
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '~components/chat/Header';
import PhotoSwiper from '~components/PhotoSwiper';
import KeyValueLi from '~components/ui/KeyValueLi';
import stylesheet from '~src/styles';
import {User} from '~src/types';
import {agePlurals} from '~src/utils/age-plurals';

export interface DetailsScreenContentProps {
  user: User;
  dontShowPhotos: boolean;
  isLiked: boolean;
  isPreview?: boolean;
  onChatPress: () => void;
  onLikePress: () => void;
  onClaimPress: () => void;
  onBackPress: () => void;
}

const profileFields: (keyof User)[] = [
  'is_agent',
  'nation',
  'citizenship',
  'can_move',
  'education',
  'earn',
  'marrige',
  'children',
  'disability',
  'religion',
  'polygamy',
  'hidgab',
  'wives',
  'appearance',
];

function DetailsScreenContent(props: DetailsScreenContentProps) {
  const {t} = useTranslation();

  const isNoPhotos = !props.user?.photos?.find(item => item?.uri);

  return (
    <SafeAreaView style={[stylesheet.container]}>
      <Header
        onBackPress={props.onBackPress}
        onClaimPress={props.onClaimPress}
        showAvatar={false}
        showClaim={!props.isPreview}
      />

      <ScrollView flex={1}>
        {!isNoPhotos && !props.dontShowPhotos ? (
          <Box flex={1}>
            <AspectRatio ratio={1}>
              <PhotoSwiper
                user={props.user}
                borderBottomRadius={0}
                borderTopRadius={0}
              />
            </AspectRatio>
          </Box>
        ) : null}
        <HStack m={5} alignItems="center" justifyContent="center">
          <Box flex={1}>
            <Text fontWeight={700} fontSize="lg">
              {[
                props.user.name || t('details-screen.no-name'),
                props.user.age ? agePlurals(t, new Date(props.user.age)) : null,
              ]
                .filter(Boolean)
                .join(`\n`)}
            </Text>
            <Text fontWeight={700} fontSize="lg">
              {[props.user.city, props.user.country].filter(Boolean).join(', ')}
            </Text>
            {props.user.isOnline ? (
              <HStack alignItems="center" space={1}>
                <Circle size="4px" bg="primary.400" top="1px" />
                <Text fontSize={10}>{t('status-online')}</Text>
              </HStack>
            ) : null}
          </Box>
          {!props.isPreview ? (
            <IconButton
              borderRadius="full"
              onPress={props.onChatPress}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="chat"
                  size={9}
                  color="secondary.400"
                />
              }
            />
          ) : null}
          {!props.isPreview ? (
            <IconButton
              borderRadius="full"
              onPress={props.onLikePress}
              disabled={props.isLiked}
              icon={
                <Icon
                  as={MaterialCommunityIcons}
                  name={props.isLiked ? 'heart' : 'heart-outline'}
                  size={9}
                  color={props.isLiked ? 'red.400' : 'secondary.400'}
                />
              }
            />
          ) : null}
        </HStack>
        {props.user.about ? (
          <Box mx={5} mb={10}>
            <Text fontWeight={600} pb={1}>
              {t('details-screen.about')}
            </Text>
            <Text fontSize="sm" lineHeight={20}>
              {props.user.about}
            </Text>
          </Box>
        ) : null}
        <VStack mx={5} space={3}>
          {profileFields.map(item => {
            const value = props.user[item] as string;

            if (item === 'is_agent' && value) {
              return (
                <KeyValueLi
                  key={item}
                  label={t(`profile.${item}-label`)!}
                  value={t('yes')!}
                />
              );
            }

            if (value && typeof value === 'boolean') {
              return (
                <KeyValueLi
                  key={item}
                  label={t(`profile.${item}-label`)!}
                  value={t('yes')!}
                />
              );
            }

            if (item === 'marrige' && value) {
              return (
                <KeyValueLi
                  key={item}
                  label={t(`profile.marrige-label`)!}
                  value={
                    t(`profile.marrige-items.${value}-${props.user.gender}`)!
                  }
                />
              );
            }

            if (
              value &&
              !['nation', 'citizenship', 'appearance', 'disability'].includes(
                item,
              )
            ) {
              return (
                <KeyValueLi
                  key={item}
                  label={t(`profile.${item}-label`)!}
                  value={t(`profile.${item}-items.${value}`)!}
                />
              );
            }

            if (value) {
              return (
                <KeyValueLi
                  key={item}
                  label={t(`profile.${item}-label`)!}
                  value={value}
                />
              );
            }
            return null;
          })}
        </VStack>
        <Box pb={7} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default DetailsScreenContent;
