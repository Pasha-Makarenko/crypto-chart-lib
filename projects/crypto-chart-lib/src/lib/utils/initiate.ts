export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object | undefined ? RecursivePartial<T[P]> :
      T[P]
}

export function initiate<T>(obj: RecursivePartial<T>, initial: T): T {
  const result: T = {} as T

  mask(obj, result, initial)

  return result
}

function mask(obj: any, ref: any, initial: any): void {
  for (const key of Object.keys(initial)) {
    if (!obj.hasOwnProperty(key)) {
      ref[key] = initial[key]
      continue
    }

    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      ref[key] = {}
      mask(obj[key], ref[key], initial[key])
    } else {
      ref[key] = obj[key]
    }
  }
}