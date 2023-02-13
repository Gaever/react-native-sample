import {observer} from 'mobx-react-lite';
import {
  Box,
  Button,
  Circle,
  HStack,
  Icon,
  IconButton,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {User} from '~src/types';
import {agePlurals} from '~src/utils/age-plurals';
import getImagePlaceholder from '~src/utils/get-image-placeholder';
import localTime from '~src/utils/local-time';
import {FeedStoreContext} from '~store/app-state';
import PhotoSwiper from './PhotoSwiper';
import ProfileTags from './ProfileTags';
import StatusBadge from './StatusBadge';

export interface DatingCardProps {
  user: User;
  showTags?: boolean;
  isLeveraged?: boolean;
  onLikePress?: () => void;
  onRejectPress?: () => void;
  onChatPress?: () => void;
  onDetailsPress: () => void;
  dontShowPhotos: boolean;
}

export interface CircleButtonProps {
  onPress: () => void;
  icon: string;
  iconColor?: string;
  disabledIconColor?: string;
  disabled?: boolean;
}

function CircleButton(props: CircleButtonProps) {
  return (
    <Circle shadow={props.disabled ? 'none' : 1}>
      <IconButton
        borderRadius="full"
        onPress={props.onPress}
        bg={props.disabled ? 'transparent' : 'white'}
        size={12}
        disabled={props.disabled}
        icon={
          <Icon
            as={MaterialCommunityIcons}
            name={props.icon}
            color={
              (props.disabled && props.disabledIconColor) ||
              props.iconColor ||
              'gray.600'
            }
            size={props.disabled ? 6 : 5}
          />
        }
      />
    </Circle>
  );
}
const ITEM_HEIGHT = Dimensions.get('window').width * 1.25;

const DatingCard = observer((props: DatingCardProps) => {
  const {t} = useTranslation();
  const {likedUserIds, addLikedUserId} = useContext(FeedStoreContext);
  const isLiked = !!likedUserIds?.[props.user?.profileId];

  const isNoPhotos =
    !props.user?.photos?.find(item => item?.uri) || props.dontShowPhotos;

  const line1 = [
    props.user.name,
    props.user.age ? agePlurals(t, new Date(props.user.age), false) : null,
  ]
    .filter(Boolean)
    .join(', ');
  const line2 = [props.user.city, props.user.country]
    .filter(Boolean)
    .join(', ');
  const [isOnline] = useState(
    props.user.last_seen &&
      localTime(props.user.last_seen).isAfter(
        localTime().subtract(3, 'minutes'),
      ),
  );
  const theme = useTheme();
  const imagePlaceholder = props.user?.imagePlaceholder;

  return (
    <Box
      flex={1}
      borderRadius="2xl"
      bg="gray.100"
      // {...(props.isLeveraged
      //   ? {borderWidth: 3, borderColor: 'secondary.400'}
      //   : null)}
    >
      <Box flex={1} height={ITEM_HEIGHT}>
        {isNoPhotos ? (
          <Box
            flex={1}
            height="100%"
            borderTopRadius="2xl"
            bg={{
              linearGradient: {
                colors: ['primary.300', 'secondary.300'],
                start: [0, 1],
                end: [0, 0],
              },
            }}>
            <FastImage
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: theme.radii['xl'],
                // backgroundColor: theme.colors.primary[200],
                backgroundColor: 'transparent',
                alignSelf: 'flex-end',
              }}
              resizeMode="contain"
              source={{
                uri: imagePlaceholder,
              }}
            />
          </Box>
        ) : (
          <PhotoSwiper user={props.user} fadeBottom />
        )}
        <Box position="absolute" bottom={0} w="100%">
          <VStack flex={1} m={5}>
            {isNoPhotos ? (
              <Box left={-8} top={3}>
                <ProfileTags user={props.user} />
              </Box>
            ) : null}
            <HStack flex={1} w="100%">
              <Box flex={1} justifyContent="center">
                {line1 ? (
                  <Text fontWeight={700} color="white" fontSize="md">
                    {line1}
                  </Text>
                ) : null}

                {line2 ? (
                  <Text fontWeight={500} color="white" fontSize="sm">
                    {line2}
                  </Text>
                ) : null}

                {isOnline ? (
                  <StatusBadge color="primary.400" textColor="white">
                    {t('status-online')}
                  </StatusBadge>
                ) : null}
              </Box>
              <Box alignItems="flex-end" justifyContent="flex-end">
                <Button
                  variant="ghost"
                  colorScheme="white"
                  onPress={props.onDetailsPress}
                  leftIcon={
                    <Icon
                      as={MaterialCommunityIcons}
                      name="information-outline"
                      color="white"
                    />
                  }>
                  {t('dating-card.about')}
                </Button>
              </Box>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* <Box m={3}>
        {!isNoPhotos ? (
          <Box left={-8} height="50px" overflow="hidden">
            <ProfileTags
              colorSchema="gray.400"
              color="white"
              user={props.user}
              fontWeight={600}
            />
          </Box>
        ) : null}

        <Text fontSize={11} lineHeight={20}>
          {props.user.about}
        </Text>
      </Box> */}
      <Box m={5}>
        <HStack w="100%" space={3} justifyContent="flex-end">
          {/* {!isNoPhotos ? (
            <Box
              left={-8}
              height="80px"
              position="absolute"
              width="240px"
              flex={1}
              overflow="hidden"
              flexWrap="nowrap"
              bg="red.100">
              <ProfileTags
                colorSchema="gray.400"
                color="white"
                user={props.user}
                fontWeight={600}
              />
            </Box>
          ) : null} */}
          {props.onRejectPress ? (
            <CircleButton
              onPress={props.onRejectPress}
              icon="close-thick"
              iconColor="secondary.700"
            />
          ) : null}
          {props.onChatPress ? (
            <CircleButton
              onPress={props.onChatPress}
              icon="chat"
              iconColor="secondary.700"
            />
          ) : null}
          {props.onLikePress ? (
            <CircleButton
              onPress={() => {
                if (props?.user?.profileId) {
                  addLikedUserId(props.user.profileId);
                }
                props.onLikePress?.();
              }}
              disabledIconColor="red.400"
              disabled={isLiked}
              icon="heart"
              iconColor="primary.400"
            />
          ) : null}
        </HStack>
      </Box>
    </Box>
  );
});
export default React.memo(DatingCard);
