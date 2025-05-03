import { inject, Injectable } from "@angular/core"
import { Store } from "../../store/store"
import { DataCacheService } from "../../../cache/data-cache.service"
import { CalculateConstantsService } from "../calculate/calculate-constants.service"

@Injectable({
  providedIn: "root"
})
export class DrawAxiosService {
  private store = inject(Store)
  private cache = inject(DataCacheService)
  private calculateStaticService = inject(CalculateConstantsService)

  draw() {
    const { canvas, options } = this.store

    if (!canvas || !options) {
      return
    }

    const { font, dashed, width, color } = options.axios

    const ctx = canvas.getContext("2d")!

    const roundedList: number[] = this.cache.get("roundedList")
    const axiosSidebarWidth: number = this.cache.get("axiosSidebarWidth")
    const axiosSidebarLength: number = this.cache.get("axiosSidebarLength")

    for (let i = 0; i < roundedList.length; i++) {
      const y = this.calculateStaticService.yPos(roundedList[i])
      let text = roundedList[i].toString()

      while (text.length < axiosSidebarLength) {
        text += "0"
      }

      ctx.beginPath()

      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width - axiosSidebarWidth, y)

      ctx.strokeStyle = color
      ctx.lineWidth = width

      ctx.stroke()

      ctx.font = `${font.size}px ${font.face}`
      ctx.fillStyle = font.color
      ctx.fillText(
        text,
        canvas.width - axiosSidebarWidth + font.padding,
        this.calculateStaticService.yPos(roundedList[i])
      )
    }

    const levelY = this.store.data$.value!.items[0].value!
    const levelYPos = this.calculateStaticService.yPos(levelY)

    ctx.beginPath()
    ctx.moveTo(0, levelYPos)
    ctx.lineTo(canvas.width - axiosSidebarWidth, levelYPos)
    ctx.setLineDash(dashed.pattern)
    ctx.strokeStyle = dashed.color
    ctx.lineWidth = dashed.width
    ctx.stroke()
  }

  drawSideText(type: "start" | "end", value: number, growColor?: "up" | "down") {
    const { canvas, options } = this.store

    if (!canvas || !options) {
      return
    }

    const { sideText, font } = options.axios

    const ctx = canvas.getContext("2d")!
    const axiosSidebarWidth: number = this.cache.get("axiosSidebarWidth")
    const axiosSidebarLength: number = this.cache.get("axiosSidebarLength")

    const point = {
      x: type === "start" ? 0 : canvas.width - axiosSidebarWidth,
      y: this.calculateStaticService.yPos(value)
    }

    ctx.beginPath()
    ctx.font = `${font.size}px ${font.face}`

    let text = value.toString()

    while (text.length < axiosSidebarLength) {
      text += "0"
    }

    while (text.length > axiosSidebarLength) {
      text = text.slice(0, axiosSidebarLength)
    }

    const metrics = ctx.measureText(text)
    const width = metrics.width
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

    ctx.fillStyle = growColor ? options.lines.colors[growColor] : sideText.background[type]
    ctx.roundRect(point.x, point.y - height / 2 - font.padding, width + 2 * font.padding, height + 2 * font.padding, sideText.radius)
    ctx.fill()

    ctx.fillStyle = growColor ? sideText.growColor : sideText.color[type]
    ctx.fillText(text, point.x + font.padding, point.y - height / 2 + font.padding)
  }
}
