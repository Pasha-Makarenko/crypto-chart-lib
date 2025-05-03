export const getCanvasScreen = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return null
  }

  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

export const setCanvasScreen = (canvas: HTMLCanvasElement, canvasScreen: ImageData) => {
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return
  }

  ctx.putImageData(canvasScreen, 0, 0)
}