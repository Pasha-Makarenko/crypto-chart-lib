export interface Range {
  min: number
  max: number
}

export const range = (array: number[]) => {
  const range: Range = {
    min: Infinity,
    max: -Infinity
  }

  for (const item of array) {
    if (item > range.max) {
      range.max = item
    }

    if (item < range.min) {
      range.min = item
    }
  }

  return range
}