import moment from 'moment';

export function daysBetweenDates(date1: string, date2: string) {
  // Create moment objects for each date
  const firstDate = moment(date1);
  const secondDate = moment(date2);

  // Calculate the difference in days
  const differenceInDays = secondDate.diff(firstDate, 'days');

  return differenceInDays;
}

export function addDaysToDate(date: string, days: number) {
  // Create a moment object for the given date
  const specificDate = moment(date, 'YYYY-MM-DD');

  // Add the specified number of days
  const futureDate = specificDate.add(days, 'days');

  // Return the new date in a readable format
  return futureDate.format('YYYY-MM-DD');
}
