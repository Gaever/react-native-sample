import {useCallback} from 'react';
import {Navigation} from 'react-native-navigation';
import {
  getUnauthorizedBlockedRoot,
  getUnauthorizedCreateProfileRoot,
} from '~src/app';
import {NEXT_PAGE} from './consts';

function useNextPageNavigation(componentId: string) {
  return useCallback(
    async (nextPage: string | null | undefined) => {
      switch (nextPage) {
        case NEXT_PAGE['profile']:
          Navigation.setRoot(await getUnauthorizedCreateProfileRoot());
          // Navigation.push(
          //   componentId,
          //   await CreateProfileScreen.layoutOptions(),
          // );
          // Navigation.showModal({
          //   stack: {
          //     children: [await CreateProfileScreen.layoutOptions()],
          //   },
          // });
          break;
        case NEXT_PAGE['user-disabled']:
          Navigation.setRoot(await getUnauthorizedBlockedRoot('disabled'));
          // Navigation.push(
          //   componentId,
          //   await UserSuspendedScreen.layoutOptions({variant: 'disabled'}),
          // );
          // Navigation.showModal({
          //   stack: {
          //     children: [
          //       await UserSuspendedScreen.layoutOptions({variant: 'disabled'}),
          //     ],
          //   },
          // });
          break;
        case NEXT_PAGE['user-moderation']:
          Navigation.setRoot(await getUnauthorizedBlockedRoot('moderation'));

          // Navigation.push(
          //   componentId,
          //   await UserSuspendedScreen.layoutOptions({variant: 'moderation'}),
          // );
          // Navigation.showModal({
          //   stack: {
          //     children: [
          //       await UserSuspendedScreen.layoutOptions({variant: 'moderation'}),
          //     ],
          //   },
          // });
          break;
      }
    },
    [componentId],
  );
}

export default useNextPageNavigation;
