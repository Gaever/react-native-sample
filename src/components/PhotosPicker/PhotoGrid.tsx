import {Box, HStack, Pressable, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import PhotoItem from './PhotoItem';
import {ImageItem} from '~src/types';
import uuid from 'react-native-uuid';

export interface PhotoGridProps {
  items: ImageItem[];
  numOfCols: number;
  numOfRows: number;
  onChangeItemPress: (itemIndex: number) => void;
  onAddItemPress: () => void;
}

function PhotoGrid(props: PhotoGridProps) {
  const [keyId] = useState(uuid.v4());

  return (
    <Box>
      {Array.from({length: props.numOfRows}).map((_, rowIndex) => (
        <VStack key={`${keyId}-${rowIndex}`} space={3}>
          <HStack space={3}>
            {Array.from({length: props.numOfCols}).map((_, colIndex) => {
              const itemIndex = props.numOfCols * rowIndex + colIndex;
              const imageItem: ImageItem | undefined = props.items?.[itemIndex];
              const showAddButton =
                itemIndex === 0 || !!props.items[itemIndex - 1]?.uri;

              return (
                <Pressable
                  disabled={
                    (!imageItem?.uri && !showAddButton) || imageItem?.isLoading
                  }
                  flex={1}
                  key={`${keyId}-${rowIndex}-${colIndex}`}
                  onPress={() => {
                    if (imageItem) {
                      props.onChangeItemPress(itemIndex);
                    } else {
                      props.onAddItemPress();
                    }
                  }}>
                  <PhotoItem
                    image={imageItem?.uri ?? null}
                    isLoading={imageItem?.isLoading}
                    showAddButton={showAddButton}
                  />
                </Pressable>
              );
            })}
          </HStack>
          <HStack></HStack>
        </VStack>
      ))}
    </Box>
  );
}

export default PhotoGrid;
