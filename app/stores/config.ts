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

  /** 左侧面板显示状态 */
  const showLeftPanel = ref(true)

  /** 右侧面板显示状态 */
  const showRightPanel = ref(true)

  /**
   * 切换代码预览面板显示状态
   */
  const toggleCodePreview = () => {
    showCodePreview.value = !showCodePreview.value
  }

  /**
   * 切换左侧面板显示状态
   */
  const toggleLeftPanel = () => {
    showLeftPanel.value = !showLeftPanel.value
  }

  /**
   * 切换右侧面板显示状态
   */
  const toggleRightPanel = () => {
    showRightPanel.value = !showRightPanel.value
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

  return {
    showCodePreview,
    showLeftPanel,
    showRightPanel,
    toggleCodePreview,
    toggleLeftPanel,
    toggleRightPanel,
    openCodePreview,
    closeCodePreview,
  }
})

/**
 * 配置 Store 类型导出
 */
export type ConfigStore = ReturnType<typeof useConfigStore>
