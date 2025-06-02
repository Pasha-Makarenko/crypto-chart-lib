import { LoggerData, LogOptions } from "./types"
import { Formatter } from "./formatter"
import { appendFileSync } from "node:fs"

export class Logger {
  private formatter: Formatter

  constructor(private options: LogOptions) {
    this.formatter = new Formatter(options)
  }

  log(data: LoggerData) {
    const formattedMessage = this.formatter.format(data)

    switch (this.options.type) {
      case "console":
        this.logConsole(formattedMessage)
        break
      case "file":
        this.writeFile(formattedMessage)
        break
    }
  }

  private logConsole(message: string) {
    console[this.options.level](message)
  }

  private writeFile(message: string) {
    appendFileSync(this.options.output, message + "\n")
  }
}