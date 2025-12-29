/**
 * 画布宽度管理 Composable
 */
const canvasWidthState = ref(75)

export function useCanvasWidth() {
  /**
   * 设置画布宽度
   * @param width - 宽度百分比
   */
  function setWidth(width: number) {
    canvasWidthState.value = Math.min(100, Math.max(50, width))
  }

  /**
   * 获取画布宽度样式
   */
  const widthStyle = computed(() => ({
    maxWidth: `${canvasWidthState.value}%`,
    margin: '0 auto',
  }))

  return {
    canvasWidth: canvasWidthState,
    setWidth,
    widthStyle,
  }
}
