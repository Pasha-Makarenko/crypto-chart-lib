import { inject, Injectable } from "@angular/core"
import { Store } from "../../store/store"
import { DataCacheService } from "../../../cache/data-cache.service"
import { range } from "../../../utils/range"
import { roundedList } from "../../../utils/roundedList"
import { indexOfMax } from "../../../utils/indexOf"

interface Point {
  x: number
  y: number
}

@Injectable({
  providedIn: "root"
})
export class CalculateConstantsService {
  private store = inject(Store)
  private cache = inject(DataCacheService)

  yPos(value: number) {
    const { canvas, options } = this.store
    const yRange = this.cache.get("yRange")

    if (!canvas || !options || !yRange) {
      return 0
    }

    return options.canvas.padding + (canvas.height - 2 * options.canvas.padding) * (1 - (value - yRange.min) / (yRange.max - yRange.min))
  }

  valueByYPos(yPos: number) {
    const { canvas, options } = this.store
    const yRange = this.cache.get("yRange")

    if (!canvas || !options || !yRange) {
      return 0
    }

    return (yRange.max - yRange.min) * (1 - (yPos - options.canvas.padding) / (canvas.height - 2 * options.canvas.padding)) + yRange.min
  }

  intersection(point1: Point, point2: Point) {
    const canvas = this.store.canvas
    const data = this.store.data$.value

    if (!canvas || !data) {
      return null
    }

    const levelY = data.items[0].value

    const result: Point = {
      x: (this.yPos(levelY) - point1.y) * (point2.x - point1.x) / (point2.y - point1.y) + point1.x,
      y: this.yPos(levelY)
    }

    return result
  }

  staticConstants() {
    const { options, canvas } = this.store
    const ctx = canvas?.getContext("2d")
    const data = this.store.data$.value

    if (!canvas || !ctx || !data || !options) {
      return
    }

    this.cache.clear("yRange")
    this.cache.clear("xStep")
    this.cache.clear("roundedList")

    const yRange = range(data.items.map(item => item.value))
    const roundedList_ = roundedList(yRange.min, yRange.max, this.store.options?.axios.count || 10)

    if (options.axios.enable) {
      this.cache.clear("axiosSidebarWidth")
      this.cache.clear("axiosSidebarLength")

      const axiosText = roundedList_[indexOfMax(roundedList_.map(number => number.toString().length)).index]

      ctx.font = `${options.axios.font.size}px ${options.axios.font.face}`
      const metrics = ctx.measureText(axiosText.toString())
      ctx.font = ""

      this.cache.set("axiosSidebarLength", axiosText.toString().length)
      this.cache.set("axiosSidebarWidth", metrics.width + 2 * options.axios.font.padding)
    } else {
      this.cache.set("axiosSidebarWidth", 0)
    }

    const xStep = (canvas.width - (this.cache.get("axiosSidebarWidth") || 0)) / (data.items.length - 1)

    this.cache.set("xStep", xStep)
    this.cache.set("yRange", yRange)
    this.cache.set("roundedList", roundedList_)
  }
}
