import * as React from 'react';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  SvgProps,
} from 'react-native-svg';

function MirLogoSvg(props: SvgProps) {
  return (
    <Svg
      width={111}
      height={30}
      viewBox="0 0 111 30"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.372.005c.983-.006 3.903-.269 5.14 3.906.833 2.812 2.16 7.418 3.982 13.818h.741a2744.611 2744.611 0 014.026-13.818C25.51-.307 28.634.005 29.884.005h9.643V30h-9.828V12.323h-.659L23.562 30h-7.395L10.69 12.31h-.66V30H.203V.005h10.17zm43.267 0v17.69h.784l6.664-14.546C62.381.254 65.138.005 65.138.005h9.51V30H64.617V12.31h-.785l-6.533 14.546C56.004 29.738 53.117 30 53.117 30h-9.51V.005h10.032zm55.688 14.254c-1.399 3.966-5.794 6.806-10.66 6.806H88.145V30h-9.54V14.259h30.722z"
        fill="#0F754E"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M99.127.005H78.105c.5 6.678 6.25 12.395 12.204 12.395h19.682C111.126 6.85 107.216.005 99.127.005z"
        fill="url(#paint0_linear_15_1720)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_15_1720"
          x1={110.184}
          y1={7.80189}
          x2={78.1045}
          y2={7.80189}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1F5CD7" />
          <Stop offset={1} stopColor="#02AEFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default MirLogoSvg;
