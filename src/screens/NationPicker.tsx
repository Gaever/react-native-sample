import {Box, FormControl, Pressable, Text, TextField} from 'native-base';
import React, {useCallback, useState} from 'react';
import BigList, {BigListRenderItem} from 'react-native-big-list';
import RUNations from '~src/i18n/langs/RU-nations.json';
import {Modal} from 'native-base';
import FormControlLabel from '~components/ui/FormControlLabel';
import {useDebouncedCallback} from 'use-debounce';
import {useTranslation} from 'react-i18next';
import Fuse from 'fuse.js';
import {SafeAreaView} from 'react-native-safe-area-context';

export interface NationPickerProps {
  onChange: (value: string) => void;
  label?: string;
  pickedValue?: string | null | undefined;
  placeholder?: string;
}

const ITEM_HEIGHT = 50;

interface TListItem {
  label?: string;
  value?: string;
  item?: {label: string; value: string};
}

const renderItem: (props: NationPickerProps) => BigListRenderItem<TListItem> =
  props =>
  ({item}) => {
    return (
      <Pressable
        p={2}
        onPress={() => {
          props.onChange(item?.item?.value || item?.value || '');
        }}>
        <Text>{item?.label || item?.item?.label}</Text>
      </Pressable>
    );
  };

const searcher = new Fuse(RUNations, {
  keys: ['label'],
  isCaseSensitive: false,
});

function NationPicker(props: NationPickerProps) {
  const [showModal, setShowModal] = useState(false);
  const [q, setQ] = useState('');

  const onClose = useCallback(() => {
    setShowModal(false);
  }, []);
  const debouncedOnChangeText = useDebouncedCallback((value: string) => {
    setQ(value);
  }, 500);
  const {t} = useTranslation();
  const modalInputPlaceholder = t('search');

  const onItemPress = useCallback(
    (value: string) => {
      props.onChange(value);
      onClose();
    },
    [props.onChange, onClose],
  );

  return (
    <Box>
      <Pressable
        flex={1}
        onPress={() => {
          setShowModal(true);
        }}>
        <FormControl>
          <FormControlLabel>{props.label}</FormControlLabel>

          <Box
            height="36px"
            borderBottomColor="gray.300"
            borderBottomWidth={1}
            flex={1}
            pt={2}>
            <Text
              fontSize="md"
              color={props.pickedValue ? 'black' : 'gray.300'}>
              {props.pickedValue || props.placeholder || props.label}
            </Text>
          </Box>
        </FormControl>
      </Pressable>
      <Modal
        height="100%"
        isOpen={showModal}
        onClose={onClose}
        size="full"
        borderRadius="none">
        <SafeAreaView
          style={{flex: 1, backgroundColor: 'white', width: '100%'}}>
          <Modal.Content borderRadius="none" flex={1} backgroundColor="white">
            <Modal.CloseButton />
            <Modal.Header
              backgroundColor="white"
              borderBottomWidth={1}
              borderBottomColor="gray.200"
              borderRadius="none">
              {props.label}
            </Modal.Header>
            <Box
              h="48px"
              px={4}
              borderBottomWidth={1}
              borderBottomColor="gray.200">
              {/* @ts-ignore */}
              <TextField
                top="6px"
                onChangeText={text => {
                  debouncedOnChangeText(text);
                }}
                placeholder={modalInputPlaceholder}
                borderBottomWidth={0}
                fontSize="md"
              />
            </Box>

            <BigList<TListItem>
              renderItem={renderItem({...props, onChange: onItemPress})}
              data={!q ? RUNations : searcher.search(q) || []}
              itemHeight={ITEM_HEIGHT}
            />
          </Modal.Content>
        </SafeAreaView>
      </Modal>
    </Box>
  );
}

export default NationPicker;
