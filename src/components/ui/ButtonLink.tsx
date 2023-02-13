import {IPressableProps, ITextProps, Pressable, Text} from 'native-base';
import React from 'react';

export interface ButtonLinkProps extends IPressableProps {
  TextProps?: ITextProps;
}

function ButtonLink(props: ButtonLinkProps) {
  const {TextProps, children, ...PressableProps} = props;
  return (
    <Pressable {...PressableProps}>
      <Text color="primary.400" fontWeight={600} {...TextProps}>
        {children ? <>{children}</> : null}
      </Text>
    </Pressable>
  );
}

export default ButtonLink;
