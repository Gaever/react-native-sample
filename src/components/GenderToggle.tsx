import {Box, Circle, HStack, Text, VStack} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableWithoutFeedback} from 'react-native';
import {gender} from '~src/types';

export interface GenderToggleProps {
  value: gender | undefined;
  onChange: (value: gender) => void;
}

function GenderToggle(props: GenderToggleProps) {
  const {t} = useTranslation();

  return (
    <VStack alignItems="center">
      <HStack justifyContent="space-evenly" w="85%">
        <VStack alignItems="center" space={2}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.onChange('m');
            }}>
            <Circle {...(props.value === 'm' ? {} : null)}>
              <Circle
                size={20}
                bg={{
                  linearGradient: {
                    colors: ['blue.200', 'blue.500'],
                    start: [0, 1],
                    end: [0, 0],
                  },
                }}>
                <Text fontWeight={500} fontSize={45} color="gray.800">
                  {t('gender-toggle.m')}
                </Text>
              </Circle>
            </Circle>
          </TouchableWithoutFeedback>
          {props.value === 'm' ? (
            <Circle size={3} bg="blue.200"></Circle>
          ) : null}
          {props.value === undefined ? (
            <Circle size={3} bg="transparent"></Circle>
          ) : null}
        </VStack>
        <VStack alignItems="center" space={2}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.onChange('f');
            }}>
            <Circle {...(props.value === 'f' ? {} : null)}>
              <Circle
                size={20}
                bg={{
                  linearGradient: {
                    colors: ['red.200', 'pink.500'],
                    start: [0, 1],
                    end: [0, 0],
                  },
                }}
                {...(props.value === 'f' ? {} : null)}>
                <Text fontWeight={500} fontSize={45} color="white">
                  {t('gender-toggle.f')}
                </Text>
              </Circle>
            </Circle>
          </TouchableWithoutFeedback>
          {props.value === 'f' ? <Circle size={3} bg="red.200"></Circle> : null}
        </VStack>
      </HStack>
    </VStack>
  );
}

export default GenderToggle;
