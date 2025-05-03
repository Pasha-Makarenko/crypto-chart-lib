import { inject, Injectable } from "@angular/core"
import { ChartData } from "../../interfaces/data.interfaces"
import { getCanvasScreen, setCanvasScreen } from "../../../utils/canvasScreen"
import { Store } from "../../store/store"
import { DataCacheService } from "../../../cache/data-cache.service"
import { DrawLinesService } from "./draw-lines.service"
import { DrawAxiosService } from "./draw-axios.service"
import { CalculateConstantsService } from "../calculate/calculate-constants.service"

@Injectable({
  providedIn: "root"
})
export class DrawStaticService {
  private store = inject(Store)
  private cache = inject(DataCacheService)
  private drawLineService = inject(DrawLinesService)
  private drawAxiosService = inject(DrawAxiosService)
  private calculateConstantsService = inject(CalculateConstantsService)

  draw(data: ChartData) {
    if (!this.store.options) {
      return
    }

    const canvasScreen = this.cache.get("canvasScreen")
    const { axios } = this.store.options

    if (canvasScreen && this.store.canvas) {
      setCanvasScreen(this.store.canvas, canvasScreen)
      return
    }

    this.cache.clear("canvasScreen")

    this.calculateConstantsService.staticConstants()

    this.clear()

    if (axios.enable) {
      this.drawAxiosService.draw()
    }

    this.drawLineService.draw(data)

    if (axios.enable && axios.sideText.enable) {
      const startValue = data.items[0].value
      const endValue = data.items[data.items.length - 1].value
      const endColor = endValue > startValue ? "up" : endValue < startValue ? "down" : undefined

      this.drawAxiosService.drawSideText("start", startValue)
      this.drawAxiosService.drawSideText("end", endValue, endColor)
    }

    if (this.store.canvas) {
      this.cache.set("canvasScreen", getCanvasScreen(this.store.canvas))
    }
  }

  clear() {
    const { canvas, options } = this.store
    const ctx = canvas?.getContext("2d")

    if (canvas && ctx && options) {
      ctx.fillStyle = options.background.color
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }
}