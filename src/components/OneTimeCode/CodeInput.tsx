import {Box, Text} from 'native-base';
import React from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

interface ICodeInputNumber {
  filled: boolean;
  active: boolean;
}

interface ICodeInput {
  value: string;
  length: number;
}

const CodeInputNumber: React.FC<React.PropsWithChildren<ICodeInputNumber>> = ({
  children,
  filled,
  active,
}) => {
  return (
    <Animated.View
      style={{
        borderStyle: 'dashed',
        borderWidth: 3,
        borderRadius: 15,
        padding: '23px',
        margin: '5px',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#979797',
      }}
      entering={filled ? ZoomIn : FadeIn}
      exiting={filled ? ZoomOut : FadeOut}>
      <Text
        fontSize="3xl"
        fontWeight="black"
        color={(filled && '') || (active && '') || '#979797'}>
        {children}
      </Text>
    </Animated.View>
  );
};

const CodeInput: React.FC<ICodeInput> = ({value, length}) => {
  const oneTimeCode = value.padEnd(length, '0');

  return (
    <Box>
      {oneTimeCode.split('').map((character, index) => (
        <CodeInputNumber
          key={index}
          filled={index < value.length}
          active={index === value.length}>
          {character}
        </CodeInputNumber>
      ))}
    </Box>
  );
};

export default CodeInput;
