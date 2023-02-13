import {gql, useMutation, useSubscription} from '@apollo/client';
import {observer} from 'mobx-react-lite';
import {Box, Spinner} from 'native-base';
import React, {useContext} from 'react';
import {FilterContext, useAppState} from '~store/app-state';
import FilterModalContent, {
  FilterModalContentProps,
} from './FilterModalContent';

export interface FilterModalContainerProps
  extends Pick<FilterModalContentProps, 'registerSubmitHandler'> {
  onSubmit: () => void;
}

const FILTER_SUB = gql`
  subscription ($userId: uuid = "00000000-0000-0000-0000-000000000000") {
    users_by_pk(id: $userId) {
      applied_filters
    }
  }
`;

const FILTER_MUTATION = gql`
  mutation ($userId: uuid!, $form: jsonb) {
    update_users_by_pk(
      _set: {applied_filters: $form}
      pk_columns: {id: $userId}
    ) {
      id
    }
  }
`;

const FilterModalContainer = observer((props: FilterModalContainerProps) => {
  const {userId, user} = useAppState();
  const {setFilters} = useContext(FilterContext);
  const filterSub = useSubscription(FILTER_SUB, {
    skip: !userId,
    variables: {
      userId,
    },
  });
  const [doFilterMutaion] = useMutation(FILTER_MUTATION);

  const form = filterSub?.data?.users_by_pk?.applied_filters;

  const userGender = user?.gender;
  const targetUserGender =
    (userGender === 'f' && 'm') || (userGender === 'm' && 'f') || undefined;

  if (!user || filterSub.loading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Spinner color="gray.400" />
      </Box>
    );
  }

  return (
    <FilterModalContent
      registerSubmitHandler={props.registerSubmitHandler}
      targetUserGender={targetUserGender!}
      form={form}
      onSubmit={async form => {
        doFilterMutaion({variables: {userId, form}});
        setFilters(form);
        props.onSubmit();
      }}
      onReset={() => {
        doFilterMutaion({variables: {userId, form: {}}});
        setFilters({});
        props.onSubmit();
      }}
    />
  );
});

export default FilterModalContainer;
