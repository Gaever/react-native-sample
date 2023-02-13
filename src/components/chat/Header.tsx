import {
  Avatar,
  Box,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Text,
} from 'native-base';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface HeaderProps {
  avatar?: string;
  showAvatar?: boolean;
  dontShowPhotos?: boolean;
  showClaim?: boolean;
  name?: string;
  onBackPress: () => void;
  onClaimPress?: () => void;
  onAvatarPress?: () => void;
}

function Header(props: HeaderProps) {
  return (
    <HStack
      w="100%"
      p={2}
      px={0}
      pb={1}
      borderBottomColor="gray.200"
      borderBottomWidth={1}
      alignItems="center"
      justifyContent="space-between">
      <Box w={10} alignItems="flex-start">
        <IconButton
          onPress={props.onBackPress}
          borderRadius="full"
          size={7}
          icon={
            <Icon
              as={MaterialCommunityIcons}
              name="chevron-left"
              size={10}
              color="blue.500"
            />
          }
        />
      </Box>
      {props.showAvatar ?? true ? (
        <Pressable onPress={props.onAvatarPress}>
          <Box justifyContent="center" alignItems="center">
            <Avatar
              size="md"
              bg={{
                linearGradient: {
                  colors: ['primary.400', 'secondary.400'],
                  start: [1, 0],
                  end: [0, 1],
                },
              }}
              {...(props.avatar && !props.dontShowPhotos
                ? {source: {uri: props.avatar}}
                : null)}
            />
            <Text fontSize="11px" color="gray.400" mt={1}>
              {props.name || ' '}
            </Text>
          </Box>
        </Pressable>
      ) : null}
      {props.showClaim ?? true ? (
        <Box w={10} mr={2} alignItems="flex-end">
          <IconButton
            onPress={props.onClaimPress}
            size={10}
            borderRadius="full"
            icon={
              <Icon
                as={MaterialCommunityIcons}
                name="shield"
                size={6}
                color="blue.400"
              />
            }
          />
        </Box>
      ) : null}
    </HStack>
  );
}

export default Header;
