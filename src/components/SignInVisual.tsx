// import {useTheme} from '@rneui/themed';
import {Box, Image} from 'native-base';

import React from 'react';
import VisualBase64 from '~src/assets/signup-visual-base64';
import stylesheet from '../styles';

export interface SignInVisualProps {
  topFlex?: number;
}

function SignInVisual(props: SignInVisualProps) {
  return (
    <Box style={stylesheet.container}>
      <Box
        flex={1}
        position="absolute"
        width="100%"
        zIndex={10}
        top={0}
        left={0}
        height={130}
        opacity={0.5}
        bg={{
          linearGradient: {
            colors: ['transparent', 'blue.500'],
            start: [0, 1],
            end: [0, 0],
          },
        }}
      />
      <Image
        width={'100%'}
        height={'100%'}
        alt=""
        source={{uri: VisualBase64}}
      />
      {/* <View
        style={{
          flex: props.topFlex ?? 2,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.primary[400],
          }}></View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.secondary[400],
          }}></View>
      </View> */}
      {/* <View
        style={{
          flex: 7,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.primary[300],
          }}></View>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.secondary[300],
          }}></View>
      </View> */}
    </Box>
  );
}

export default SignInVisual;
