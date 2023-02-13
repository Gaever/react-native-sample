import {
  AspectRatio,
  Box,
  Center,
  Circle,
  Icon,
  Image,
  Spinner,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface PhotoItemProps {
  image: string | undefined | null;
  isLoading?: boolean;
  showAddButton: boolean;
}

function PhotoItem(props: PhotoItemProps) {
  return (
    <AspectRatio ratio={{base: 3 / 4}} flex={1}>
      <Box>
        {props.image ? (
          <>
            <Image
              height="100%"
              width="100%"
              borderRadius="lg"
              source={{uri: props.image}}
              alt="img"
              resizeMode="cover"
            />
            <Box>
              <Circle
                position="absolute"
                size={30}
                bg="white"
                zIndex={1}
                shadow={2}
                bottom={-5}
                right={-5}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="plus-thick"
                  color="red.300"
                  style={{
                    transform: [{rotate: '45deg'}],
                  }}
                />
              </Circle>
            </Box>
          </>
        ) : (
          <>
            <Box
              flex={1}
              bg="gray.100"
              borderRadius="lg"
              borderWidth={2}
              borderColor="gray.200"
              borderStyle="dashed"></Box>
            {props.showAddButton && !props.isLoading ? (
              <Circle
                position="absolute"
                size={30}
                bg="primary.300"
                zIndex={1}
                shadow={2}
                bottom={-5}
                right={-5}>
                <Icon
                  as={MaterialCommunityIcons}
                  name="plus-thick"
                  color="white"
                />
              </Circle>
            ) : null}
          </>
        )}
        {props.isLoading ? (
          <Box
            position="absolute"
            w="100%"
            h="100%"
            bg="black"
            borderWidth={2}
            opacity={0.3}
            borderRadius="lg">
            <Center flex={1}>
              <Spinner color="white" size="sm" />
            </Center>
          </Box>
        ) : null}
      </Box>
    </AspectRatio>
  );
}

export default PhotoItem;
