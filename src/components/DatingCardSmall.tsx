import {AspectRatio, Box, Pressable, Text, useTheme} from 'native-base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {User} from '~src/types';
import {agePlurals} from '~src/utils/age-plurals';
import getImagePlaceholder from '~src/utils/get-image-placeholder';
import {getIsOnline} from '~src/utils/utils';
import ProfileTags from './ProfileTags';
import StatusBadge from './StatusBadge';

export interface DatingCardProps {
  user: User;
  dontShowPhotos: boolean;
  isLeveraged?: boolean;
  onDetailsPress: () => void;
}

export interface CircleButtonProps {
  onPress: () => void;
  icon: string;
  iconColor?: string;
}

const borderRadius = 'xl';
const ITEM_HEIGHT = Dimensions.get('window').width * 0.7;

function DatingCard(props: DatingCardProps) {
  const {t} = useTranslation();
  const theme = useTheme();

  const line1 = [
    props.user.name,
    props.user.age ? agePlurals(t, new Date(props.user.age)) : null,
  ]
    .filter(Boolean)
    .join(',\n');
  const line2 = [props.user.city, props.user.country]
    .filter(Boolean)
    .join(', ');

  const isNoPhotos =
    !props.user?.photos?.find(item => item?.uri) || props.dontShowPhotos;
  const photoUri = props.user?.photos?.[0]?.uri;
  const variant = photoUri && !isNoPhotos ? '1' : '2';
  const imagePlaceholder = props.user?.imagePlaceholder;

  const isOnline = getIsOnline(props.user);

  return (
    <Pressable
      flex={1}
      w="100%"
      // hitSlop={ITEM_HEIGHT}
      height={ITEM_HEIGHT}
      onPress={() => {
        props.onDetailsPress();
      }}>
      <Box flex={1} borderRadius={borderRadius}>
        <AspectRatio ratio={0.7}>
          <Box justifyContent="flex-end">
            {photoUri && !isNoPhotos ? (
              <FastImage
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: theme.radii['xl'],
                  backgroundColor: theme.colors.primary[200],
                }}
                source={{
                  uri: photoUri,
                }}
              />
            ) : (
              <FastImage
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: theme.radii['xl'],
                  backgroundColor: theme.colors.primary[200],
                }}
                source={{
                  uri: imagePlaceholder,
                }}
              />
              // <Box
              //   flex={1}
              //   height="100%"
              //   borderRadius={borderRadius}
              //   bg={{
              //     linearGradient: {
              //       colors: ['primary.400', 'secondary.400'],
              //       start: [0, 1],
              //       end: [0, 0],
              //     },
              //   }}
              // />
            )}

            {variant === '1' ? (
              <Box
                justifyContent="flex-end"
                height="100%"
                width="100%"
                position="absolute">
                {/* {props.isLeveraged ? (
                  <Circle
                    bg="white"
                    position="absolute"
                    right={3}
                    top={3}
                    p={1}>
                    <Icon
                      as={MaterialCommunityIcons}
                      name="crown"
                      size={6}
                      color="yellow.400"
                    />
                  </Circle>
                ) : null} */}

                <Box
                  alignItems="flex-start"
                  p={2}
                  width="100%"
                  borderBottomRadius={borderRadius}
                  bg={{
                    linearGradient: {
                      colors: ['black', 'transparent'],
                      start: [0, 1],
                      end: [0, 0],
                    },
                  }}>
                  {line1 ? (
                    <Text fontSize="md" color="white" fontWeight={700}>
                      {line1}
                    </Text>
                  ) : null}
                  {line2 ? (
                    <Text fontSize="sm" color="white" fontWeight={500}>
                      {line2}
                    </Text>
                  ) : null}
                  {isOnline ? (
                    <StatusBadge color="primary.400" textColor="white">
                      {t('status-online')}
                    </StatusBadge>
                  ) : null}
                </Box>
              </Box>
            ) : null}

            {variant === '2' ? (
              <Box
                justifyContent="flex-end"
                height="100%"
                width="100%"
                position="absolute">
                {/* {props.isLeveraged ? (
                  <Circle
                    bg="white"
                    position="absolute"
                    right={3}
                    top={3}
                    p={1}>
                    <Icon
                      as={MaterialCommunityIcons}
                      name="crown"
                      size={6}
                      color="yellow.400"
                    />
                  </Circle>
                ) : null} */}

                <Box position="absolute" top={1} w="100%">
                  <ProfileTags user={props.user} maxItems={9} />
                </Box>
                <Box
                  alignItems="flex-start"
                  p={2}
                  width="100%"
                  borderBottomRadius={borderRadius}
                  bg={{
                    linearGradient: {
                      colors: ['rgba(0,0,0,0.5)', 'transparent'],
                      start: [0, 1],
                      end: [0, 0],
                    },
                  }}>
                  {line1 ? (
                    <Text fontSize="md" color="white" fontWeight={700}>
                      {line1}
                    </Text>
                  ) : null}
                  {line2 ? (
                    <Text fontSize="sm" color="white" fontWeight={500}>
                      {line2}
                    </Text>
                  ) : null}
                  {isOnline ? (
                    <StatusBadge color="primary.400" textColor="white">
                      {t('status-online')}
                    </StatusBadge>
                  ) : null}
                </Box>
              </Box>
            ) : null}
          </Box>
        </AspectRatio>
      </Box>
    </Pressable>
  );
}

export default DatingCard;
