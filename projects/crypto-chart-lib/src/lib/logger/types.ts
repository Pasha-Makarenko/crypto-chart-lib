import { Logger } from "./logger"

export const AsyncFunction = (async () => {
}).constructor

export type LogLevel = "info" | "error"
export type LogType = "console" | "file"
export type LogFormat = "string" | "json"

export interface LogOptions {
  level: LogLevel
  format: LogFormat
  type: LogType
  output: string
  addTimestamp: boolean
}

export const defaultLogOptions: LogOptions = {
  level: "info",
  format: "string",
  type: "console",
  output: "output.txt",
  addTimestamp: true
}

export interface LoggerData {
  propertyKey: string
  args?: any[] | undefined
  result?: any
  error?: Error
  spendTime?: number
  date?: Date
}

export interface DescriptorContext {
  options: LogOptions
  logger: Logger
  target: any
  propertyKey: string
  originalMethod: PropertyDescriptor["value"]
}

export interface JSONLogData {
  level: LogLevel
  propertyKey: string
  args?: any[] | undefined
  result?: any
  error?: string
  timestamp?: string
  spendTime?: string
}