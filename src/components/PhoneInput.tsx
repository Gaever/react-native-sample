import {Box, Spinner, Text, useTheme, View} from 'native-base';
import React, {useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import RNPhoneInput from 'react-native-phone-input';
import {Font} from '~src/theme';

export interface PhoneInputProps {
  onChange: (phone: string) => void;
  isLoading?: boolean;
  error?: string;
}

function PhoneInput(props: PhoneInputProps) {
  const phoneInputRef = useRef<RNPhoneInput | undefined>(undefined);
  const {t} = useTranslation();
  const theme = useTheme();

  const onPressFlag = useCallback(() => {}, []);

  return (
    <View>
      <RNPhoneInput
        onPressFlag={onPressFlag}
        renderFlag={
          props.isLoading
            ? () => (
                <Box w="30px">
                  <Spinner size="sm" color="gray.600" />
                </Box>
              )
            : undefined
        }
        // @ts-expect-error
        ref={phoneInputRef}
        disabled={props.isLoading}
        initialCountry={'ru'}
        onChangePhoneNumber={props.onChange}
        textProps={{
          placeholder: t('sign-in-modal.welcome-screen.enter-phone'),
        }}
        autoFormat
        textStyle={{
          fontFamily: Font.InterSemiBold,
          fontSize: theme.fontSizes['lg'],
          color: props.isLoading ? theme.colors.gray[400] : theme.colors.black,
          ...Platform.select({
            ios: null,
            android: {
              height: 50,
              padding: 0,
              margin: 0,
            },
          }),
        }}
        style={{
          height: 65,
          width: '100%',
          borderWidth: 1,
          borderColor: theme.colors.gray[300],
          padding: theme.space[5],
          borderRadius: theme.radii.lg,
        }}
      />

      {props.error ? (
        <Text color="error.500" fontSize="sm" ml={5}>
          {props.error}
        </Text>
      ) : null}
    </View>
  );
}

export default PhoneInput;
