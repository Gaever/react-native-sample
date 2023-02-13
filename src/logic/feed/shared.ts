import {USER_STATUS} from '~src/utils/consts';
import _last from 'lodash/last';
import {InfiniteData} from '@tanstack/react-query';

export function getUsersWhereCond({
  userId,
  gender,
  filters,
}: {
  userId: string | null;
  gender: string | undefined;
  filters: any | undefined;
}) {
  return {
    status: {_in: [USER_STATUS.profileFilled, USER_STATUS.payed]},
    profiles: {
      gender: {
        _in: (gender === 'm' && ['f']) ||
          (gender === 'f' && ['m']) || ['f', 'm'],
      },
      name: {_is_null: false},
      age: {_is_null: false},
      ...filters,
    },
    ...(userId
      ? {
          _not: {
            _or: [
              {
                id: {
                  _eq: userId,
                },
              },
              // {
              //   chat_rooms_users__links: {
              //     // Не показываем тех, кто уже в переписке
              //     chat_room: {
              //       chat_rooms_users__links: {userId: {_eq: userId}},
              //     },
              //   },
              // },
              {
                claimed_by: {
                  // Не показываем тех, на кого мы подали жалобу
                  user_1_id: {
                    _eq: userId,
                  },
                },
              },
              {
                claims: {
                  // Не показываем тех, кто подал на нас жалобу
                  user_2_id: {_eq: userId},
                },
              },
            ],
          },
        }
      : null),
  };
}

export function mapViewedLeverageIds(data: InfiniteData<any>): string[] {
  return (
    _last(data?.pages)?.data?.user_leverages?.map?.((item: any) => item?.id) ||
    []
  );
}
