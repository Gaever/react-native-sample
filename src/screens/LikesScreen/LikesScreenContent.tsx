import {Box} from 'native-base';
import React from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView} from 'react-native-tab-view';
import TabBarItem from '~components/ui/TabBarItem';
import stylesheet from '~src/styles';
import DatingCardList, {
  DatingCardListProps,
} from '../../components/DatingCardList';

export interface LikesScreenContentProps {
  TheyLikeMeDatingCardListProps: DatingCardListProps;
  ILikeThemDatingCardListProps: DatingCardListProps;
}

function LikesScreenContent(props: LikesScreenContentProps) {
  const {t} = useTranslation();

  const [routes] = useState([
    {key: 'they-like', title: t('likes-screen.tab-they-like-me-title')},
    {key: 'i-like', title: t('likes-screen.tab-i-like-title')},
  ]);
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  return (
    <SafeAreaView style={stylesheet.container}>
      <TabView
        swipeEnabled={false}
        renderTabBar={props => <TabBarItem {...props} />}
        renderScene={({route}) => {
          switch (route.key) {
            case 'they-like':
              return (
                <DatingCardList {...props.TheyLikeMeDatingCardListProps} />
              );
            case 'i-like':
              return <DatingCardList {...props.ILikeThemDatingCardListProps} />;
          }
        }}
        initialLayout={{width: layout.width}}
        navigationState={{index, routes}}
        onIndexChange={setIndex}
      />
    </SafeAreaView>
  );
}

export default LikesScreenContent;
