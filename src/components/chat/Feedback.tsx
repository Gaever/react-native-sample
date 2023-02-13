import {Box, IBoxProps, Icon, Pressable} from 'native-base';
import React from 'react';
import ClockSvg from '~src/svg/clock-svg';
import TickSvg from '~src/svg/tick-svg';
import {ChatMessageFeedbackStatus} from '~src/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface FeedbackProps extends IBoxProps {
  status: ChatMessageFeedbackStatus;
  onErrorPress: () => void;
}

function Feedback(props: FeedbackProps) {
  if (props.status === ChatMessageFeedbackStatus.Loading) return <ClockSvg />;
  if (props.status === ChatMessageFeedbackStatus.Error)
    return (
      <Pressable
        onPress={props.onErrorPress}
        borderRadius="full"
        borderWidth={1}
        borderColor="error.400"
        p="2px">
        <Icon
          as={MaterialCommunityIcons}
          name="exclamation-thick"
          color="error.400"
          size={3}
        />
      </Pressable>
    );

  return <TickSvg />;
}

export default Feedback;
