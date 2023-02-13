import {useTheme} from 'native-base';
import {} from 'react';
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from 'react-native-tab-view';

export interface TabProps extends SceneRendererProps {
  index: number;
}

function TabBarItem(
  props: SceneRendererProps & {
    navigationState: NavigationState<{title: string; key: string}>;
  },
) {
  const theme = useTheme();

  return (
    <TabBar
      contentContainerStyle={{
        backgroundColor: 'transparent',
      }}
      activeColor={theme.colors.primary[400]}
      indicatorStyle={{backgroundColor: theme.colors.primary[400]}}
      inactiveColor={theme.colors.gray[600]}
      labelStyle={{fontWeight: '600'}}
      style={{
        height: 40,
        backgroundColor: 'transparent',
      }}
      {...props}
    />
  );
}

export default TabBarItem;
