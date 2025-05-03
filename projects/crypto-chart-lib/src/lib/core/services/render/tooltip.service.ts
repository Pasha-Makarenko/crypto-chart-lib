import { inject, Injectable } from "@angular/core"
import { Store } from "../../store/store"
import { DrawStaticService } from "./draw-static.service"
import { CalculateConstantsService } from "../calculate/calculate-constants.service"
import { DataCacheService } from "../../../cache/data-cache.service"
import { DrawAxiosService } from "./draw-axios.service"
import { parseDate } from "../../../utils/parseDate"

@Injectable({
  providedIn: "root"
})
export class TooltipService {
  private store = inject(Store)
  private cache = inject(DataCacheService)
  private drawStaticService = inject(DrawStaticService)
  private drawAxiosService = inject(DrawAxiosService)
  private calculateStaticService = inject(CalculateConstantsService)

  moveMoveHandler(event: MouseEvent) {
    const canvas = this.store.canvas
    const ctx = canvas?.getContext("2d")

    if (!canvas || !ctx || !this.store.data$.value) {
      return
    }

    this.drawStaticService.draw(this.store.data$.value)

    this.draw(event.offsetX, event.offsetY)
  }

  draw(x: number, y: number) {
    const canvas = this.store.canvas!

    if (x > canvas.width - this.cache.get("axiosSidebarWidth")) {
      return
    }

    this.drawCursor(x, y)
    this.drawTooltip(x, y)
  }

  drawCursor(x: number, y: number) {
    const canvas = this.store.canvas!
    const ctx = canvas?.getContext("2d")!
    const data = this.store.data$.value!
    const { tooltip, axios, lines } = this.store.options!
    const { lines: tooltipLines, point: tooltipPoint } = tooltip

    const xStep: number = this.cache.get("xStep")
    const index = Math.round(x / xStep)
    const point = {
      x: index * xStep,
      y: this.calculateStaticService.yPos(data.items[index].value)
    }
    const dir = Math.sign(data.items[index].value - data.items[0].value)

    ctx.beginPath()
    ctx.arc(point.x, point.y, tooltipPoint.radius, 0, 2 * Math.PI)

    ctx.fillStyle = tooltipPoint.color
    ctx.fill()

    if (dir) {
      ctx.beginPath()
      ctx.arc(point.x, point.y, tooltipPoint.radius - tooltipPoint.border, 0, 2 * Math.PI)

      ctx.fillStyle = lines.colors[dir === 1 ? "up" : "down"]
      ctx.fill()
    }

    ctx.beginPath()
    ctx.moveTo(point.x, 0)
    ctx.lineTo(point.x, canvas.height)
    ctx.setLineDash(tooltipLines.pattern)

    ctx.lineWidth = tooltipLines.width
    ctx.strokeStyle = tooltipLines.color
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width - this.cache.get("axiosSidebarWidth"), y)
    ctx.setLineDash(tooltipLines.pattern)

    ctx.lineWidth = tooltipLines.width
    ctx.strokeStyle = tooltipLines.color
    ctx.stroke()

    if (axios.enable && axios.sideText.enable) {
      this.drawAxiosService.drawSideText("end", this.calculateStaticService.valueByYPos(y))
    }
  }

  drawTooltip(x: number, y: number) {
    const canvas = this.store.canvas!
    const ctx = canvas?.getContext("2d")!
    const data = this.store.data$.value!
    const { tooltip } = this.store.options!
    const { offset, padding, radius, background, text: tooltipText } = tooltip

    const date = parseDate((x / canvas.width) * (data.timestamp.to - data.timestamp.from) + data.timestamp.from)
    const xStep: number = this.cache.get("xStep")
    const index = Math.round(x / xStep)
    const axiosSidebarLength: number = this.cache.get("axiosSidebarLength")

    const text = {
      date: `${date.date}/${date.month}/${date.year}`,
      time: `${date.hours}:${date.minutes}`,
      value: data.items[index].value.toString()
    }

    while (text.value.length < axiosSidebarLength) {
      text.value += "0"
    }

    while (text.value.length > axiosSidebarLength) {
      text.value = text.value.slice(0, axiosSidebarLength)
    }

    ctx.font = `${tooltipText.date.size}px ${tooltipText.date.face}`
    const metrics = {
      date: ctx.measureText(text.date),
      time: ctx.measureText(text.time),
      value: ctx.measureText(text.value)
    }

    ctx.font = `${tooltipText.value.size}px ${tooltipText.value.face}`
    metrics.value = ctx.measureText(text.value)

    const heights = {
      date: metrics.date.actualBoundingBoxAscent + metrics.date.actualBoundingBoxDescent,
      value: metrics.value.actualBoundingBoxAscent + metrics.value.actualBoundingBoxDescent
    }

    const width = 3 * padding + metrics.date.width + metrics.time.width
    const height = 3 * padding + heights.date + heights.value

    const point = {
      x: x - offset - width,
      y: y - height / 2
    }

    if (point.x < offset) {
      point.x = x + offset
    }

    if (point.y < offset) {
      point.y = offset
    }

    if (point.y > canvas.height - height - offset) {
      point.y = canvas.height - height - offset
    }

    ctx.beginPath()
    ctx.fillStyle = background
    ctx.roundRect(point.x, point.y, width, height, radius)
    ctx.fill()

    ctx.beginPath()
    ctx.font = `${tooltipText.date.size}px ${tooltipText.date.face}`
    ctx.fillStyle = tooltipText.date.color
    ctx.fillText(text.date, point.x + padding, point.y + padding + heights.date)
    ctx.fillText(text.time, point.x + width - padding - metrics.time.width, point.y + padding + heights.date)

    ctx.beginPath()
    ctx.font = `${tooltipText.value.size}px ${tooltipText.value.face}`
    ctx.fillStyle = tooltipText.value.color
    ctx.fillText(text.value, point.x + padding, point.y + 2 * padding + heights.date + heights.value)
  }

  mouseLiveHandler() {
    this.drawStaticService.clear()
    if (this.store.data$.value) {
      this.drawStaticService.draw(this.store.data$.value)
    }
  }
}