import {
  Box,
  Button,
  Center,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import LogoSvg from '~src/svg/logo-svg';

export interface FirstTimeViewProps {
  onClose: () => void;
}

function FirstTimeView(props: FirstTimeViewProps) {
  const theme = useTheme();
  const {t} = useTranslation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.primary[600]}}>
      <Box p={6} pb={2}>
        <LogoSvg width={100} height={40} fill={theme.colors.primary[400]} />
      </Box>
      <ScrollView p={6} pb={0}>
        <VStack space={4}>
          <Box>
            <Text
              fontWeight={600}
              color="white"
              textAlign="center"
              fontSize={'22px'}>
              اِنَّ الۡمُسۡلِمِيۡنَ وَالۡمُسۡلِمٰتِ وَالۡمُؤۡمِنِيۡنَ
              وَالۡمُؤۡمِنٰتِ وَالۡقٰنِتِيۡنَ وَالۡقٰنِتٰتِ وَالصّٰدِقِيۡنَ
              وَالصّٰدِقٰتِ وَالصّٰبِرِيۡنَ وَالصّٰبِرٰتِ وَالۡخٰشِعِيۡنَ
              وَالۡخٰشِعٰتِ وَالۡمُتَصَدِّقِيۡنَ وَ الۡمُتَصَدِّقٰتِ
              وَالصَّآٮِٕمِيۡنَ وَالصّٰٓٮِٕمٰتِ وَالۡحٰـفِظِيۡنَ فُرُوۡجَهُمۡ
              وَالۡحٰـفِظٰتِ وَالذّٰكِرِيۡنَ اللّٰهَ كَثِيۡرًا وَّ الذّٰكِرٰتِ ۙ
              اَعَدَّ اللّٰهُ لَهُمۡ مَّغۡفِرَةً وَّاَجۡرًا عَظِيۡمًا 
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight={600}
              color="white"
              textAlign="center"
              fontSize="lg">
              {t('first-time.text')}
            </Text>
          </Box>
        </VStack>
      </ScrollView>
      <Box p={6} pt={2}>
        <Button
          colorScheme="secondary"
          bg="secondary.600"
          onPress={props.onClose}>
          {t('first-time.continue')}
        </Button>
      </Box>
    </SafeAreaView>
  );
}

export default FirstTimeView;
