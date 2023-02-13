import {Box} from 'native-base';
import React from 'react';
import RNSwiper from 'react-native-swiper';

export interface SwiperProps extends React.PropsWithChildren {}

function Swiper(props: SwiperProps) {
  return (
    <RNSwiper
      // showsButtons
      loop={false}
      paginationStyle={{
        top: 5,
        alignItems: 'flex-start',
      }}
      dot={
        <Box
          flex={1}
          h="2px"
          bg="gray.700"
          opacity={0.3}
          mx={2}
          borderRadius="lg"
        />
      }
      activeDot={
        <Box
          flex={1}
          h="2px"
          bg="white"
          opacity={0.85}
          mx={2}
          borderRadius="lg"
        />
      }
      // nextButton={<Box h="100%" w={200} bg="transparent" />}
      // prevButton={<Box h="100%" w={120} bg="transparent" />}
    >
      {props.children}
    </RNSwiper>
  );
}

export default Swiper;
