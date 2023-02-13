import {observer} from 'mobx-react-lite';
import React from 'react';
import ShallUpdateAppScreenContent from './ShallUpdateAppScreenContent';

export interface ShallUpdateAppScreenContainerProps {}

const ShallUpdateAppScreenContainer = observer(() => {
  return <ShallUpdateAppScreenContent />;
});

export default ShallUpdateAppScreenContainer;
