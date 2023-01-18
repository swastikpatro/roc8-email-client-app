const modifyIfSingleDigit = (num: number): string | number => {
  return num < 10 ? `0${num}` : num;
};

const getHours = (hourIn24Format: number) => {
  let daySession;
  let hrs;

  if (hourIn24Format < 12) {
    hrs = hourIn24Format;
    daySession = 'am';
  } else {
    hrs = 24 - hourIn24Format;
    daySession = 'pm';
  }

  hrs = modifyIfSingleDigit(hrs);

  return [hrs, daySession];
};

const getDateFormat = (ms: number) => {
  const date = new Date(ms);

  const month = modifyIfSingleDigit(date.getMonth() + 1);
  const [hour, daySession] = getHours(date.getHours());
  const minutes = modifyIfSingleDigit(date.getMinutes());

  const time = `${hour}:${minutes}${daySession}`;
  const outputDate = `${date.getDate()}/${month}/${date.getFullYear()} ${time}`;

  return outputDate;
};

export default getDateFormat;
