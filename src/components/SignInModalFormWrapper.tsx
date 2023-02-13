import {Box, KeyboardAvoidingView, useTheme} from 'native-base';
import React from 'react';
import {Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import stylesheet from '../styles';
import SignInModalFooter, {SignInModalFooterProps} from './SignInModalFooter';

export interface SignInModalFormWrapperProps extends React.PropsWithChildren {
  SignInModalFooterProps?: SignInModalFooterProps;
  pt?: number;
  keyboardVerticalOffset?: {ios: number; android: number};
}

function SignInModalFormWrapper(props: SignInModalFormWrapperProps) {
  const showFooter = !!props.SignInModalFooterProps;
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        stylesheet.modalContainer,
        showFooter ? {backgroundColor: theme.colors.gray[100]} : null,
      ]}>
      <KeyboardAvoidingView
        flex={1}
        keyboardVerticalOffset={Platform.select(
          props.keyboardVerticalOffset
            ? props.keyboardVerticalOffset
            : {
                ios: 110,
                android: 0,
              },
        )}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Box flex={1} bg="white" pt={props.pt ?? 5}>
          {props.children}
        </Box>
        {showFooter && props.SignInModalFooterProps ? (
          <SignInModalFooter p={5} {...props.SignInModalFooterProps} />
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default SignInModalFormWrapper;
