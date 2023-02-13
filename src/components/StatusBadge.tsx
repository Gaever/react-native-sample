import {Circle, ICircleProps, HStack, IBoxProps, Text} from 'native-base';
import React from 'react';

export interface StatusBadgeProps extends React.PropsWithChildren {
  color?: IBoxProps['color'];
  textColor?: IBoxProps['color'];
  size?: ICircleProps['size'];
  fontSize?: number;
}

function StatusBadge(props: StatusBadgeProps) {
  return (
    <HStack alignItems="center" space={1}>
      <Circle
        size={props.size || '4px'}
        bg={props.color || 'primary.400'}
        top="1px"
      />
      <Text fontSize={props.fontSize || 10} color={props.textColor}>
        {props.children}
      </Text>
    </HStack>
  );
}

export default StatusBadge;
