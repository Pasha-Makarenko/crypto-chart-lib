import { indexOfMin } from "./indexOf"

export const roundedList = (min: number, max: number, divider: number) => {
  let result = []
  const digits = digitsOfNumber(max - min)
  const center = Math.round((max + min) / (2 * Math.pow(10, digits - 1))) * Math.pow(10, digits - 1)

  const tempStep = (max - min) / divider
  const tempPow10Abs = Math.pow(10, Math.abs(digitsOfNumber(tempStep) - 1))
  let step = Math.round(tempStep * tempPow10Abs) / tempPow10Abs
  const stepDigits = digitsOfNumber(step) - 1
  const pow10 = Math.pow(10, stepDigits)
  const pow10Abs = Math.pow(10, Math.abs(stepDigits))

  const closestStep = ROUNDED_NUMBERS.map(number => Math.abs(number * pow10 - step))
  step = ROUNDED_NUMBERS[indexOfMin(closestStep).index] * pow10

  if (step < 1) {
    step = Math.round(step * pow10Abs) / pow10Abs
  }

  let currentStep = 0

  while (center + step * currentStep > min) {
    currentStep--
  }

  while (center + step * (currentStep - 1) < max) {
    result.push(center + step * currentStep)
    currentStep++
  }

  if (step < 1) {
    result = result.map(number => Math.round(number * pow10Abs) / pow10Abs)
  }

  return result
}

const ROUNDED_NUMBERS = [1, 2, 4, 5, 8, 10]

const digitsOfNumber = (value: number) => Math.ceil(Math.log10(value) + 1) - 1