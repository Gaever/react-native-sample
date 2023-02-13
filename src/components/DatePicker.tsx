import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import {Box, Button, FormControl, Modal, Pressable, Text} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import FormControlLabel from './ui/FormControlLabel';

export interface DatePickerProps {
  value?: Date;
  placeholder?: string;
  label?: string;
  required?: boolean;
  isInvalid?: boolean;
  onChange: (date: Date | undefined) => void;
}

function getMaximumDate() {
  return moment().subtract(18, 'years').toDate();
}

function DatePicker(props: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(
    props.value || getMaximumDate(),
  );
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);
  const {t} = useTranslation();

  const onChange = useCallback(
    (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
      setDate(selectedDate);
      props.onChange(selectedDate);
    },
    [],
  );

  const showDatepicker = () => {
    if (Platform.OS === 'android') {
      setShow(false);
      DateTimePickerAndroid.open({
        onChange,
        maximumDate: getMaximumDate(),
        mode: 'date',
        value: date || getMaximumDate(),
      });
    } else {
      setShow(true);
    }
    setMode('date');
  };

  const hideDatepicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.dismiss('date');
    } else {
      setShow(true);
    }
    setShow(false);
  };

  return (
    <Box flex={1}>
      <Pressable
        flex={1}
        onPress={() => {
          showDatepicker();
        }}>
        <FormControl>
          <FormControlLabel>
            {props.label}
            {props.required ? <Text color="red.400"> *</Text> : null}
          </FormControlLabel>

          <Box
            height="36px"
            borderBottomColor="gray.300"
            borderBottomWidth={1}
            {...(props.isInvalid ? {borderBottomColor: 'red.400'} : null)}
            flex={1}
            pt={2}>
            <Text fontSize="md" color={props.value ? 'black' : 'gray.300'}>
              {(props.value && moment(props.value).format('DD.MM.YYYY')) ||
                props.placeholder ||
                props.label}
            </Text>
          </Box>
        </FormControl>
      </Pressable>

      <Modal isOpen={show && Platform.OS === 'ios'} onClose={hideDatepicker}>
        <Modal.Content width="90%">
          <Modal.CloseButton />
          <Modal.Header borderBottomWidth={1} borderBottomColor="gray.200">
            {props.label}
          </Modal.Header>
          <Modal.Body
            justifyItems="center"
            _scrollview={{scrollEnabled: false}}>
            <DateTimePicker
              display="inline"
              maximumDate={getMaximumDate()}
              value={date || getMaximumDate()}
              mode={mode}
              onChange={onChange}
            />
            <Button
              onPress={() => {
                hideDatepicker();
                props.onChange(date);
              }}>
              {t('ok')}
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
}

export default DatePicker;
