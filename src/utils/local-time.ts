import moment from 'moment';

function localTime(date?: Date | undefined) {
  return moment(date).add(moment().utcOffset(), 'minutes');
}

export default localTime;
