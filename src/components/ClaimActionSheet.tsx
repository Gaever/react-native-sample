import {
  Actionsheet,
  Box,
  Button,
  HStack,
  KeyboardAvoidingView,
  VStack,
} from 'native-base';
import React, {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import FCCheckbox from './ui/FCCheckbox';
import FCTextArea from './ui/FCTextArea';

export interface ClaimFormData {
  scam: boolean;
  abuse: boolean;
  threat: boolean;
  etc: boolean;
  etc_text?: string;
}

export interface ClaimActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ClaimFormData) => void;
}

function ClaimActionSheet(props: ClaimActionSheetProps) {
  const {t} = useTranslation();
  const {control, handleSubmit, reset} = useForm<ClaimFormData>({
    defaultValues: {
      scam: false,
      abuse: false,
      threat: false,
      etc: false,
    },
  });

  const onClose = useCallback(() => {
    reset();
    props.onClose();
  }, [reset, props.onClose]);

  return (
    <Actionsheet isOpen={props.isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <VStack w="100%" p={4} pb={6} space={6}>
          <FCCheckbox
            control={control}
            name="scam"
            label={t('chat.claims.scam')!}
            fontSize={14}
          />
          <FCCheckbox
            control={control}
            name="abuse"
            label={t('chat.claims.abuse')!}
            fontSize={14}
          />
          <FCCheckbox
            control={control}
            name="threat"
            label={t('chat.claims.threat')!}
            fontSize={14}
          />
          <FCCheckbox
            control={control}
            name="etc"
            label={t('chat.claims.etc')!}
            fontSize={14}
          />
        </VStack>
        <HStack w="100%" space={4} px={4} pb={4}>
          <Button
            variant={'outline'}
            colorScheme="secondary"
            flex={1}
            onPress={props.onClose}>
            {t('chat.claims.cancel')}
          </Button>
          <Button
            flex={1}
            bg="red.600"
            onPress={() => {
              handleSubmit(props.onSubmit)();
              onClose();
            }}>
            {t('chat.claims.submit')}
          </Button>
        </HStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

export default ClaimActionSheet;
