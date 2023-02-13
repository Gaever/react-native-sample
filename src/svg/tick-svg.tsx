import * as React from 'react';
import Svg, {G, Path, SvgProps} from 'react-native-svg';

function TickSvg(props: SvgProps) {
  return (
    <Svg
      // className="tick"
      // xmlns="http://www.w3.org/2000/svg"
      fill="#c6c6c6"
      width={15}
      height={10}
      viewBox="0 0 11.316 6.108"
      {...props}>
      <G data-name="Tick">
        <Path
          // className="tick1"
          data-name={1}
          d="M19.176 48.7a.707.707 0 00-.977 0l-4.245 4.245-1.684-1.68a.686.686 0 00-.488-.2.691.691 0 00-.487 1.179l2.173 2.169a.691.691 0 00.977 0l4.733-4.733a.691.691 0 000-.977z"
          transform="translate(-8.063 -48.506)"
        />
        <Path
          // className="tick2"
          data-name={2}
          d="M16.147 48.7a.707.707 0 00-.977 0l-4.245 4.245-1.684-1.68a.686.686 0 00-.488-.2.691.691 0 00-.487 1.179l2.173 2.169a.691.691 0 00.977 0l4.733-4.733a.691.691 0 000-.977z"
          transform="translate(-8.063 -48.506)"
        />
      </G>
    </Svg>
  );
}

export default TickSvg;
