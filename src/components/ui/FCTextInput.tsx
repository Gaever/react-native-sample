import {Box, FormControl, ITextFieldProps, Text, TextField} from 'native-base';
import React from 'react';
import {Control, useController, UseControllerProps} from 'react-hook-form';
import FormControlLabel from './FormControlLabel';

interface FCTextInputProps {
  name: string;
  control: Control;
  placeholder?: string;
  label?: string;
  error?: string;
  rules?: UseControllerProps['rules'];
  initialValue?: string | undefined;
  TextFieldProps?: ITextFieldProps;
}

function FCTextInput(props: FCTextInputProps) {
  const {field} = useController({
    name: props.name,
    control: props.control,
    rules: props.rules,
  });
  const isInvalid = props.error !== undefined;

  return (
    <FormControl isInvalid={isInvalid}>
      <FormControlLabel>
        {props.label}
        {props.rules?.required ? <Text color="red.400"> *</Text> : null}
      </FormControlLabel>

      <Box height="31px" mt={1}>
        {/* @ts-ignore */}
        <TextField
          textTransform="none"
          defaultValue={props.initialValue}
          width="100%"
          // @ts-ignore
          autoCapitalize="none"
          position="absolute"
          placeholder={props.placeholder || props.label}
          onChangeText={text => {
            field.onChange(text);
          }}
          onBlur={() => {
            field.onBlur();
          }}
          {...(isInvalid ? {borderBottomColor: 'red.400'} : null)}
          {...props.TextFieldProps}
        />
      </Box>
      <FormControl.ErrorMessage>{props.error}</FormControl.ErrorMessage>
    </FormControl>
  );
}

export default FCTextInput;
