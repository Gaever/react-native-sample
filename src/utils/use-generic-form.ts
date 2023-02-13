import {GenericFormProps} from '../types';
import {FormEvent, useCallback, useEffect, useState} from 'react';
import {GestureResponderEvent} from 'react-native';

export function useGenericForm(props: GenericFormProps<any>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormDisabled =
    props.isLoading || (isSubmitting && props.disableFormOnSubmit);

  useEffect(() => {
    if (!props.isLoading && !props.disableFormOnSubmit) {
      setIsSubmitting(false);
    }
  }, [setIsSubmitting, props.isLoading, props.disableFormOnSubmit]);

  const handleGenericFormSubmit = useCallback(
    (_event?: FormEvent<HTMLFormElement> | GestureResponderEvent) => {
      setIsSubmitting(true);
    },
    [],
  );

  return {
    handleGenericFormSubmit,
    isFormDisabled,
  };
}
