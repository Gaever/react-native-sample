import {HStack, Text} from 'native-base';

export interface KeyValueLiProps {
  label?: string;
  value?: string;
}

function KeyValueLi(props: KeyValueLiProps) {
  return (
    <HStack space={3} alignItems="center">
      <Text fontWeight={600} fontSize="sm" flex={1} color="gray.500">
        {props.label}
      </Text>
      <Text fontSize="sm" flex={1}>
        {props.value}
      </Text>
    </HStack>
  );
}
export default KeyValueLi;
