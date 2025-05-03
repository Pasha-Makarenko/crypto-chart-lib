import { AfterViewInit, Component, effect, ElementRef, inject, input, ViewChild } from "@angular/core"
import { ChartData } from "../interfaces/data.interfaces"
import { Store } from "../store/store"
import { ChartOptions } from "../interfaces/options.interfaces"
import { initiate, RecursivePartial } from "../../utils/initiate"
import { TooltipService } from "../services/render/tooltip.service"
import { DrawStaticService } from "../services/render/draw-static.service"
import { defaultChartOptions } from "../config/chart.config"

@Component({
  selector: "crypto-chart",
  imports: [],
  template: `
    <canvas
      [width]="options().canvas?.width || defaultChartOptions.canvas.width"
      [height]="options().canvas?.height || defaultChartOptions.canvas.height"
      #cryptoChart
      (mousemove)='store.options?.tooltip?.enable && tooltipService.moveMoveHandler($event)'
      (mouseleave)='store.options?.tooltip?.enable && tooltipService.mouseLiveHandler()'
    ></canvas>`
})
export class CryptoChartComponent implements AfterViewInit {
  store = inject(Store)
  drawStaticService = inject(DrawStaticService)
  tooltipService = inject(TooltipService)

  @ViewChild("cryptoChart", { static: true }) canvas!: ElementRef
  data = input.required<ChartData>()
  // @ts-ignore
  options = input<RecursivePartial<ChartOptions>>(defaultChartOptions, {
    transform: (value: RecursivePartial<ChartOptions>) => initiate<ChartOptions>(value, defaultChartOptions)
  })

  constructor() {
    effect(() => {
      this.store.data$.next(this.data())
      this.store.setOptions(this.options() as ChartOptions)
    })
  }

  ngAfterViewInit() {
    this.store.setCanvas(this.canvas.nativeElement)

    this.store.data$.subscribe(value => {
      if (!value) {
        return
      }

      this.drawStaticService.draw(value)
    })
  }

  protected readonly defaultChartOptions = defaultChartOptions
}
