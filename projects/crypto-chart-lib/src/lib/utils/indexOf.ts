export const indexOfMin = (array: number[]) => {
  let min = Infinity
  let index = -1

  for (let i = 0; i < array.length; i++) {
    if (array[i] < min) {
      min = array[i]
      index = i
    }
  }

  return { min, index }
}

export const indexOfMax = (array: number[]) => {
  let max = -Infinity
  let index = -1

  for (let i = 0; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i]
      index = i
    }
  }

  return { max, index }
}