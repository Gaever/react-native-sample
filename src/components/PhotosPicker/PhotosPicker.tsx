import {Actionsheet, Box, IBoxProps} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {ImageItem} from '~src/types';
import PhotoGrid from './PhotoGrid';

export interface PhotosPickerProps extends IBoxProps {
  items: ImageItem[];
  isAssetUploading?: boolean;
  onDragStart?: () => void;
  onDragRelease?: () => void;
  onImageAdd: (image: Asset) => void;
  onImageUpdate: (itemIndex: number, image: Asset) => void;
  onImageRemove: (itemIndex: number) => void;
}

function PhotosPicker(props: PhotosPickerProps) {
  const {
    onDragRelease,
    onDragStart,
    items: propsItems,
    onImageAdd: onItemPress,
    ...boxProps
  } = props;
  const [items, setItems] = useState(propsItems);
  const {t} = useTranslation();
  const [updatingItemIndex, setUpdatingItemIndex] = useState<
    number | undefined
  >(undefined);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const handleSetImage = useCallback(
    (res: ImagePickerResponse) => {
      const asset = res.assets![0];
      if (updatingItemIndex !== undefined) {
        const newItems = items.map((item, index) =>
          index === updatingItemIndex ? {uri: null, isLoading: true} : item,
        );
        setItems(newItems);
        props.onImageUpdate?.(updatingItemIndex!, asset);
      } else {
        const newItems = [...items, {uri: null, isLoading: true}];

        setItems(newItems);
        props.onImageAdd?.(asset);
      }
    },
    [props.onImageAdd, setItems, items, updatingItemIndex],
  );

  const handleCameraCapture = useCallback(async () => {
    const res = await launchCamera({
      mediaType: 'photo',
      cameraType: 'front',
    });
    if (res.assets) {
      handleSetImage(res);
    } else if (!res.didCancel) {
      Alert.alert(t('components.photo-picker.camera-unavailable'));
    }
    setIsActionSheetOpen(false);
  }, [
    props.onImageAdd,
    setIsActionSheetOpen,
    setItems,
    items,
    updatingItemIndex,
  ]);

  const handleGalleryCapture = useCallback(async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 1,
    });
    if (res.assets) {
      handleSetImage(res);
    } else if (!res.didCancel) {
      Alert.alert(t('components.photo-picker.gallery-unavailable'));
    }
    setIsActionSheetOpen(false);
  }, [
    props.onImageAdd,
    setIsActionSheetOpen,
    setItems,
    items,
    updatingItemIndex,
  ]);

  const handleRemoveItem = useCallback(() => {
    if (updatingItemIndex !== undefined) {
      const newItems = [...items].filter(
        (_, index) => index !== updatingItemIndex,
      );
      setItems(newItems);
      props.onImageRemove(updatingItemIndex);
    }
    setIsActionSheetOpen(false);
  }, [props.onImageAdd, setItems, items, updatingItemIndex]);

  useEffect(() => {
    setItems(propsItems);
  }, [propsItems]);

  return (
    <Box flex={1} {...boxProps}>
      <PhotoGrid
        numOfCols={3}
        numOfRows={2}
        items={items}
        onChangeItemPress={item => {
          setUpdatingItemIndex(item);
          setIsActionSheetOpen(true);
        }}
        onAddItemPress={() => {
          setUpdatingItemIndex(undefined);
          setIsActionSheetOpen(true);
        }}
      />
      <Actionsheet
        isOpen={isActionSheetOpen}
        onClose={() => {
          setUpdatingItemIndex(undefined);
          setIsActionSheetOpen(false);
        }}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={handleCameraCapture}>
            {t('components.photo-picker.camera')}
          </Actionsheet.Item>
          <Actionsheet.Item onPress={handleGalleryCapture}>
            {t('components.photo-picker.gallery')}
          </Actionsheet.Item>
          {updatingItemIndex !== undefined ? (
            <Actionsheet.Item
              onPress={handleRemoveItem}
              _text={{color: 'red.400'}}>
              {t('components.photo-picker.remove')}
            </Actionsheet.Item>
          ) : null}
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
}

export default PhotosPicker;
