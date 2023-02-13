import {Box, Button, Text, TextField, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

export interface PromocodeProps {
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  error?: string;
  disabled?: boolean;
  showSubmit?: boolean;
  isHighlighted?: boolean;
}

function Promocode(props: PromocodeProps) {
  const [value, setValue] = useState(props.value || '');
  const {t} = useTranslation();

  useEffect(() => {
    setValue(props.value || '');
  }, [props.value]);

  return (
    <VStack space={4}>
      <Box>
        <Box mt={2}>
          {/* @ts-ignore */}
          <TextField
            isDisabled={props.disabled}
            placeholder={t('premium-screen.promocode')!}
            value={value}
            h="60px"
            _text={{
              fontSize: 'lg',
            }}
            _input={{
              m: 3,
              mx: 4,
            }}
            fontSize="lg"
            pr="10px"
            pl="10px"
            m={4}
            placeholderTextColor="gray.400"
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onChangeText={text => {
              if (props.onChange) {
                props.onChange(text);
              } else {
                setValue(text);
              }
            }}
            borderRadius="lg"
            borderWidth={1}
            borderBottomColor="gray.400"
            borderTopColor="gray.400"
            borderLeftColor="gray.400"
            borderRightColor="gray.400"
            {...(props.isHighlighted
              ? {
                  borderBottomColor: 'secondary.400',
                  borderTopColor: 'secondary.400',
                  borderLeftColor: 'secondary.400',
                  borderRightColor: 'secondary.400',
                  borderWidth: 3,
                  borderBottomWidth: 3,
                  _input: {
                    backgroundColor: 'black',
                    fontWeight: 700,
                    px: 3,
                    py: 4,
                    color: 'white',
                  },
                }
              : null)}
          />
        </Box>
        {props.error ? (
          <Text color="red.400" fontWeight={600} fontSize="md" m={2}>
            {props.error}
          </Text>
        ) : null}
      </Box>
      {props.showSubmit ?? true ? (
        <Button
          disabled={props.disabled}
          variant="outline"
          onPress={() => {
            props.onSubmit?.(value);
          }}>
          {t('premium-screen.activate-promocode')}
        </Button>
      ) : null}
    </VStack>
  );
}

export default Promocode;
