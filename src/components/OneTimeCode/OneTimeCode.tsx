import moment from 'moment';
import {Box, IPressableProps, Pressable, Text} from 'native-base';
import React, {useState, Dispatch, SetStateAction, useEffect} from 'react';
import CodeInput from './CodeInput';
import CustomKeyboard from './CustomKeyboard';

const CODE_LENGTH = 6;
const INITIAL_TIMEOUT_IN_SECONDS = 50;
const RESEND_TIMEOUT_IN_SECONDS = 50;

const useTimer = (
  seconds: number,
): [number, Dispatch<SetStateAction<number>>] => {
  const [timer, setTimer] = useState(seconds);

  useEffect(() => {
    if (timer) {
      const timer = setInterval(() => setTimer(count => count - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timer]);

  return [timer, setTimer];
};

function ResendCodeButton(props: IPressableProps) {
  return (
    <Pressable
      hitSlop={{
        top: 50,
        left: 50,
        bottom: 25,
        right: 50,
      }}
      alignContent="center"
      alignItems="center"
      position="absolute"
      opacity={props.disabled ? 0.5 : 1}
      borderRadius="10px"
      padding="10px">
      {props.children}
    </Pressable>
  );
}

export interface OneTimeCodeProps {}

function OneTimeCode(props: OneTimeCodeProps) {
  const [timer, setTimer] = useTimer(INITIAL_TIMEOUT_IN_SECONDS);
  const [keyboardInput, setKeyboardInput] = useState('');

  const formattedTime = moment().minutes(0).seconds(timer).format('mm:ss');

  return (
    <Box>
      <Box>
        <Box>
          <Text>{formattedTime}</Text>
          <CodeInput value={keyboardInput} length={CODE_LENGTH} />
        </Box>
        <CustomKeyboard
          onInsert={num => {
            if (keyboardInput.length >= CODE_LENGTH) return;
            setKeyboardInput(keyboardInput + num);
          }}
          onDelete={() => setKeyboardInput(keyboardInput.slice(0, -1))}
        />
      </Box>
      <ResendCodeButton
        disabled={!!timer}
        onPress={() => {
          setTimer(RESEND_TIMEOUT_IN_SECONDS);
          setKeyboardInput('');
        }}>
        <Text fontSize="large" fontWeight="bold">
          Reenviar o código
        </Text>
      </ResendCodeButton>
    </Box>
  );
}

export default OneTimeCode;
