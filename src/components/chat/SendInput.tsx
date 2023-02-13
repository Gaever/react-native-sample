import {Box, HStack, Pressable, Text, useTheme} from 'native-base';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native';
import {Font} from '~src/theme';

export interface SendInputProps {
  onSubmit: (value: string) => void;
  isDisabled?: boolean;
}

function SendInput(props: SendInputProps) {
  const {t} = useTranslation();

  const [message, setMessage] = useState('');
  const theme = useTheme();
  const disabled = props.isDisabled || !message?.trim();

  const onSubmit = useCallback(() => {
    const m = message?.trim?.();
    if (!m) return;

    props.onSubmit(m);
    setMessage('');
  }, [message]);

  return (
    <HStack
      w="100%"
      space={2}
      p={2}
      borderTopWidth={1}
      borderTopColor="gray.200"
      flexDir="row"
      alignItems="center"
      bg="gray.100"
      justifyContent="space-between">
      <Box flex={1}>
        <TextInput
          multiline
          maxLength={180}
          placeholderTextColor={theme.colors.gray[300]}
          style={{
            color: theme.colors.black,
            fontFamily: Font.InterMedium,
            fontSize: theme.fontSizes.sm,
            backgroundColor: 'white',
            borderRadius: theme.radii['xl'],
            paddingLeft: theme.space[2],
            paddingRight: theme.space[2],
            paddingTop: 7,
            paddingBottom: 7,
          }}
          value={message}
          onChangeText={setMessage}
          autoCapitalize="none"
          enablesReturnKeyAutomatically
          blurOnSubmit={false}
          placeholder={t('chat.send-message-placeholder')!}
        />
      </Box>
      <Box alignItems="center" justifyContent="center">
        <Pressable onPress={onSubmit} disabled={disabled}>
          <Text
            textAlign="center"
            fontWeight={600}
            color={disabled ? 'gray.300' : 'primary.400'}>
            {t('chat.send')}
          </Text>
        </Pressable>
      </Box>
    </HStack>
  );
}

export default SendInput;
