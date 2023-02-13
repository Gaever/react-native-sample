import React from 'react';
import {User, feedFiewType} from '~src/types';
import InlineBadges, {InlineBadgesProps} from '~components/ui/InlineBadges';
import {useTranslation} from 'react-i18next';

export interface ProfileTagsProps {
  user: User | undefined;
  variant?: feedFiewType;
  colorSchema?: string;
  color?: string;
  fontWeight?: number;
  maxItems?: number;
}

function ProfileTags(props: ProfileTagsProps) {
  const {t} = useTranslation();
  const tags: InlineBadgesProps['items'] = [
    {
      label: props.user?.is_agent ? t(`tags.is_agent`)! : undefined,
    },
    {label: props.user?.children ? t('tags.children')! : undefined},
    {
      label:
        props.user?.marrige && props.user?.gender
          ? t(
              `profile.marrige-items.${props.user?.marrige}-${props.user.gender}`,
            )!
          : undefined,
    },
    {
      label: props.user?.education
        ? `${t('tags.education')}: ${t(
            `profile.education-items.${props.user?.education}`,
          )!}`
        : undefined,
    },
    {
      label: props.user?.hidgab
        ? t(`profile.hidgab-items.${props.user?.hidgab}`)!
        : undefined,
    },
    {
      label: props.user?.can_move
        ? t(`tags.can_move-${props.user?.gender}`)!
        : undefined,
    },
    {
      label: props.user?.earn
        ? `${t(`profile.earn-label`)!}: ${t(
            `profile.earn-items.${props.user?.earn}`,
          )!}`
        : undefined,
    },
    {
      label: props.user?.polygamy
        ? `${t('tags.polygamy')}: ${
            (props.user?.polygamy === 'positive' && '👍') ||
            (props.user?.polygamy === 'negative' && '👎') ||
            (props.user?.polygamy === 'unsure' &&
              t('profile.polygamy-items.unsure'))
          }`
        : undefined,
    },
    {
      label: props.user?.religion
        ? t(`profile.religion-items.${props.user?.religion}`)!
        : undefined,
    },
    {
      label: props.user?.wives
        ? t(`profile.wives-items.${props.user?.wives}`)!
        : undefined,
    },
  ];

  return (
    <InlineBadges
      bg={props.colorSchema}
      space="6px"
      padding="5px"
      items={tags}
      maxItems={props.maxItems}
      color={props.color}
      fontWeight={props.fontWeight}
    />
  );
}

export default ProfileTags;
