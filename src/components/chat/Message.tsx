import moment from 'moment';
import {Actionsheet, Box, ITheme, Text, useTheme} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {SlideInRight, SlideOutRight} from 'react-native-reanimated';
import {ChatMessage, ChatMessageFeedbackStatus} from '~src/types';
import {CHAT_MESSAGE_VARIANT} from '~src/utils/consts';
import localTime from '~src/utils/local-time';
import Feedback from './Feedback';

export interface MessageProps extends ChatMessage {
  onErrorPress: () => void;
}

const textMessageStyle = (theme: ITheme, props: MessageProps) =>
  StyleSheet.create({
    view: {
      marginLeft: theme.space[4],
      marginRight: theme.space[4],
      marginBottom: theme.space[4],
      padding: theme.space[3],
      paddingTop: theme.space[2],
      paddingBottom: theme.space[2],
      maxWidth: '60%',
      backgroundColor: theme.colors.gray[100],
      borderRadius: theme.radii['xl'],

      ...(props.self
        ? {
            marginLeft: 'auto',
            borderBottomRightRadius: theme.radii['xs'],
            backgroundColor: theme.colors.blue[100],
          }
        : null),
      ...(!props.self
        ? {
            marginRight: 'auto',
            borderBottomLeftRadius: theme.radii['xs'],
          }
        : null),
      // ...(props.status === ChatMessageFeedbackStatus.Error
      //   ? {
      //       borderWidth: 1,
      //       borderColor: theme.colors.error[400],
      //     }
      //   : null),
    },
  }).view;

function Message(props: MessageProps) {
  const {t} = useTranslation();
  const {text: message, self, created_at: createdAt, status} = props;
  const isLoading = status === ChatMessageFeedbackStatus.Loading;
  const theme = useTheme();

  if (props.variant === CHAT_MESSAGE_VARIANT.like) {
    return (
      <Box textAlign="center" alignItems="center" m={4}>
        <Text fontSize={16} fontWeight={600}>
          {props.likeDirection === 'in' &&
            t('chat-room.variant-like.you-were-liked')}
          {props.likeDirection === 'out' &&
            t('chat-room.variant-like.you-liked')}
        </Text>
      </Box>
    );
  }

  return (
    <Animated.View
      key={status}
      entering={self && isLoading ? SlideInRight : undefined /*SlideInLeft*/}
      exiting={self && !isLoading ? SlideOutRight : undefined /* SlideOutLeft*/}
      style={textMessageStyle(theme, props)}>
      <Text selectable>{message}</Text>
      <Box ml="auto" flexDirection="row" alignItems="center">
        <Text fontSize={'10px'} color="gray.400">
          {localTime(createdAt).format('HH:mm')}
        </Text>
        {self && (
          <Box ml={1}>
            <Feedback
              status={status || ChatMessageFeedbackStatus.Success}
              onErrorPress={props.onErrorPress}
            />
          </Box>
        )}
      </Box>
    </Animated.View>
  );
}

export default Message;
