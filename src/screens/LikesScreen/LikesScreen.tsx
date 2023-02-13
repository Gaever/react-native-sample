import {useCallback} from 'react';
import {Navigation} from 'react-native-navigation';
import {ScreenFC} from 'react-native-navigation-register-screens/dist/types';
import * as DetailsScreen from '~src/screens/DetailsScreen/DetailsScreen';
import {User} from '~src/types';
import {usersILikeThem, usersTheyLikeMe} from '~src/__mock__';
import LikesScreenContent from './LikesScreenContent';

export interface LikesScreenProps {}

const LikesScreen: ScreenFC<LikesScreenProps> = props => {
  const navigateToUser = useCallback(async (user: User) => {
    Navigation.push(
      props.componentId,
      await DetailsScreen.layoutOptions({targetUser: user}),
    );
  }, []);

  return (
    <LikesScreenContent
      ILikeThemDatingCardListProps={{
        onDetailsPress: navigateToUser,
        onLikePress: () => {},
        onRejectPress: () => {},
        profiles: usersILikeThem,
      }}
      TheyLikeMeDatingCardListProps={{
        onDetailsPress: navigateToUser,
        onLikePress: () => {},
        onRejectPress: () => {},
        profiles: usersTheyLikeMe,
      }}
    />
  );
};
LikesScreen.screenName = 'LikesScreen';
LikesScreen.options = {
  topBar: {
    visible: false,
  },
};

export default LikesScreen;
