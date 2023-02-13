import {gql} from '@apollo/client';

const ProfileOutputFragment = gql`
  fragment ProfileOutput on profile {
    age
    profileId: id
    created_at
    name
    photos
    userId
    show_online
    religion
    polygamy
    nation
    marrige
    hidgab
    gender
    education
    earn
    disability
    country
    city
    citizenship
    children
    can_move
    appearance
    about
    wives
    friends
    is_agent
  }
`;

export const PROFILES_GQL = gql`
  ${ProfileOutputFragment}

  query (
    $usersLimit: Int = 10
    $usersOffset: Int = 0
    $usersWhere: users_bool_exp = {}
    $leveragesLimit: Int = 0
    $leveragesOffset: Int = 0
    $leveragesWhere: user_leverages_bool_exp = {}
  ) {
    users(
      limit: $usersLimit
      offset: $usersOffset
      order_by: {last_seen: desc}
      where: $usersWhere
    ) {
      profiles {
        ...ProfileOutput
      }
      last_seen
    }
    user_leverages(
      limit: $leveragesLimit
      offset: $leveragesOffset
      order_by: {views_count: asc, created_at: asc}
      where: $leveragesWhere
    ) {
      id
      user_leverage_users__links {
        user {
          profiles {
            ...ProfileOutput
          }
        }
      }
    }
  }
`;

export const LEVERAGED_PROFILES_GQL = gql`
  ${ProfileOutputFragment}

  query (
    $limit: Int = 10
    $offset: Int = 0
    $where: user_leverages_bool_exp = {}
  ) {
    user_leverages(
      limit: $limit
      offset: $offset
      where: $where
      order_by: {views_count: asc, created_at: asc}
    ) {
      id
      user_leverage_users__links {
        user {
          profiles {
            ...ProfileOutput
          }
        }
      }
    }
  }
`;

export const INC_USER_LEVERAGE_VIEW_COUNT = gql`
  mutation ($userLeveragesIds: [uuid!]) {
    update_user_leverages_many(
      updates: {where: {id: {_in: $userLeveragesIds}}, _inc: {views_count: 1}}
    ) {
      affected_rows
    }
  }
`;
