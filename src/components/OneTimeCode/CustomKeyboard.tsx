import {
  Box,
  Icon,
  IconButton,
  IIconButtonProps,
  IPressableProps,
  Pressable,
} from 'native-base';
import React, {useCallback} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

enum KeyTypes {
  Digit = 'Digit',
  Backspace = 'Backspace',
  Empty = 'Empty',
}
interface IKey {
  key: string;
  component: any;
  type: KeyTypes;
  value?: any;
}

const makeDigit = (digit: number): IKey => ({
  key: String(digit),
  type: KeyTypes.Digit,
  value: digit,
  component: (props: IPressableProps) => (
    <Pressable
      p="20px"
      w={`${100 / 3}%`}
      justifyContent="center"
      alignItems="center"
      {...props}>
      <Box fontSize="2xl" textAlign="center">
        {digit}
      </Box>
    </Pressable>
  ),
});

const BackspaceKeyComponent = (props: IIconButtonProps) => {
  return (
    <IconButton
      w="30px"
      h="30px"
      justifyContent="center"
      alignItems="center"
      {...props}>
      <Icon as={MaterialCommunityIcons} name="erase" size={16} color="black" />
    </IconButton>
  );
};
const BackspaceKey: IKey = {
  key: KeyTypes.Backspace,
  type: KeyTypes.Backspace,
  component: BackspaceKeyComponent,
};

const EmptyKeyComponent = (props: IPressableProps) => (
  <Pressable
    disabled
    p="20px"
    w={`${100 / 3}%`}
    justifyContent="center"
    alignItems="center"
    {...props}>
    <Box w="30px" h="30px" />
  </Pressable>
);
const EmptyKey: IKey = {
  key: KeyTypes.Empty,
  type: KeyTypes.Empty,
  component: EmptyKeyComponent,
};

const keys: IKey[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  .map(makeDigit)
  .concat([EmptyKey, makeDigit(0), BackspaceKey]);

export interface CustomKeyboardProps {
  onInsert: (item: string) => void;
  onDelete: () => void;
}

const CustomKeyboard = ({onInsert, onDelete}: CustomKeyboardProps) => {
  const renderKey = useCallback(
    (item: IKey) => {
      const KeyComponent = item.component;

      const onKeyPress = () => {
        if (item.type === KeyTypes.Backspace) return onDelete();
        if (item.type === KeyTypes.Digit) return onInsert(item.value);
      };

      return <KeyComponent key={item.key} onPress={onKeyPress} />;
    },
    [onInsert, onDelete],
  );

  return (
    <Box
      flexWrap="wrap"
      flexDir="row"
      alignItems="center"
      justifyContent="center">
      {keys.map(renderKey)}
    </Box>
  );
};

export default CustomKeyboard;
