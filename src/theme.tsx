import {extendTheme} from 'native-base';
import {Platform} from 'react-native';
import {setGlobalStyles as floatingLabelInputSetGlobalStyles} from 'react-native-floating-label-input';

export enum Font {
  InterThin = 'Inter-Thin',
  InterExtraLight = 'Inter-ExtraLight',
  InterLight = 'Inter-Light',
  InterRegular = 'Inter-Regular',
  InterMedium = 'Inter-Medium',
  InterSemiBold = 'Inter-SemiBold',
  InterBold = 'Inter-Bold',
  InterExtraBold = 'Inter-ExtraBold',
  InterBlack = 'Inter-Black',
}

const theme = extendTheme({
  fontConfig: {
    Inter: {
      100: {
        normal: Font.InterThin,
      },
      200: {
        normal: Font.InterExtraLight,
      },
      300: {
        normal: Font.InterLight,
      },
      400: {
        normal: Font.InterRegular,
      },
      500: {
        normal: Font.InterMedium,
      },
      600: {
        normal: Font.InterSemiBold,
      },
      700: {
        normal: Font.InterBold,
      },
      800: {
        normal: Font.InterExtraBold,
      },
      900: {
        normal: Font.InterBlack,
      },
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  components: {
    IconButton: {
      defaultProps: {
        _pressed: {
          backgroundColor: 'transparent',
        },
      },
    },
    Button: {
      defaultProps: {
        _text: {
          fontWeight: 700,
          fontSize: 16,
        },
        height: '48px',
      },
      variants: {
        solid: ({colorScheme}: Record<string, any>) => ({
          bg: `${colorScheme}.400`,
          _pressed: {
            bg: `${colorScheme}.600`,
          },
          _disabled: {
            // Не работает
            bg: `gray.600`,
          },
        }),
        ghost: ({colorScheme}: Record<string, any>) => ({
          _text: {
            color: colorScheme,
          },
        }),
        outline: ({colorScheme}: Record<string, any>) => ({
          borderColor: `${colorScheme}.400`,
          borderWidth: 2,
        }),
        elevated: () => ({
          shadowColor: 'grey.300',
          elevation: 2,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 1,
          bg: 'white',
          _text: {
            color: `gray.500`,
          },
          _pressed: {
            bg: `gray.200`,
          },
          _disabled: {
            bg: `gray.600`,
          },
        }),
      },
    },
    Spinner: {
      defaultProps: {
        color: 'primary.400',
        size: 'lg',
      },
    },
    Checkbox: {
      defaultProps: {
        _text: {
          fontSize: 16,
        },
        borderColor: 'gray.300',
        _checked: {
          backgroundColor: 'primary.400',
          borderColor: 'primary.400',
          _pressed: {
            backgroundColor: 'primary.400',
            borderColor: 'primary.400',
            opacity: 0.5,
          },
        },
        _pressed: {
          backgroundColor: 'primary.400',
          borderColor: 'primary.400',
          opacity: 0.5,
        },
      },
    },
    Select: {
      baseStyle: {
        borderBottomWidth: 1,
        borderColor: 'gray.300',
        borderWidth: 0,
        placeholderTextColor: 'gray.300',
        fontSize: 16,
        fontWeight: 500,
      },
    },
    Pressable: {
      defaultProps: {
        _pressed: {
          style: {
            opacity: 0.5,
          },
        },
      },
    },
    TextField: {
      defaultProps: {
        placeholderTextColor: 'gray.300',
        borderRadius: 0,
        paddingLeft: 0.01,
        bgColor: 'transparent',
        margin: Platform.select<number | string>({ios: 0, android: '0px'}),
        padding: Platform.select<number | string>({ios: 0, android: '0px'}),
        height: Platform.select<number | string>({ios: 200, android: '200px'}),
      },
      baseStyle: {
        fontSize: 16,
        fontWeight: 500,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'gray.300',
        margin: Platform.select<number | string>({ios: 0, android: '0px'}),
        padding: Platform.select<number | string>({ios: 0, android: '0px'}),
        height: Platform.select<number | string>({ios: 200, android: '200px'}),
      },
    },
  },
  colors: {
    primary: {
      25: '#F6FEF9',
      50: '#ECFDF3',
      100: '#D1FADF',
      200: '#A6F4C5',
      300: '#6CE9A6',
      400: '#32D583',
      500: '#12B76A',
      600: '#039855',
      700: '#027A48',
      800: '#05603A',
      900: '#054F31',
    },
    secondary: {
      25: '#FCFAFF',
      50: '#F9F5FF',
      100: '#F4EBFF',
      200: '#E9D7FE',
      300: '#D6BBFB',
      400: '#B692F6',
      500: '#9E77ED',
      600: '#7F56D9',
      700: '#6941C6',
      800: '#53389E',
      900: '#42307D',
    },
    gray: {
      25: '#FCFCFD',
      50: '#F9FAFB',
      100: '#F2F4F7',
      200: '#E4E7EC',
      300: '#D0D5DD',
      400: '#98A2B3',
      500: '#667085',
      600: '#475467',
      700: '#344054',
      800: '#1D2939',
      900: '#101828',
    },
    blue: {
      25: '#F5FAFF',
      50: '#EFF8FF',
      100: '#D1E9FF',
      200: '#B2DDFF',
      300: '#84CAFF',
      400: '#53B1FD',
      500: '#2E90FA',
      600: '#1570EF',
      700: '#175CD3',
      800: '#1849A9',
      900: '#194185',
    },
  },
});

floatingLabelInputSetGlobalStyles.containerStyles = {
  borderTopWidth: 0,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 1,
  borderRadius: 0,
  paddingBottom: 5,
  borderColor: theme.colors.gray[300],
};
floatingLabelInputSetGlobalStyles.customLabelStyles = {
  colorFocused: theme.colors.gray[400],
  colorBlurred: theme.colors.gray[400],
  leftFocused: 0,
  leftBlurred: 0.1,
};
floatingLabelInputSetGlobalStyles.labelStyles = {
  top: 12,
  color: theme.colors.black,
  fontFamily: theme.fontConfig.Inter[500].normal,
};
floatingLabelInputSetGlobalStyles.inputStyles = {
  paddingTop: 17,
  paddingBottom: 0,
  color: theme.colors.black,
  fontFamily: theme.fontConfig.Inter[500].normal,
};

export default theme;

export const DefaultConfigs = {
  typography: {
    fontFamily: {
      light: Font.InterLight,
      medium: Font.InterMedium,
      regular: Font.InterRegular,
      semiBold: Font.InterSemiBold,
      bold: Font.InterBold,
      extraBold: Font.InterExtraBold,
    },
    sizes: {
      h1: {
        size: 38,
        lineHeight: 44,
      },
      h2: {
        size: 32,
        lineHeight: 36,
      },
      h3: {
        size: 24,
        lineHeight: 30,
      },
      large: {
        size: 18,
        lineHeight: 26,
      },
      regular: {
        size: 16,
        lineHeight: 18,
      },
      small: {
        size: 14,
        lineHeight: 20,
      },
    },
  },
};
