import React from 'react';
import ProfileForm, {ProfileFormProps} from '~components/ProfileForm';
import SignInModalFormWrapper from '~components/SignInModalFormWrapper';

export interface CreateProfileScreenContentProps extends ProfileFormProps {}

function CreateProfileScreenContent(props: CreateProfileScreenContentProps) {
  return (
    <SignInModalFormWrapper pt={0}>
      <ProfileForm {...props} />
    </SignInModalFormWrapper>
  );
}

export default CreateProfileScreenContent;
