import {Checkbox, FormControl, Text} from 'native-base';
import React from 'react';
import {Control, useController, UseControllerProps} from 'react-hook-form';

interface FCTextAreaProps {
  name: string;
  control: Control;
  label?: string;
  fontSize?: string | number;
  error?: string;
  rules?: UseControllerProps['rules'];
  widthAuth?: boolean;
}

function FCCheckbox(props: FCTextAreaProps) {
  const {field} = useController({
    name: props.name,
    control: props.control,
    rules: props.rules,
  });

  return (
    <FormControl
      isInvalid={!!props.error}
      {...(props.widthAuth ? {w: 'auto'} : null)}>
      <Checkbox
        isChecked={!!field.value}
        value=""
        onChange={isChecked => {
          field.onChange(isChecked);
          field.onBlur();
        }}>
        {props.fontSize ? (
          <Text fontSize={props.fontSize}>{props.label}</Text>
        ) : (
          props.label
        )}
        {props.rules?.required ? <Text color="red.400"> *</Text> : null}
      </Checkbox>
      <FormControl.ErrorMessage>{props.error}</FormControl.ErrorMessage>
    </FormControl>
  );
}

export default FCCheckbox;
