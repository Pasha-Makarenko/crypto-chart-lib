export const parseDate = (value: number) => {
  const date = new Date(value)

  return ({
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes()
  })
}