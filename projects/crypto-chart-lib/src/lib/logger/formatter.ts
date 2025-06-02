import { JSONLogData, LoggerData, LogOptions } from "./types"

export class Formatter {
  constructor(private options: LogOptions) {
  }

  format(data: LoggerData) {
    if (this.options.addTimestamp && !data?.date) {
      data.date = new Date()
    }

    switch (this.options.format) {
      case "string":
        return this.toString(data)
      case "json":
        return this.toJson(data)
    }
  }

  private toTimestamp(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  private toString(data: LoggerData) {
    const { level, addTimestamp } = this.options
    const { args, error, result, date, spendTime, propertyKey } = data
    const lines: string[] = []

    if (level === "error") {
      lines.push(`Error in ${propertyKey}${spendTime ? ` (spend time ${spendTime}ms)` : ""}: ${error?.message}`)
    } else if (level === "info") {
      lines.push(`Arguments for ${propertyKey}: ${JSON.stringify(args)}`)
      lines.push(`Result of ${propertyKey}${spendTime ? ` (spend time ${spendTime}ms)` : ""}: ${JSON.stringify(result)}`)
    }

    if (addTimestamp) {
      const timestamp = `[${this.toTimestamp(date!)}]`
      for (let i = 0; i < lines.length; i++) {
        lines[i] = timestamp + " " + lines[i]
      }
    }

    return lines.join("\n")
  }

  private toJson(data: LoggerData) {
    const { level, addTimestamp } = this.options
    const { args, error, result, date, spendTime, propertyKey } = data

    const output: JSONLogData = { level, propertyKey }

    if (addTimestamp) {
      output.timestamp = this.toTimestamp(date!)
    }

    if (spendTime) {
      output.spendTime = spendTime + "ms"
    }

    if (level === "error") {
      output.error = error?.message
    } else if (level === "info") {
      output.args = args
      output.result = result
    }

    return JSON.stringify(output)
  }
}