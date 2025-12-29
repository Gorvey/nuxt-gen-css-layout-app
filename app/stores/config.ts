/**
 * 配置状态管理 Store
 * 管理应用级配置状态
 */

/**
 * 配置状态管理 Store
 */
export const useConfigStore = defineStore('config', () => {
  /** 代码预览面板显示状态 */
  const showCodePreview = ref(false)

  /** 编辑器宽度（px） */
  const editorWidth = ref<number>(600)

  /** 编辑器高度（px） */
  const editorHeight = ref<number>(500)

  /**
   * 切换代码预览面板显示状态
   */
  const toggleCodePreview = () => {
    showCodePreview.value = !showCodePreview.value
  }

  /**
   * 显示代码预览面板
   */
  const openCodePreview = () => {
    showCodePreview.value = true
  }

  /**
   * 隐藏代码预览面板
   */
  const closeCodePreview = () => {
    showCodePreview.value = false
  }

  /**
   * 设置编辑器宽度
   * @param width - 宽度值（px）
   */
  const setEditorWidth = (width: number) => {
    editorWidth.value = width
  }

  /**
   * 设置编辑器高度
   * @param height - 高度值（px）
   */
  const setEditorHeight = (height: number) => {
    editorHeight.value = height
  }

  return {
    showCodePreview,
    editorWidth,
    editorHeight,
    toggleCodePreview,
    openCodePreview,
    closeCodePreview,
    setEditorWidth,
    setEditorHeight,
  }
})

/**
 * 配置 Store 类型导出
 */
export type ConfigStore = ReturnType<typeof useConfigStore>
