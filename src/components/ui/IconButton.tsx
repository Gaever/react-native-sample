import {HStack, Icon, Pressable, Text} from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface IconButtonProps {
  onPress: () => void;
  label: string;
  iconName: string;
}

function IconButton(props: IconButtonProps) {
  return (
    <Pressable onPress={props.onPress}>
      <HStack alignItems="center" space={1}>
        <Icon
          as={MaterialCommunityIcons}
          name={props.iconName}
          color="primary.400"
          size={6}
        />
        <Text fontSize="sm">{props.label}</Text>
      </HStack>
    </Pressable>
  );
}

export default IconButton;
