import moment from 'moment';
import {Box, HStack, Image, Pressable, Text, VStack} from 'native-base';
import React from 'react';
import StatusBadge from '~components/StatusBadge';
import {ChatRoom} from '~src/types';
import localTime from '~src/utils/local-time';

export interface ChatListMessageProps extends ChatRoom {
  onPress: (targetUserId: string) => void;
  dontShowPhotos: boolean;
}

function ChatListMessage(props: ChatListMessageProps) {
  return (
    <Pressable
      flex={1}
      onPress={() => {
        props.onPress(props.targetUserId!);
      }}>
      <HStack p={3} borderRadius="md" alignItems="flex-start">
        <Box
          w={55}
          h={55}
          mr="15px"
          bg={{
            linearGradient: {
              colors: ['secondary.500', 'primary.300'],
              start: [1, 0],
              end: [0, 1],
            },
          }}
          borderRadius="full">
          <Image
            borderRadius="full"
            w={55}
            h={55}
            alt=""
            source={{uri: props.dontShowPhotos ? undefined : props.picture}}
          />
        </Box>
        <VStack flex={1}>
          <HStack space={2}>
            <Text fontWeight={600}>{props.name}</Text>
            {props.isOnline ? (
              <StatusBadge size={1.5} color="primary.400" />
            ) : null}
          </HStack>

          <Text
            fontSize="xs"
            color="gray.500"
            {...(props.isUnread ? {fontWeight: 600} : null)}>
            {props.lastMessage}
          </Text>
        </VStack>
        <Box h="100%" justifyContent="flex-start" alignItems="flex-end">
          <Text color="gray.500" fontSize="xs">
            {props.lastMessageDate &&
              localTime(props.lastMessageDate).format('HH:mm')}
          </Text>
          {props.isUnread ? (
            <StatusBadge size={2} color="secondary.400" />
          ) : null}
        </Box>
      </HStack>
    </Pressable>
  );
}

export default ChatListMessage;
