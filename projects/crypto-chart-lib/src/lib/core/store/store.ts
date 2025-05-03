import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { ChartData } from "../interfaces/data.interfaces"
import { ChartOptions } from "../interfaces/options.interfaces"

@Injectable({
  providedIn: "root"
})
export class Store {
  data$ = new BehaviorSubject<ChartData | null>(null)
  options: ChartOptions | null = null
  canvas: HTMLCanvasElement | null = null

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  setOptions(options: ChartOptions) {
    this.options = options
  }
}