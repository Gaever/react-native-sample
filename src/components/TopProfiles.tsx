import {
  AspectRatio,
  Box,
  FlatList,
  Icon,
  Image,
  Pressable,
  Spinner,
  Text,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatListProps, ListRenderItem} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {User} from '~src/types';
import {agePlurals} from '../utils/age-plurals';
export interface TopProfilesProps
  extends Pick<
    FlatListProps<User[]>,
    'onEndReached' | 'onEndReachedThreshold'
  > {
  users: User[];
  onPress: (user: User, index: number) => void;
  dontShowPhotos: boolean;
  isMoreLoading: boolean;
  isEndReached: boolean;
  onAddPress: () => void;
}

interface TopProfileItemProps {
  dontShowPhotos: boolean;
  user: User;
}

function TopProfileItem(props: TopProfileItemProps) {
  const {t} = useTranslation();
  const isNoPhotos = props.dontShowPhotos;
  const photoUri = props.user.photos?.[0]?.uri;
  const variant = !photoUri || !isNoPhotos ? '1' : '2';

  return (
    <AspectRatio
      flex={1}
      ratio={6 / 7}
      bg="primary.200"
      borderRadius="md"
      mr={2}
      m={0.5}>
      <Box justifyContent="flex-end">
        {photoUri && !isNoPhotos ? (
          <Image
            position="absolute"
            {...(props.dontShowPhotos ? {blurRadius: 30} : null)}
            alt="alt"
            borderRadius="md"
            height="100%"
            width="100%"
            source={{
              uri: photoUri,
            }}
          />
        ) : null}
        <Box
          position="absolute"
          bottom={0}
          height="75%"
          width="100%"
          borderRadius="md"
          {...(variant === '1'
            ? null
            : {
                bg: {
                  linearGradient: {
                    colors: ['black', 'transparent'],
                    start: [0, 1],
                    end: [0, 0],
                  },
                },
              })}
        />
        <Box p={1} alignItems="center" justifyContent="center">
          <Text
            textAlign="center"
            fontSize="xs"
            {...(variant === '1' ? null : {color: 'white'})}
            fontWeight={700}>
            {props.user.name}
          </Text>
          <Text
            textAlign="center"
            fontSize="xs"
            {...(variant === '1' ? null : {color: 'white'})}
            fontWeight={700}>
            {props.user.age ? agePlurals(t, new Date(props.user.age)) : null}
          </Text>
          <Text
            textAlign="center"
            fontSize="xs"
            {...(variant === '1' ? null : {color: 'white'})}
            fontWeight={700}>
            {props.user.city}
          </Text>
        </Box>
      </Box>
    </AspectRatio>
  );
}

const ITEM_HEIGHT = 110;

const renderItem: (props: TopProfilesProps) => ListRenderItem<User> =
  props =>
  ({item, index}) =>
    (
      <Pressable
        {...(index === 0 ? {pl: 2} : null)}
        flex={1}
        onPress={() => {
          props.onPress(item, index);
        }}>
        <TopProfileItem user={item} dontShowPhotos={!!props.dontShowPhotos} />
      </Pressable>
    );

const renderListFooterConponent = (props: TopProfilesProps) => {
  if (props.isMoreLoading) {
    // Подгружаются профили
    return (
      <Box alignItems="center" justifyContent="center" h={ITEM_HEIGHT} w={50}>
        <Spinner size="lg" color="gray.400" />
      </Box>
    );
  }

  return null;
};

function renderListHeaderComponent(props: TopProfilesProps) {
  const {t} = useTranslation();

  return (
    <AspectRatio
      flex={1}
      ratio={6 / 7}
      bg="primary.200"
      borderRadius="md"
      m={0.5}
      mr={2}
      ml={2}>
      <Pressable onPress={props.onAddPress} flex={1}>
        <Box justifyContent="center" alignItems="center" flex={1}>
          <Icon
            as={MaterialCommunityIcons}
            name="plus-thick"
            color="primary.400"
            size={30}
          />
          <Text fontWeight={700}>{t('top-profiles-add')}</Text>
        </Box>
      </Pressable>
    </AspectRatio>
  );
}

function TopProfiles(props: TopProfilesProps) {
  const {t} = useTranslation();

  return (
    <Box>
      <Text fontSize="sm" pb={1} pl={2}>
        {t('top-profiles')}
      </Text>
      <FlatList
        height={ITEM_HEIGHT}
        w="100%"
        horizontal
        data={props.users}
        keyExtractor={({profileId: id}) => `top-${id}`}
        renderItem={renderItem(props)}
        showsHorizontalScrollIndicator={false}
        onEndReached={props.onEndReached}
        onEndReachedThreshold={props.onEndReachedThreshold}
        ListFooterComponent={renderListFooterConponent(props)}
        ListHeaderComponent={renderListHeaderComponent(props)}
      />
    </Box>
  );
}

export default TopProfiles;
