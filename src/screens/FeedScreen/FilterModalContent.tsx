import {
  Box,
  Button,
  FormControl,
  HStack,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {useController, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import stylesheet from '~src/styles';
import GeoPicker from '~components/GeoPicker';
import {
  earnItems,
  educationItems,
  hidgabItems,
  marrigeItems,
  polygamyItems,
  religionItems,
  wivesItems,
} from '~components/ProfileForm';
import FCCheckbox from '~components/ui/FCCheckbox';
import FCSelect from '~components/ui/FCSelect';
import Range from '~components/ui/Range';
import {gender, GenericFormProps} from '~src/types';
import NationPicker from '../NationPicker';
import _range from 'lodash/range';

export interface FilterModalContentProps extends GenericFormProps<FilterForm> {
  targetUserGender: gender;
  form?: FilterForm;
  onReset?: () => void;
  registerSubmitHandler: (cb: () => () => void) => void;
}

export interface FilterForm {
  ageMin?: number | null;
  ageMax?: number | null;
  isOnlyWithPhoto?: boolean | null;
  country?: string | null;
  city?: string | null;
  can_move?: boolean | null;
  education?: string | null;
  earn?: string | null;
  marrige?: string | null;
  children?: string | null;
  religion?: string | null;
  polygamy?: string | null;
  hidgab?: string | null;
  wives?: string | null;
  disability?: boolean | null;
  is_agent?: boolean | null;
  nation?: string | null;
  friends?: boolean | null;
}

const ageItems = _range(18, 99, 1).map(item => ({
  label: `${item}`,
  value: `${item}`,
}));

function FilterModalContent(props: FilterModalContentProps) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const {
    register,
    getValues,
    control,
    handleSubmit,

    reset,
    formState: {errors},
  } = useForm<FilterForm & {gender?: gender}>({
    defaultValues: {
      gender: props.targetUserGender,
      ageMin: 18,
      ageMax: 99,
      ...props.form,
    },
  });
  const {t} = useTranslation();

  // const ageMinController = useController({
  //   name: register('ageMin').name,
  //   control,
  // });

  // const ageMaxController = useController({
  //   name: register('ageMax').name,
  //   control,
  // });

  const handleValueChange = useCallback((low: number, high: number) => {
    // ageMinController.field.onChange(low);
    // ageMaxController.field.onChange(high);
  }, []);

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

  useEffect(() => {
    props.registerSubmitHandler(() => () => {
      handleSubmit(props.onSubmit)();
    });
  }, [props.registerSubmitHandler]);

  return (
    <SafeAreaView style={stylesheet.modalContainer}>
      <ScrollView px={9} pt={3} flex={1} scrollEnabled={scrollEnabled}>
        <VStack space={4} flex={1}>
          {/* <FormControl>
            <HStack justifyContent="space-between" pb={2}>
              <Text color="black">{t('filter-screen.age-label')}</Text>
              <Text color="black">
                {getValues('ageMin') || 18}-{getValues('ageMax') || 99}
              </Text>
            </HStack>
            <Range
              onSlideEnd={() => {
                setScrollEnabled(true);
              }}
              onSlideStart={() => {
                setScrollEnabled(false);
              }}
              max={99}
              min={18}
              low={getValues('ageMin') || 18}
              high={getValues('ageMax') || 99}
              step={1}
              floatingLabel
              onValueChanged={handleValueChange}
            />
          </FormControl> */}

          <Text>{t('filter-screen.age-label')}</Text>
          <HStack space={6} p={0} m={0}>
            <Box flex={1} top={'-20px'}>
              <FCSelect
                label={t('filter-screen.age-min-label')!}
                control={control}
                name="ageMin"
                error={errors?.ageMin?.message}
                PickerSelectProps={{
                  items: ageItems,
                }}
              />
            </Box>
            <Box flex={1} top={'-20px'}>
              <FCSelect
                label={t('filter-screen.age-max-label')!}
                control={control}
                name="ageMax"
                error={errors?.ageMax?.message}
                PickerSelectProps={{
                  items: ageItems,
                }}
              />
            </Box>
          </HStack>

          <FCCheckbox
            control={control}
            name="isOnlyWithPhoto"
            label={t('filter-screen.only-with-photo-label')!}
            error={errors?.isOnlyWithPhoto?.message}
          />
          <FCCheckbox
            control={control}
            name="friends"
            label={t('profile.friends-label')!}
            error={errors?.friends?.message}
          />
          <FCCheckbox
            label={t('filter-screen.can_move-label')!}
            control={control}
            name="can_move"
            error={errors?.can_move?.message}
          />
          <FCSelect
            label={t('filter-screen.is_agent-label')!}
            control={control}
            name="is_agent"
            error={errors?.is_agent?.message}
            PickerSelectProps={{
              items: [
                {
                  label: t(`filter-screen.is_agent-items.unset`),
                  value: 'unset',
                },
                {
                  label: t(`filter-screen.is_agent-items.yes`),
                  value: 'yes',
                },
                {
                  label: t(`filter-screen.is_agent-items.no`),
                  value: 'no',
                },
              ],
            }}
          />
          <NationPicker
            pickedValue={getValues('nation')}
            label={t('profile.nation-label')!}
            onChange={value => {
              nationController.field.onChange(value);
            }}
          />

          <GeoPicker
            variant="country"
            label={t('profile.country-label')!}
            pickedValue={getValues('country') || ''}
            onChange={({country}) => {
              countryController.field.onChange(country);
            }}
          />
          <GeoPicker
            variant="city"
            pickedValue={getValues('city') || ''}
            label={t('profile.city-label')!}
            onChange={({city}) => {
              cityController.field.onChange(city);
            }}
          />
          <FCSelect
            label={t('filter-screen.disability-label')!}
            control={control}
            name="disability"
            error={errors?.disability?.message}
            PickerSelectProps={{
              items: [
                {
                  label: t(`filter-screen.disability-items.unset`),
                  value: 'unset',
                },
                {
                  label: t(`filter-screen.disability-items.yes`),
                  value: 'yes',
                },
                {
                  label: t(`filter-screen.disability-items.no`),
                  value: 'no',
                },
              ],
            }}
          />
          <FCSelect
            label={t('profile.education-label')!}
            control={control}
            name="education"
            error={errors?.education?.message}
            PickerSelectProps={{
              items: educationItems,
            }}
          />
          <FCSelect
            label={t('profile.earn-label')!}
            control={control}
            name="earn"
            error={errors?.earn?.message}
            PickerSelectProps={{
              items: earnItems,
            }}
          />
          <FCSelect
            label={t('profile.marrige-label')!}
            control={control}
            name="marrige"
            error={errors?.marrige?.message}
            PickerSelectProps={{
              items: marrigeItems(props.targetUserGender),
            }}
          />
          <FCSelect
            label={t('profile.children-label')!}
            control={control}
            name="children"
            error={errors?.children?.message}
            PickerSelectProps={{
              items: [
                {
                  label: t('filter-screen.children-items.has-not'),
                  value: 'no',
                },
                {label: t('filter-screen.children-items.has'), value: 'yes'},
              ],
            }}
          />
          <FCSelect
            label={t('profile.religion-label')!}
            control={control}
            name="religion"
            error={errors?.religion?.message}
            PickerSelectProps={{
              items: religionItems,
            }}
          />
          <FCSelect
            label={t('profile.polygamy-label')!}
            control={control}
            name="polygamy"
            error={errors?.polygamy?.message}
            PickerSelectProps={{
              items: polygamyItems,
            }}
          />
          {props.targetUserGender === 'f' ? (
            <FCSelect
              label={t('profile.hidgab-label')!}
              control={control}
              name="hidgab"
              error={errors?.hidgab?.message}
              PickerSelectProps={{
                items: hidgabItems,
              }}
            />
          ) : null}
          {props.targetUserGender === 'm' ? (
            <FCSelect
              label={t('profile.wives-label')!}
              control={control}
              name="wives"
              error={errors?.wives?.message}
              PickerSelectProps={{
                items: wivesItems,
              }}
            />
          ) : null}

          <HStack space={3} mt={2}>
            <Button
              flex={1}
              variant="outline"
              colorScheme="secondary"
              onPress={() => {
                reset({
                  ageMin: null,
                  ageMax: null,
                  isOnlyWithPhoto: null,
                  country: null,
                  city: null,
                  can_move: null,
                  education: null,
                  marrige: null,
                  children: null,
                  religion: null,
                  polygamy: null,
                  hidgab: null,
                  wives: null,
                  is_agent: null,
                  nation: null,
                  disability: null,
                });
                props.onReset?.();
              }}>
              {t('filter-modal.clear')}
            </Button>
          </HStack>
        </VStack>
        <Box mb={10} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default FilterModalContent;
