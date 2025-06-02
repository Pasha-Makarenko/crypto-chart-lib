import { defaultLogOptions, LogOptions } from "./types"
import { initiate, RecursivePartial } from "../utils/initiate"
import { Logger } from "./logger"
import { Descriptor } from "./descriptor"

export function log(_opt: RecursivePartial<LogOptions> = defaultLogOptions) {
  const options = initiate(_opt, defaultLogOptions)

  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const desc = new Descriptor({
      options,
      logger: new Logger(options),
      target,
      propertyKey,
      originalMethod: descriptor.value
    })

    descriptor.value = function(...args: any[]) {
      return desc.value(this, ...args)
    }

    return descriptor
  }
}

class Calc {
  @log({ type: "file" })
  sum(a: number, b: number) {
    return a + b
  }

  @log({ level: "error" })
  product(a: number, b: number) {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new Error("args must be a numbers")
    }

    return a * b
  }
}

class Todos {
  @log({ format: "json" })
  async getData() {
    const result = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(res => res.json())

    return result
  }

  @log({ level: "error" })
  async getError() {
    const result = await fetch("wrong_url").then(res => res.json())

    return result
  }
}



const calc = new Calc()
calc.sum(2, 3)
calc.product(2, "" as never as number)

const todos = new Todos()
todos.getData()
todos.getError()