import React from 'react';
import {
  Line,
  Path,
  Svg,
  Circle,
  Rect,
  Defs,
  ClipPath,
  G,
} from 'react-native-svg';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize36,
  lignHeight20,
  lignHeight21,
  lignHeight26,
  lignHeight30,
  lignHeight32,
  lignHeight38,
  lignHeight43,
  Size12,
  Size17,
  Size20,
  Size25,
  Size40,
} from '../../constants/Sizes';

export const ArrowIosBackSvg = ({
  width = fontSize36,
  height = fontSize36,
  color = COLORS.black,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.704 17.704a1 1 0 0 1-1.408 0l-5-5a1 1 0 0 1 0-1.408l5-5a1 1 0 1 1 1.408 1.408L11.816 12l3.888 3.888a1 1 0 0 1 0 1.416z"
        fill={color}
      />
    </Svg>
  );
};

export const CheckCircleIcon = ({ size = Size20, color = '#34C759' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M7.0026 0.333008C3.33594 0.333008 0.335938 3.33301 0.335938 6.99967C0.335938 10.6663 3.33594 13.6663 7.0026 13.6663C10.6693 13.6663 13.6693 10.6663 13.6693 6.99967C13.6693 3.33301 10.6693 0.333008 7.0026 0.333008ZM5.66927 10.333L2.33594 6.99967L3.27594 6.05967L5.66927 8.44634L10.7293 3.38634L11.6693 4.33301L5.66927 10.333Z"
        fill={color}
      />
    </Svg>
  );
};
