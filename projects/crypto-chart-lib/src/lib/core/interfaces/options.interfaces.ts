export interface ChartOptions {
  canvas: {
    width: number
    height: number
    padding: number
  }
  axios: {
    enable: boolean
    count: number
    color: string
    width: number
    font: {
      size: number
      face: string
      color: string
      padding: number
    }
    dashed: {
      color: string
      width: number
      pattern: [number, number]
    }
    sideText: {
      enable: boolean
      radius: number
      growColor: string
      background: {
        start: string
        end: string
      }
      color: {
        start: string
        end: string
      }
    }
  }
  tooltip: {
    enable: boolean
    background: string
    radius: number
    offset: number
    padding: number
    text: {
      date: {
        size: number
        face: string
        color: string
      }
      value: {
        size: number
        face: string
        color: string
      }
    }
    point: {
      color: string
      radius: number
      border: number
    }
    lines: {
      color: string
      width: number
      pattern: [number, number]
    }
  }
  lines: {
    colors: {
      up: string
      down: string
    }
    width: number
    gradient: {
      colors: {
        up: string
        down: string
      }
    }
  }
  background: {
    color: string
  }
}