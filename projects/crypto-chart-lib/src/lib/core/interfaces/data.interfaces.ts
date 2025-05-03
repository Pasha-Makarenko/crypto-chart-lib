export interface ChartData {
  timestamp: {
    from: number
    to: number
  }
  items: ChartDataItem[]
}

export interface ChartDataItem {
  value: number
}