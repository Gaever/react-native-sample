import {Box, Image, useTheme} from 'native-base';
import React from 'react';
import {User} from '~src/types';
import Swiper from './ui/Swiper';
import FastImage from 'react-native-fast-image';

export interface PhotoSwiperProps {
  user: User;
  borderBottomRadius?: number | string;
  borderTopRadius?: number | string;
  fadeBottom?: boolean;
  blurPhotos?: boolean;
}

function PhotoSwiper(props: PhotoSwiperProps) {
  const theme = useTheme();
  return (
    <Swiper>
      {(props.user.photos || [])
        .filter(item => item.uri)
        .map(item => (
          <Box
            flex={1}
            key={`${props.user.profileId}-${item.uri}`}
            justifyContent="flex-start"
            // flex={1}
            overflow="hidden"
            borderBottomRadius={props.borderBottomRadius ?? 0}
            borderTopRadius={props.borderTopRadius ?? '2xl'}>
            <FastImage
              {...(props.blurPhotos ? {blurRadius: 30} : null)}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: theme.colors.primary[200],
              }}
              source={{
                uri: item.uri!,
              }}
            />
            {props.fadeBottom ? (
              <Box
                position="absolute"
                width="100%"
                h="100px"
                borderBottomRadius={props.borderBottomRadius ?? 0}
                bg={{
                  linearGradient: {
                    colors: ['black', 'transparent'],
                    start: [0, 1],
                    end: [0, 0],
                  },
                }}
                bottom={0}
              />
            ) : null}
          </Box>
        ))}
    </Swiper>
  );
}

export default PhotoSwiper;
