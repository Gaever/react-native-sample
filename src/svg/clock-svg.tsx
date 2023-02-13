import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function ClockSvg(props: SvgProps) {
  return (
    <Svg
      // xmlns="http://www.w3.org/2000/svg"
      style={{
        marginLeft: 5,
      }}
      fill="#cdcdcd"
      width={10}
      height={10}
      viewBox="0 0 6.03 5.926"
      {...props}>
      <Path
        data-name="Caminho 7"
        d="M22.17 21.5a.669.669 0 00-.67.658v4.609a.669.669 0 00.67.658h4.69a.669.669 0 00.67-.658v-4.609a.669.669 0 00-.67-.658zm0 .658h4.69v4.609h-4.69zm2.01.658v2.306l1.979.005v-.579H24.85v-1.731z"
        transform="translate(-21.5 -21.5)"
      />
    </Svg>
  );
}

export default ClockSvg;
