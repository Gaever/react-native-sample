import {Box, Text} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';

export interface MatchRequestPlaceholderProps extends React.PropsWithChildren {}

function MatchRequestPlaceholder(props: MatchRequestPlaceholderProps) {
  return (
    <Box
      w="100%"
      p={2}
      borderTopWidth={1}
      borderTopColor="gray.200"
      flexDir="row"
      alignItems="center"
      bg="gray.100"
      justifyContent="space-between">
      <Text color="gray.700">{props.children}</Text>
    </Box>
  );
}

export default MatchRequestPlaceholder;
