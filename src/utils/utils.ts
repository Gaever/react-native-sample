import moment from 'moment';
import {User} from '~src/types';
import localTime from './local-time';

export function getIsOnline(user: User | undefined) {
  if (!(user?.show_online ?? true)) {
    return false;
  }
  const lastSeen = localTime(user?.last_seen);
  if (!lastSeen) return false;
  const now = moment().utc();

  const t1 = lastSeen.toDate().getTime();
  const t2 = now.toDate().getTime();
  const m3 = 60 * 3;
  const diff = (t2 - t1) / 1000;
  const isOnline = diff < m3;
  return isOnline;
}
