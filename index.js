import {Navigation} from 'react-native-navigation';
import {onRegisterAppLaunchedHandler} from './src/app';

Navigation.events().registerAppLaunchedListener(onRegisterAppLaunchedHandler);
