import React from 'react';
import moment from 'moment';
import {Box, Text} from 'native-base';
import {ChatListMessage} from '~src/types';

export interface NextDayProps {
  message: ChatListMessage;
  nextMessage: ChatListMessage | undefined;
}

function NextDay({message, nextMessage}: NextDayProps) {
  if (!message || !nextMessage) return null;

  const nextDay = nextMessage && new Date(nextMessage?.date);
  const currentDay = new Date(message?.date);

  if (nextMessage && moment(currentDay).isSame(nextDay, 'day')) return null;

  return (
    <Box pt="15px" pb="25px" m="auto">
      <Text>{moment(currentDay).format('LL')}</Text>
    </Box>
  );
}

export default NextDay;
