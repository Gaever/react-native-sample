import {Box, Text} from 'native-base';
import React from 'react';
import {Platform, View} from 'react-native';

export interface InlineBadgesProps {
  items: ({label?: string; bg?: string; color?: string} | null)[];
  space?: string;
  padding?: string;
  py?: string;
  fontSize?: string;
  bg?: string;
  color?: string;
  fontWeight?: number;
  maxItems?: number;
}

function InlineBadges(props: InlineBadgesProps) {
  const space = props.space || '2px';
  const padding = props.padding || '2px';
  const paddingTop = props.py || '2px';
  const fontSize = props.fontSize || '12px';
  const items = props.maxItems
    ? props.items.splice(0, props.maxItems)
    : props.items;

  if (Platform.OS === 'android') {
    return (
      <Box p={2}>
        <Box flexWrap="wrap">
          {items.map(item =>
            item && item.label ? (
              <Text
                key={item.label!}
                bg={item.bg || props.bg ? item.bg || props.bg : 'gray.100'}
                alignSelf="flex-start"
                mb={space}
                mr={space}
                p={padding}
                py={paddingTop}
                borderRadius="sm"
                fontSize={fontSize}
                {...(props.fontWeight ? {fontWeight: props.fontWeight} : null)}
                {...(item.color || props.color
                  ? {color: item.color || props.color}
                  : null)}>
                {item.label}
              </Text>
            ) : null,
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Text flexWrap="wrap" lineBreakMode="tail" textBreakStrategy="balanced">
        {items.map(item =>
          item && item.label ? (
            <Box key={item.label}>
              <Box
                mb={space}
                mr={space}
                borderRadius="sm"
                bg={item.bg || props.bg ? item.bg || props.bg : 'gray.100'}
                p={padding}
                py={paddingTop}>
                <Text
                  fontSize={fontSize}
                  {...(props.fontWeight
                    ? {fontWeight: props.fontWeight}
                    : null)}
                  {...(item.color || props.color
                    ? {color: item.color || props.color}
                    : null)}>
                  {item.label}
                </Text>
              </Box>
            </Box>
          ) : null,
        )}
      </Text>
    </Box>
  );
}

export default InlineBadges;
