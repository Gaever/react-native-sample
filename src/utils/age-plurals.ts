import {i18n} from 'i18next';
import moment from 'moment';

export function agePlurals(t: i18n['t'], birthday: Date, addText?: boolean) {
  if (!birthday || typeof birthday !== 'object') return '';
  const age = moment().diff(birthday, 'years');

  const ageStr = `${age}`;
  const lastDigit = ageStr[ageStr.length - 1];
  if (addText || addText === undefined) {
    return `${age} ${t(`age-plurals.${lastDigit}`)}`;
  }
  return `${age}`;
}
