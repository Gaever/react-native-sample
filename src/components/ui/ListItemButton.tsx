import {Box, HStack, IBoxProps, Icon, Pressable, Text} from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ListItemButtonProps {
  itemKey: string;
  label: React.ReactNode | React.ReactNode[];
  onPress?: () => void;
  BoxProps?: IBoxProps;
  arrowColor?: string;
}

function ListItemButton(props: ListItemButtonProps) {
  return (
    <Box py={3} flex={1} {...props.BoxProps}>
      <Pressable onPress={props.onPress}>
        <HStack justifyContent="space-between">
          <Box>
            <Text fontSize="md">{props.label}</Text>
          </Box>
          <Box>
            <Icon
              as={MaterialCommunityIcons}
              name="chevron-right"
              size={23}
              color={props.arrowColor || 'gray.700'}
            />
          </Box>
        </HStack>
      </Pressable>
    </Box>
  );
}

export default ListItemButton;
