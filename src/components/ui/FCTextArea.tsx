import {
  Box,
  FormControl,
  ITextAreaProps,
  Text,
  TextArea,
  TextField,
} from 'native-base';
import React from 'react';
import {Control, useController, UseControllerProps} from 'react-hook-form';
import FormControlLabel from './FormControlLabel';

interface FCTextAreaProps {
  name: string;
  control: Control;
  placeholder?: string;
  label?: string;
  error?: string;
  rules?: UseControllerProps['rules'];
  initialValue?: string;
  TextAreaProps?: ITextAreaProps;
}

function FCTextArea(props: FCTextAreaProps) {
  const {field} = useController({
    name: props.name,
    control: props.control,
    rules: props.rules,
  });
  const isInvalid = props.error !== undefined;

  return (
    <FormControl isInvalid={isInvalid}>
      {props.label ? (
        <Box pb={2}>
          <FormControlLabel>
            {props.label}
            {props.rules?.required ? <Text color="red.400"> *</Text> : null}
          </FormControlLabel>
        </Box>
      ) : null}

      <TextArea
        onChangeText={text => {
          field.onChange(text);
          field.onBlur();
        }}
        h={20}
        fontSize="md"
        defaultValue={props.initialValue}
        placeholder={props.placeholder || props.label}
        autoCompleteType=""
        _focus={{
          backgroundColor: 'transparent',
          borderColor: 'none',
        }}
        {...(isInvalid ? {borderColor: 'red.400'} : null)}
        {...props.TextAreaProps}
      />
      <FormControl.ErrorMessage>{props.error}</FormControl.ErrorMessage>
    </FormControl>
  );
}

export default FCTextArea;
