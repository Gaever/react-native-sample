import React from 'react';
import {observer} from 'mobx-react-lite';
import InitialErrorScreenContent from './InitialErrorScreenContent';
import {startApp} from '~src/app';

export interface InitialErrorScreenContainerProps {}

const InitialErrorScreenContainer = observer(
  (props: InitialErrorScreenContainerProps) => {
    return (
      <InitialErrorScreenContent
        onRetryPress={() => {
          startApp();
        }}
      />
    );
  },
);

export default InitialErrorScreenContainer;
