import {Box, Button, Radio, ScrollView, TextArea, VStack} from 'native-base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

export interface ClaimScreenContentProps {
  onSubmit: (variant: string, message?: string) => void;
}

function ClaimScreenContent(props: ClaimScreenContentProps) {
  const {t} = useTranslation();
  const [viewVariant, setViewVariant] = useState<
    'select-claim-variant' | 'claim'
  >('select-claim-variant');
  const [value, setValue] = useState<string | undefined>();
  const [message, setMessage] = useState('');

  if (viewVariant === 'select-claim-variant') {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView px={9} pt={3} flex={1}>
          <VStack space={2}>
            <Button
              onPress={() => {
                props.onSubmit('hide-user');
              }}
              colorScheme="secondary"
              bg="secondary.600">
              {t('chat.claims.hide-user')}
            </Button>
            <Button
              colorScheme="secondary"
              bg="secondary.600"
              onPress={() => {
                setViewVariant('claim');
              }}>
              {t('chat.claims.submit')}
            </Button>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView px={9} pt={3} flex={1}>
        <Radio.Group
          name="claim"
          colorScheme="secondary"
          onChange={newValue => {
            setValue(newValue);
          }}>
          <VStack w="100%" pt={2} pb={4} space={6}>
            <Radio value="scam">{t('chat.claims.scam')!}</Radio>
            <Radio value="abuse">{t('chat.claims.abuse')!}</Radio>
            <Radio value="threat">{t('chat.claims.threat')!}</Radio>
            <Radio value="ads">{t('chat.claims.ads')!}</Radio>
            <Radio value="etc">{t('chat.claims.etc')!}</Radio>
          </VStack>
        </Radio.Group>
        {value === 'etc' ? (
          <Box pb={4} pt={4}>
            <TextArea
              _focus={{
                backgroundColor: 'transparent',
                borderColor: 'none',
              }}
              autoCompleteType=""
              placeholder={t('chat.claims.etc-placeholder')!}
              value={message}
              onChangeText={newMessage => {
                setMessage(newMessage);
              }}
            />
          </Box>
        ) : null}
        <VStack w="100%" space={4} mt={4}>
          <Button
            disabled={!value}
            flex={1}
            colorScheme="secondary"
            bg={!value ? 'gray.300' : 'secondary.600'}
            onPress={() => {
              props.onSubmit(value!, message);
            }}>
            {t('chat.claims.submit')}
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ClaimScreenContent;
