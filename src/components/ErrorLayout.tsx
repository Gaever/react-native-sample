import {Box, Text, VStack} from 'native-base';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

export interface ErrorLayoutProps {
  title?: string;
  error?: string;
  actionsButtons: React.ReactNode | React.ReactNode[];
}

function ErrorLayout(props: ErrorLayoutProps) {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Box flex={1} h="100%" pt={5}>
        <Box px={9}>
          <Text fontSize={30} fontWeight={800}>
            {props.title || t('generic-error-title')}
          </Text>
          <Text>{props.error}</Text>
        </Box>
        <VStack position="absolute" bottom={0} w="100%" px={9} space={2} pb={5}>
          {props.actionsButtons}
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

export default ErrorLayout;
