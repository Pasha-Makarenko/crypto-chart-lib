# crypto-chart-lib

Library for drawing crypto charts

---

## Usage

Install package

```bash
npm install --save crypto-chart-lib
```

Add to your angular app

```ts
import { CryptoChartComponent, ChartData, ChartOptions, RecursivePartial } from "crypto-chart-lib"

@Component({
  selector: "app-root",
  imports: [CryptoChartComponent],
  templateUrl: `<crypto-chart [data]="data" [options]="options" />`
})
export class AppComponent {
  title = "demo-app"
  data: ChartData = {
    items,
    timestamp: {
      from: Date.now() - 24 * 60 * 60 * 1000,
      to: Date.now()
    }
  }
  options: RecursivePartial<ChartOptions> = {}
}
```

---

## Interfaces

```ts
interface ChartData {
  timestamp: {
    from: number
    to: number
  }
  items: ChartDataItem[]
}

interface ChartDataItem {
  value: number
}

interface ChartOptions {
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
```