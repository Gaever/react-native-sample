import {useQuery} from '@tanstack/react-query';
import {
  Box,
  FlatList,
  FormControl,
  Modal,
  Pressable,
  Text,
  TextField,
} from 'native-base';
import React, {useCallback, useState} from 'react';
import {geo} from '~src/api';
import {useDebouncedCallback} from 'use-debounce';
import {useTranslation} from 'react-i18next';
import FormControlLabel from './ui/FormControlLabel';
import _uniq from 'lodash/uniq';

export interface GeoPickerProps {
  pickedValue?: string;
  variant: 'city' | 'country';
  placeholder?: string;
  label?: string;
  onChange: (args: {city: string | null; country: string | null}) => void;
}

function GeoPicker(props: GeoPickerProps) {
  const [showModal, setShowModal] = useState(false);
  const [q, setQ] = useState('');
  const [isFetched, setIsFetched] = useState(false);

  const debouncedOnChangeText = useDebouncedCallback((value: string) => {
    setQ(value);
  }, 500);
  const {t} = useTranslation();

  const geoQuery = useQuery(['geo', q], async () => geo(q, props.variant), {
    enabled: showModal && !!q,
    onSettled: () => {
      setIsFetched(true);
    },
  });
  const modalInputPlaceholder = t(
    `components.geo.variant-${props.variant}.placeholder`,
  );
  const data = _uniq(
    (geoQuery?.data || []).map(
      item => (props.variant === 'city' ? item.city : item.country) ?? '',
    ),
  )
    .slice(0, 4)
    .filter(Boolean);

  const onClose = useCallback(() => {
    setQ('');
    setShowModal(false);
  }, []);

  const onItemPress = useCallback(
    (item: string) => {
      if (props.variant === 'city') {
        props.onChange({city: item, country: null});
      } else {
        props.onChange({city: null, country: item});
      }
      onClose();
    },
    [props.variant, props.onChange, onClose],
  );

  return (
    <Box flex={1}>
      <Pressable
        flex={1}
        onPress={() => {
          setShowModal(true);
          setQ('');
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
      <Modal isOpen={showModal} onClose={onClose}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={1} borderBottomColor="gray.200">
            {props.label}
          </Modal.Header>
          <Modal.Body justifyItems="center" height={200} p={0}>
            <Box
              h="34px"
              px={4}
              borderBottomWidth={1}
              borderBottomColor="gray.200">
              {/* @ts-ignore */}
              <TextField
                onChangeText={text => {
                  setIsFetched(false);
                  debouncedOnChangeText(text);
                }}
                placeholder={modalInputPlaceholder}
                borderBottomWidth={0}
                fontSize="sm"
              />
            </Box>

            {data.map(item => (
              <Pressable
                key={item}
                onPress={() => {
                  onItemPress(item);
                }}>
                <Box
                  key={item}
                  width="100%"
                  p={2}
                  px={4}
                  borderBottomWidth={1}
                  borderBottomColor="gray.200">
                  <Text>{item}</Text>
                </Box>
              </Pressable>
            ))}
            {data.length < 1 && q && !geoQuery.isLoading && isFetched ? (
              <Pressable
                onPress={() => {
                  onItemPress(q);
                }}>
                <Box
                  width="100%"
                  p={2}
                  px={4}
                  borderBottomWidth={1}
                  borderBottomColor="gray.200">
                  <Text color="gray.400">
                    {t('components.geo.not-found')}{' '}
                    <Text fontWeight={600} color="gray.400">
                      {q}
                    </Text>
                  </Text>
                </Box>
              </Pressable>
            ) : null}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}

export default GeoPicker;
