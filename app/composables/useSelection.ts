/**
 * 节点选中状态管理 Hook
 * 管理当前选中的节点
 */

import type { DSLNode } from '~/types/dsl'

/**
 * 节点选中状态管理
 * @returns 选中状态和操作方法
 */
export function useSelection() {
  /** 选中状态（单例） */
  const selectedId = ref<string | null>(null)

  /**
   * 当前选中的节点
   */
  const selectedNode = computed<DSLNode | null>(() => {
    // TODO: 实现获取选中节点逻辑
    return null
  })

  /**
   * 选中节点
   * @param nodeId - 要选中的节点 ID
   */
  const select = (nodeId: string) => {
    selectedId.value = nodeId
  }

  /**
   * 取消选中
   */
  const deselect = () => {
    selectedId.value = null
  }

  /**
   * 切换选中状态
   * @param nodeId - 节点 ID
   */
  const toggle = (nodeId: string) => {
    if (selectedId.value === nodeId) {
      deselect()
    } else {
      select(nodeId)
    }
  }

  /**
   * 检查节点是否被选中
   * @param nodeId - 节点 ID
   * @returns 是否被选中
   */
  const isSelected = (nodeId: string): boolean => {
    return selectedId.value === nodeId
  }

  return {
    selectedId: readonly(selectedId),
    selectedNode,
    select,
    deselect,
    toggle,
    isSelected,
  }
}
