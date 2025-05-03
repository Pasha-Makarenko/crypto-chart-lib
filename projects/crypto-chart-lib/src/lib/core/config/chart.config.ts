import { ChartOptions } from "../interfaces/options.interfaces"

export const defaultChartOptions: ChartOptions = {
  canvas: {
    width: 300,
    height: 150,
    padding: 20
  },
  tooltip: {
    enable: true,
    background: "#eee",
    radius: 15,
    offset: 15,
    padding: 15,
    text: {
      date: {
        size: 16,
        face: "Arial",
        color: "black"
      },
      value: {
        size: 16,
        face: "Arial",
        color: "black"
      }
    },
    point: {
      color: "black",
      radius: 5,
      border: 1.5
    },
    lines: {
      color: "black",
      width: 1,
      pattern: [1, 2]
    }
  },
  axios: {
    enable: true,
    count: 5,
    color: "black",
    width: 1,
    font: {
      size: 12,
      padding: 5,
      color: "black",
      face: "Arial"
    },
    dashed: {
      color: "black",
      width: 1,
      pattern: [1, 2]
    },
    sideText: {
      enable: true,
      radius: 10,
      growColor: "black",
      background: {
        start: "#aaa",
        end: "#aaa"
      },
      color: {
        start: "black",
        end: "black"
      }
    }
  },
  background: {
    color: "white"
  },
  lines: {
    colors: {
      up: "black",
      down: "black"
    },
    width: 1,
    gradient: {
      colors: {
        up: "black",
        down: "black"
      }
    }
  }
}