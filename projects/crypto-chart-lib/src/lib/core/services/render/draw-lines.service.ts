import { inject, Injectable } from "@angular/core"
import { ChartData } from "../../interfaces/data.interfaces"
import { Store } from "../../store/store"
import { CalculateConstantsService } from "../calculate/calculate-constants.service"
import { DataCacheService } from "../../../cache/data-cache.service"

@Injectable({
  providedIn: "root"
})
export class DrawLinesService {
  private store = inject(Store)
  private cache = inject(DataCacheService)
  private calculateStaticService = inject(CalculateConstantsService)

  draw(data: ChartData) {
    const { canvas, options } = this.store
    const xStep = this.cache.get("xStep")
    const axiosSidebarWidth = this.cache.get("axiosSidebarWidth")

    if (!canvas || !options) {
      return
    }

    const { background } = options
    const { width, gradient: linesGradient, colors } = options.lines

    const ctx = canvas.getContext("2d")!

    ctx.setLineDash([])

    ctx.beginPath()
    let gradient: CanvasGradient | null = null
    const levelY = data.items[0].value
    const levelYPos = this.calculateStaticService.yPos(levelY)
    let dir = Math.sign(data.items[1].value - levelY)
    let dirIndex = 2

    while (dir === 0 && dirIndex < data.items.length) {
      dir = Math.sign(data.items[dirIndex].value - levelY)
      dirIndex++
    }

    let valueNext = levelY
    let pointNext = {
      x: 0,
      y: levelYPos
    }

    ctx.moveTo(pointNext.x, pointNext.y)

    for (let i = 0; i < data.items.length; i++) {
      const value = valueNext
      const point = pointNext

      ctx.lineTo(point.x, point.y)

      if (i !== data.items.length - 1) {
        valueNext = data.items[i + 1].value
        pointNext = {
          x: point.x + xStep,
          y: this.calculateStaticService.yPos(valueNext)
        }

        if (
          (value > levelY) && (valueNext < levelY) ||
          (value < levelY) && (valueNext > levelY) ||
          (value === levelY) && (valueNext < levelY) && (dir === 1) ||
          (value === levelY) && (valueNext > levelY) && (dir === -1)
        ) {
          const level = this.calculateStaticService.intersection(point, pointNext)!
          ctx.lineTo(level.x, level.y)

          ctx.strokeStyle = colors[dir === 1 ? "up" : "down"]
          ctx.lineWidth = width
          ctx.stroke()

          gradient = ctx.createLinearGradient(0, dir === 1 ? 0 : canvas.height, 0, levelYPos)
          gradient.addColorStop(0, linesGradient.colors[dir === 1 ? "up" : "down"])
          gradient.addColorStop(1, background.color)
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath()
          ctx.moveTo(level.x, level.y)
          dir *= -1
        }
      }
    }

    ctx.strokeStyle = colors[dir === 1 ? "up" : "down"]
    ctx.lineWidth = width
    ctx.stroke()

    ctx.lineTo(canvas.width - axiosSidebarWidth, levelYPos)
    gradient = ctx.createLinearGradient(0, dir === 1 ? 0 : canvas.height, 0, levelYPos)
    gradient.addColorStop(0, linesGradient.colors[dir === 1 ? "up" : "down"])
    gradient.addColorStop(1, background.color)
    ctx.fillStyle = gradient
    ctx.fill()
  }
}
