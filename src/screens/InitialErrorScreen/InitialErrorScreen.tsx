import {Center} from 'native-base';
import {LayoutStackChildren} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import InitialErrorScreenContainer from './InitialErrorScreenContainer';

export interface InitialErrorScreenProps {}

const InitialErrorScreen: ScreenFC<InitialErrorScreenProps> = () => {
  return <InitialErrorScreenContainer />;
};

InitialErrorScreen.screenName = 'InitialErrorScreen';
export const layoutOptions: (
  props?: InitialErrorScreenProps,
) => Promise<LayoutStackChildren> = async props => ({
  component: {
    passProps: props,
    name: InitialErrorScreen.screenName,
    options: {
      topBar: {
        visible: false,
      },
    },
  },
});

export default InitialErrorScreen;
