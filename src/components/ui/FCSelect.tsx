import {Box, FormControl, Icon, Text, useTheme} from 'native-base';
import React from 'react';
import {Control, useController, UseControllerProps} from 'react-hook-form';
import {Platform} from 'react-native';
import RNPickerSelect, {PickerSelectProps} from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Font} from '~src/theme';
import FormControlLabel from './FormControlLabel';

export interface FCSelectProps {
  PickerSelectProps: Partial<PickerSelectProps>;
  name: string;
  control: Control;
  placeholder?: string;
  label?: string;
  error?: string;
  rules?: UseControllerProps['rules'];
}

function FCSelect(props: FCSelectProps) {
  const {field} = useController({
    name: props.name,
    control: props.control,
    rules: props.rules,
  });
  const theme = useTheme();
  const isInvalid = props.error !== undefined;

  return (
    <FormControl isInvalid={isInvalid}>
      <FormControlLabel>
        {props.label}
        {props.rules?.required ? <Text color="red.400"> *</Text> : null}
      </FormControlLabel>
      <Box pt={Platform.select({ios: 3, android: 0})}>
        <RNPickerSelect
          items={props.PickerSelectProps.items || []}
          {...props.PickerSelectProps}
          // @ts-expect-error
          Icon={() => (
            <Icon
              as={MaterialCommunityIcons}
              name="chevron-down"
              size={5}
              alignSelf="center"
              color="gray.400"
            />
          )}
          useNativeAndroidPickerStyle={false}
          value={field.value || 0}
          placeholder={{
            label: props.placeholder || props.label,
            value: 0,
          }}
          onValueChange={(value, index) => {
            field.onChange(value);
            field.onBlur();
          }}
          style={{
            iconContainer: Platform.select({
              android: {
                top: 15,
              },
            }),
            inputIOS: {
              fontFamily: Font.InterMedium,
              borderBottomColor: isInvalid
                ? theme.colors.red[400]
                : theme.colors.gray[300],
              borderBottomWidth: 1,
              paddingBottom: theme.space[2],
              fontSize: theme.fontSizes.md,
            },
            inputAndroid: {
              color: theme.colors.gray[700],
              fontFamily: Font.InterMedium,
              borderBottomColor: isInvalid
                ? theme.colors.red[400]
                : theme.colors.gray[300],
              borderBottomWidth: 1,
              paddingBottom: 0,
              paddingLeft: 0,
              marginLeft: 0,
              fontSize: theme.fontSizes.md,
            },
            placeholder: {
              fontFamily: Font.InterMedium,
              color: theme.colors.gray[300],
              fontSize: theme.fontSizes.md,
            },
          }}
        />
      </Box>
      <FormControl.ErrorMessage>{props.error}</FormControl.ErrorMessage>
    </FormControl>
  );
}

export default FCSelect;
