import {
  Box,
  Button,
  Center,
  IStackProps,
  ITheme,
  ScrollView,
  Spinner,
  Text,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Asset} from 'react-native-image-picker';
import i18n from '~src/i18n';
import {gender, GenericFormProps, ProfileFormData} from '~src/types';
import NationPicker from '../screens/NationPicker';
import DatePicker from './DatePicker';
import GenderToggle from './GenderToggle';
import GeoPicker from './GeoPicker';
import PhotosPicker, {PhotosPickerProps} from './PhotosPicker/PhotosPicker';
import FCCheckbox from './ui/FCCheckbox';
import FCSelect from './ui/FCSelect';
import FCTextArea from './ui/FCTextArea';
import FCTextInput from './ui/FCTextInput';

export interface ProfileFormProps extends GenericFormProps<ProfileFormData> {
  vStackProps?: IStackProps;
  px?: keyof ITheme['space'];
  submitTitle: string;
  onUploadAsset: (asset: Asset) => Promise<string>;
  showSubmitButton?: boolean;
  onPreviewPress?: () => void;
  showOnPreviewPress: boolean;
  registerSubmitHandler?: (cb: () => () => void) => void;
}

const fields = [
  'gender',
  'is_agent',
  'photos',
  'dont_show_photos',
  'show_online',
  'name',
  'age',
  'nation',
  // 'citizenship',
  'country',
  'city',
  'can_move',
  'education',
  'earn',
  'religion',
  'polygamy',
  'hidgab',
  'marrige',
  'friends',
  'disability',
  'children',
  'wives',
  // 'appearance',
  'about',
];

export const educationItems = [
  {
    label: i18n.t(`profile.education-items.middle-part`),
    value: 'middle-part',
  },
  {
    label: i18n.t(`profile.education-items.middle`),
    value: 'middle',
  },
  {
    label: i18n.t(`profile.education-items.middle-spec`),
    value: 'middle-spec',
  },
  {
    label: i18n.t(`profile.education-items.high-part`),
    value: 'high-part',
  },
  {
    label: i18n.t(`profile.education-items.high`),
    value: 'high',
  },
  {
    label: i18n.t(`profile.education-items.high-2`),
    value: 'high-2',
  },
  {
    label: i18n.t(`profile.education-items.high-many`),
    value: 'high-many',
  },
];

export const earnItems = [
  {
    label: i18n.t(`profile.earn-items.low`),
    value: 'low',
  },
  {
    label: i18n.t(`profile.earn-items.middle`),
    value: 'middle',
  },
  {
    label: i18n.t(`profile.earn-items.high`),
    value: 'high',
  },
];

export const childrenItems = [
  {label: i18n.t('profile.children-items.0'), value: '0'},
  {label: i18n.t('profile.children-items.1'), value: '1'},
  {label: i18n.t('profile.children-items.2'), value: '2'},
  {label: i18n.t('profile.children-items.3'), value: '3'},
  {label: i18n.t('profile.children-items.4'), value: '4'},
  {label: i18n.t('profile.children-items.5'), value: '5'},
  {label: i18n.t('profile.children-items.>5'), value: '>5'},
];

export const marrigeItems = (gender: gender | undefined) =>
  gender
    ? [
        {
          label: i18n.t(`profile.marrige-items.free-${gender}`),
          value: 'free',
        },
        {
          label: i18n.t(`profile.marrige-items.occupied-${gender}`),
          value: 'occupied',
        },
      ]
    : [];

export const religionItems = [
  {label: i18n.t('profile.religion-items.believer'), value: 'believer'},
  {
    label: i18n.t('profile.religion-items.believer-strict'),
    value: 'believer-strict',
  },
  {
    label: i18n.t('profile.religion-items.on-my-way'),
    value: 'on-my-way',
  },
];

export const polygamyItems = [
  {label: i18n.t('profile.polygamy-items.positive'), value: 'positive'},
  {label: i18n.t('profile.polygamy-items.negative'), value: 'negative'},
  {label: i18n.t('profile.polygamy-items.unsure'), value: 'unsure'},
];

export const hidgabItems = [
  {label: i18n.t('profile.hidgab-items.wear'), value: 'wear'},
  {
    label: i18n.t('profile.hidgab-items.dont-wear-agree'),
    value: 'dont-wear-agree',
  },
  {
    label: i18n.t('profile.hidgab-items.dont-wear-disagree'),
    value: 'dont-wear-disagree',
  },
];

export const wivesItems = [
  {label: i18n.t('profile.wives-items.0-1'), value: '0-1'},
  {label: i18n.t('profile.wives-items.1-2'), value: '1-2'},
  {label: i18n.t('profile.wives-items.2-3'), value: '2-3'},
  {label: i18n.t('profile.wives-items.3-4'), value: '3-4'},
];

function ListItem(props: {
  item: string;
  onDragStart?: () => void;
  onDragRelease?: () => void;
  PhotosPickerProps: PhotosPickerProps;
  defaultValues: ProfileFormData | undefined;
}) {
  const {
    register,
    getValues,
    control,
    formState: {errors},
  } = useFormContext<ProfileFormData>();
  const {t} = useTranslation();

  const genderController = useController({
    name: register('gender').name,
    control,
    rules: {
      required: true,
    },
  });

  const countryController = useController({
    name: register('country').name,
    control,
  });

  const cityController = useController({
    name: register('city').name,
    control,
  });

  const nationController = useController({
    name: register('nation').name,
    control,
  });

  const ageController = useController({
    name: register('age').name,
    control,
    rules: {
      required: true,
    },
  });

  const {item: key} = props;
  switch (key) {
    case 'photos':
      return (
        <Box>
          <Text fontWeight={700} pb={5} textAlign="center">
            {t('profile.photos-title')}
          </Text>
          <PhotosPicker
            onDragStart={props.onDragStart}
            onDragRelease={props.onDragRelease}
            {...props.PhotosPickerProps}
          />
        </Box>
      );
    case 'is_agent':
      return (
        <Center>
          <FCCheckbox
            widthAuth
            label={t('profile.is_agent-label')!}
            control={control}
            name="is_agent"
            error={errors?.is_agent?.message}
          />
        </Center>
      );

    case 'gender':
      return (
        <Box>
          <Text fontWeight={700} textAlign="center" pb={5}>
            {t('profile.gender-title')}
          </Text>
          <GenderToggle
            value={getValues('gender')}
            onChange={value => {
              genderController.field.onChange(value);
            }}
          />
        </Box>
      );
    case 'name':
      return (
        <Box>
          <FCTextInput
            control={control}
            name="name"
            initialValue={props?.defaultValues?.name}
            error={errors.name?.message}
            label={t('profile.name-label')!}
            placeholder={t('profile.name-label')!}
            rules={{
              required: true,
            }}
          />
        </Box>
      );
    case 'age':
      return (
        <DatePicker
          value={getValues('age') ? new Date(getValues('age')!) : undefined}
          label={t('profile.birthday-label')!}
          onChange={date => {
            ageController.field.onChange(date?.toISOString?.());
          }}
          required
          isInvalid={!!errors?.age}
        />
      );

    case 'nation':
      return (
        <NationPicker
          pickedValue={getValues('nation')}
          label={t('profile.nation-label')!}
          onChange={value => {
            nationController.field.onChange(value);
          }}
        />
      );
    // return (
    //   <FCSelect
    //     label={t('profile.nation-label')!}
    //     control={control}
    //     name="nation"
    //     error={errors?.education?.message}
    //     PickerSelectProps={{
    //       items: nations,
    //     }}
    //   />
    // );

    case 'citizenship':
      return (
        <Box>
          <FCTextInput
            control={control}
            name="citizenship"
            error={errors.citizenship?.message}
            initialValue={props?.defaultValues?.citizenship}
            label={t('profile.citizenship-label')!}
            placeholder={t('profile.citizenship-label')!}
          />
        </Box>
      );

    case 'city':
      return (
        <GeoPicker
          variant="city"
          pickedValue={getValues('city')}
          label={t('profile.city-label')!}
          onChange={({city}) => {
            cityController.field.onChange(city);
          }}
        />
      );

    case 'country':
      return (
        <GeoPicker
          variant="country"
          label={t('profile.country-label')!}
          pickedValue={getValues('country')}
          onChange={({country}) => {
            countryController.field.onChange(country);
          }}
        />
      );

    case 'can_move':
      return (
        <FCCheckbox
          label={t('profile.can_move-label')!}
          control={control}
          name="can_move"
          error={errors?.can_move?.message}
        />
      );

    case 'education':
      return (
        <FCSelect
          label={t('profile.education-label')!}
          control={control}
          name="education"
          error={errors?.education?.message}
          PickerSelectProps={{
            items: educationItems,
          }}
        />
      );

    case 'earn':
      return (
        <FCSelect
          label={t('profile.earn-label')!}
          control={control}
          name="earn"
          error={errors?.earn?.message}
          PickerSelectProps={{
            items: earnItems,
          }}
        />
      );

    case 'marrige':
      return (
        <FCSelect
          label={t('profile.marrige-label')!}
          control={control}
          name="marrige"
          error={errors?.marrige?.message}
          PickerSelectProps={{
            items: marrigeItems(getValues('gender')),
          }}
        />
      );

    case 'children':
      return (
        <FCSelect
          label={t('profile.children-label')!}
          control={control}
          name="children"
          error={errors?.children?.message}
          PickerSelectProps={{
            items: childrenItems,
          }}
        />
      );

    case 'disability':
      return (
        <FCTextInput
          control={control}
          name="disability"
          initialValue={props?.defaultValues?.disability}
          error={errors.disability?.message}
          label={t('profile.disability-label')!}
        />
      );
    case 'friends':
      return (
        <FCCheckbox
          widthAuth
          label={t('profile.friends-label')!}
          control={control}
          name="friends"
          error={errors?.friends?.message}
        />
      );

    case 'religion':
      return (
        <FCSelect
          label={t('profile.religion-label')!}
          control={control}
          name="religion"
          error={errors?.religion?.message}
          PickerSelectProps={{
            items: religionItems,
          }}
        />
      );

    case 'polygamy':
      return (
        <FCSelect
          label={t('profile.polygamy-label')!}
          control={control}
          name="polygamy"
          error={errors?.polygamy?.message}
          PickerSelectProps={{
            items: polygamyItems,
          }}
        />
      );

    case 'hidgab':
      return (
        <FCSelect
          label={t('profile.hidgab-label')!}
          control={control}
          name="hidgab"
          error={errors?.hidgab?.message}
          PickerSelectProps={{
            items: hidgabItems,
          }}
        />
      );

    case 'wives':
      return (
        <FCSelect
          label={t('profile.wives-label')!}
          control={control}
          name="wives"
          error={errors?.wives?.message}
          PickerSelectProps={{
            items: wivesItems,
          }}
        />
      );

    case 'appearance':
      return (
        <FCTextArea
          placeholder={t('profile.appearance-label')!}
          initialValue={props?.defaultValues?.appearance}
          control={control}
          name="appearance"
          error={errors?.appearance?.message}
        />
      );

    case 'dont_show_photos':
      return (
        <FCCheckbox
          label={t('profile.dont_show_photos-label')!}
          control={control}
          name="dont_show_photos"
          error={errors?.dont_show_photos?.message}
        />
      );

    case 'show_online':
      return (
        <FCCheckbox
          label={t('profile.show_online-label')!}
          control={control}
          name="show_online"
          error={errors?.show_online?.message}
        />
      );

    case 'about':
      return (
        <FCTextArea
          placeholder={t('profile.about-placeholder')!}
          initialValue={props?.defaultValues?.about}
          control={control}
          name="about"
          TextAreaProps={{
            maxLength: 300,
          }}
          error={errors?.about?.message}
        />
      );
    default:
      return null;
  }
}

function ProfileForm(props: ProfileFormProps) {
  const px = props.px || 9;
  const form = useForm<ProfileFormData>({
    mode: 'onBlur',
    defaultValues: {
      ...props.initialValues,
      photos:
        (props.initialValues?.photos?.length || 0) < 1
          ? []
          : props.initialValues?.photos?.filter?.(item => !!item.uri),
      show_online: props.initialValues?.show_online ?? true,
    },
  });

  const isSubmitDisabled =
    !form.formState.isValid || form.formState.isSubmitting;

  const [isAssetUploading, setIsAssetUploading] = useState(false);
  const {t} = useTranslation();

  const photosPickerProps: PhotosPickerProps = {
    items: form.getValues('photos')!,
    isAssetUploading,
    onImageUpdate: async (itemIndex, asset) => {
      setIsAssetUploading(true);
      try {
        const uri = await props.onUploadAsset(asset);
        if (uri) {
          const newPhotos = (form.getValues('photos') || []).map(
            (existItem, index) => (index === itemIndex ? {uri} : existItem),
          );
          form.setValue('photos', newPhotos);
        }
      } catch {
      } finally {
        setIsAssetUploading(false);
      }
    },
    onImageAdd: async asset => {
      setIsAssetUploading(true);
      try {
        const uri = await props.onUploadAsset(asset);
        if (uri) {
          const newPhotos = [...(form.getValues('photos') || []), {uri}];
          form.setValue('photos', newPhotos);
        }
      } catch {
      } finally {
        setIsAssetUploading(false);
      }
    },
    onImageRemove: itemIndex => {
      const newPhotos = [...(form.getValues('photos') || [])].filter(
        (_, index) => index !== itemIndex,
      );
      form.setValue('photos', newPhotos);
    },
  };

  const [prevForm, setPrevForm] = useState(props.form);
  useEffect(() => {
    const newForm = {
      ...props.form,
      photos: (props.form?.photos?.length || 0) < 1 ? [] : props.form?.photos,
      show_online: props.initialValues?.show_online ?? true,
    };
    if (JSON.stringify(newForm) !== JSON.stringify(prevForm)) {
      form.reset(newForm);
      setPrevForm(newForm);
    }
  }, [props.form, prevForm]);

  useEffect(() => {
    props?.registerSubmitHandler?.(() => () => {
      form.handleSubmit(props.onSubmit)();
    });
  }, [props.registerSubmitHandler]);

  form.watch('gender');

  return (
    <Box flex={1}>
      {form.formState.isSubmitting ? (
        <>
          <Box
            position="absolute"
            flex={1}
            justifyContent="center"
            zIndex={10}
            width="100%"
            height="100%"
            bg="black"
            opacity={0.3}></Box>
          <Box
            position="absolute"
            flex={1}
            justifyContent="center"
            zIndex={11}
            width="100%"
            height="100%">
            <Spinner color="white" />
          </Box>
        </>
      ) : null}
      <FormProvider {...form}>
        <ScrollView px={px} pb={5}>
          <Box pt={5} />

          {fields.map(item => {
            if (!form.getValues('gender') && item !== 'gender') {
              return null;
            }

            if (item === 'hidgab' && form.getValues('gender') !== 'f') {
              return null;
            }

            if (item === 'wives' && form.getValues('gender') !== 'm') {
              return null;
            }

            return (
              <Box pb={5} key={item}>
                <ListItem
                  defaultValues={props.initialValues}
                  PhotosPickerProps={photosPickerProps}
                  item={item}
                />
              </Box>
            );
          })}

          {props.showSubmitButton ?? form.getValues('gender') ? (
            <Button
              isLoading={form.formState.isSubmitting}
              disabled={isSubmitDisabled}
              variant="solid"
              onPress={form.handleSubmit(props.onSubmit)}
              {...(isSubmitDisabled ? {opacity: 0.3} : null)}>
              {props.submitTitle}
            </Button>
          ) : null}
          {props.showOnPreviewPress && form.getValues('gender') ? (
            <Button
              onPress={props.onPreviewPress}
              variant="outline"
              colorScheme="secondary">
              {t('profile.preview-button-label')}
            </Button>
          ) : null}
          <Box pt={5} />
        </ScrollView>
      </FormProvider>
    </Box>
  );
}

export default ProfileForm;
