import { AsyncFunction, DescriptorContext } from "./types"

export class Descriptor {
  private self: unknown

  constructor(private context: DescriptorContext) {
  }

  public value(self: unknown, ...args: any[]) {
    this.self = self

    if (this.context.originalMethod instanceof AsyncFunction) {
      return this.asyncValue(...args)
    } else {
      return this.syncValue(...args)
    }
  }

  private syncValue(...args: any[]) {
    const { options, logger, propertyKey, originalMethod } = this.context

    try {
      const result = originalMethod.apply(this.self, args)

      if (options.level === "info") {
        logger.log({ propertyKey, args, result })
      }

      return result
    } catch (error: unknown) {
      if (options.level === "error" && error instanceof Error) {
        logger.log({ propertyKey, error })
        return
      }
      throw error
    }
  }

  private async asyncValue(...args: any[]) {
    const { options, logger, propertyKey, originalMethod } = this.context
    const start = Date.now()
    let end

    try {
      const result = await originalMethod.apply(this.self, args)
      end = Date.now()

      if (options.level === "info") {
        logger.log({ propertyKey, args, result, spendTime: end - start })
      }

      return result
    } catch (error: unknown) {
      end = Date.now()

      if (options.level === "error" && error instanceof Error) {
        logger.log({ propertyKey, error, spendTime: end - start })
        return
      }
      throw error
    }
  }
}