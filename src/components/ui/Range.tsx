import {Box, Circle, Text, useTheme} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
// import RangeSlider, {SliderProps} from 'rn-range-slider';
import {useDebouncedCallback} from 'use-debounce';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

export interface FilterModalContentProps {
  max: number;
  min: number;
  low: number;
  high: number;
  step: number;
  floatingLabel: boolean;
  onValueChanged: (low: number, high: number) => void;
  onSlideStart?: () => void;
  onSlideEnd?: () => void;
}
// extends Omit<
//   SliderProps,
//   | 'renderRail'
//   | 'renderRailSelected'
//   | 'renderThumb'
//   | 'renderLabel'
//   | 'renderNotch'
// > {}

function Range(props: FilterModalContentProps) {
  const theme = useTheme();
  const renderThumb = useCallback(
    () => <Circle size={5} bg="primary.400" shadow={2} />,
    [],
  );
  const renderRail = useCallback(
    () => <Box h="2px" bg="primary.200" flex={1} borderRadius="xs" />,
    [],
  );
  const renderRailSelected = useCallback(
    () => <Box h="4px" bg="primary.400" flex={1} />,
    [],
  );
  const renderLabel = useCallback(
    (value: number) => (
      <Box
        w="20px"
        h="20px"
        bg="primary.400"
        borderRadius="sm"
        alignItems="center"
        bottom={1}
        justifyContent="center">
        <Text textAlign="center" color="white" fontSize="xs">
          {value}
        </Text>
      </Box>
    ),
    [],
  );
  const renderNotch = useCallback(() => null, []);
  const [isSliding, setIsSliding] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [multiSliderValue, setMultiSliderValue] = useState<[number, number]>([
    props.low,
    props.high,
  ]);
  const debouncedOnChangeText = useDebouncedCallback(
    (values: [number, number]) => {
      props.onValueChanged(values[0], values[1]);
    },
    500,
  );

  const multiSliderValuesChange = (values: [number, number]) => {
    setMultiSliderValue(values);
    debouncedOnChangeText(values);
  };

  return (
    <Box
      onLayout={event => {
        const {x, y, width, height} = event.nativeEvent.layout;
        setContainerWidth(width);
      }}>
      <MultiSlider
        sliderLength={containerWidth}
        enabledTwo
        enabledOne
        isMarkersSeparated
        allowOverlap={false}
        snapped
        min={props.min}
        max={props.max}
        step={props.step}
        markerStyle={{
          backgroundColor: theme.colors.primary['400'],
          // borderColor: theme.colors.primary['400'],
          borderWidth: 0,
          elevation: 0,
          shadowColor: 'transparent',
          width: 25,
          height: 25,
        }}
        customLabel={props => (
          <Box position="absolute">
            {props.oneMarkerPressed ? (
              <Box
                w="40px"
                h="30px"
                borderRadius="sm"
                alignItems="center"
                justifyContent="center"
                bg="gray.200"
                left={`${props.oneMarkerLeftPosition - 20}px`}
                top={'-25px'}>
                <Text fontSize="md">{props.oneMarkerValue}</Text>
              </Box>
            ) : null}
            {props.twoMarkerPressed ? (
              <Box
                w="40px"
                h="30px"
                borderRadius="sm"
                alignItems="center"
                justifyContent="center"
                bg="gray.200"
                pr={1}
                left={`${props.twoMarkerLeftPosition - 20}px`}
                top={'-25px'}>
                <Text fontSize="md"> {props.twoMarkerValue}</Text>
              </Box>
            ) : null}
          </Box>
        )}
        selectedStyle={{
          backgroundColor: theme.colors.primary['400'],
          height: 3,
        }}
        unselectedStyle={{
          backgroundColor: theme.colors.primary['200'],
          height: 3,
        }}
        // trackStyle={{
        //   color
        // }}
        onValuesChangeStart={() => {
          setIsSliding(true);
          props.onSlideStart?.();
        }}
        onValuesChangeFinish={() => {
          setIsSliding(false);
          props.onSlideEnd?.();
        }}
        values={[multiSliderValue[0], multiSliderValue[1]]}
        onValuesChange={values => {
          multiSliderValuesChange([values[0], values[1]]);
        }}
        enableLabel={isSliding}
      />
    </Box>
  );

  // return (
  //   <RangeSlider
  //     max={props.max}
  //     min={props.min}
  //     low={props.low}
  //     high={props.high}
  //     step={props.step}
  //     renderRail={renderRail}
  //     renderRailSelected={renderRailSelected}
  //     renderThumb={renderThumb}
  //     renderLabel={renderLabel}
  //     renderNotch={renderNotch}
  //     floatingLabel
  //     onValueChanged={props.onValueChanged}
  //   />
  // );
}

export default Range;
