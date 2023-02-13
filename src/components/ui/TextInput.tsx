import {Box, TextField} from 'native-base';
import React from 'react';
import {Control, useController} from 'react-hook-form';

interface TextInputProps {
  name: string;
  control: Control;
  placeholder?: string;
  // TextFieldProps: ITextFieldProps;
}

function TextInput(props: TextInputProps) {
  const {field} = useController({
    name: props.name,
    control: props.control,
  });

  return (
    <Box height={'31px'}>
      {/* @ts-ignore */}
      <TextField
        width="100%"
        position="absolute"
        placeholder={props.placeholder}
        value={field.value as string}
        onChangeText={text => {
          field.onChange(text);
        }}
      />
    </Box>
  );
}

export default TextInput;
