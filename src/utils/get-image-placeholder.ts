import man1 from '~src/assets/avatar-placeholder/man-1-base64';
import man2 from '~src/assets/avatar-placeholder/man-2-base64';
import man3 from '~src/assets/avatar-placeholder/man-3-base64';
import man4 from '~src/assets/avatar-placeholder/man-4-base64';
import man5 from '~src/assets/avatar-placeholder/man-5-base64';
import man6 from '~src/assets/avatar-placeholder/man-6-base64';
import man7 from '~src/assets/avatar-placeholder/man-7-base64';
import man8 from '~src/assets/avatar-placeholder/man-8-base64';
import man9 from '~src/assets/avatar-placeholder/man-9-base64';

import woman1 from '~src/assets/avatar-placeholder/woman-1-base64';
import woman2 from '~src/assets/avatar-placeholder/woman-2-base64';
import woman3 from '~src/assets/avatar-placeholder/woman-3-base64';
import woman4 from '~src/assets/avatar-placeholder/woman-4-base64';
import woman5 from '~src/assets/avatar-placeholder/woman-5-base64';
import woman6 from '~src/assets/avatar-placeholder/woman-6-base64';
import woman7 from '~src/assets/avatar-placeholder/woman-7-base64';
import woman8 from '~src/assets/avatar-placeholder/woman-8-base64';
import woman9 from '~src/assets/avatar-placeholder/woman-9-base64';

import _random from 'lodash/random';

function getImagePlaceholder(
  variant: 'm' | 'f',
  avatarNumber?: number,
): [string, number] {
  const pickedNumber = avatarNumber ?? _random(0, 8, false);
  let img;
  if (variant === 'm') {
    img = [man1, man2, man3, man4, man5, man6, man7, man8, man9][pickedNumber];
  }

  img = [
    woman1,
    woman2,
    woman3,
    woman4,
    woman5,
    woman6,
    woman7,
    woman8,
    woman9,
  ][pickedNumber];

  return [img, pickedNumber];
}

export default getImagePlaceholder;
