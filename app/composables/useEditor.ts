/**
 * 编辑器核心状态管理 Hook
 * 管理 DSL 节点树的增删改查
 */

import { nanoid } from 'nanoid'
import type { DSLNode, ContainerNode, ElementNode, ContainerLayout, ElementType, FlexLayoutConfig, StyleConfig } from '~/types/dsl'
import { isContainerNode } from '~/types/dsl'

/** 编辑器状态（单例） */
const nodes = ref<DSLNode[]>([])

/** Root 容器（单例，始终存在） */
const rootContainer = ref<ContainerNode>(createContainerNode('flex'))

/**
 * 创建默认的 Flex 布局配置
 * @returns Flex 布局配置
 */
function createDefaultFlexConfig(): FlexLayoutConfig {
  return {
    direction: 'row',
    justify: 'start',
    align: 'start',
    gap: 'md'
  }
}

/**
 * 创建默认的样式配置
 * @returns 样式配置
 */
function createDefaultStyles(): StyleConfig {
  return {
    padding: 'md',
    backgroundColor: 'transparent',
    borderRadius: 'none'
  }
}

/**
 * 创建容器节点
 * @param layout - 布局类型
 * @returns 容器节点
 */
function createContainerNode(layout: ContainerLayout = 'flex'): ContainerNode {
  return {
    id: nanoid(),
    type: 'container',
    layout,
    layoutConfig: createDefaultFlexConfig(),
    styles: createDefaultStyles(),
    children: []
  }
}

/**
 * 创建元素节点
 * @param elementType - 元素类型
 * @returns 元素节点
 */
function createElementNode(elementType: ElementType): ElementNode {
  return {
    id: nanoid(),
    type: 'element',
    elementType,
    styles: createDefaultStyles()
  }
}

/**
 * 在节点树中递归查找节点
 * @param nodeList - 节点列表
 * @param nodeId - 目标节点 ID
 * @returns 找到的节点或 undefined
 */
function findNodeInTree(nodeList: DSLNode[], nodeId: string): DSLNode | undefined {
  for (const node of nodeList) {
    if (node.id === nodeId) {
      return node
    }
    if (isContainerNode(node)) {
      const found = findNodeInTree(node.children, nodeId)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 在整个编辑器中查找节点（包括 Root 容器）
 * @param nodeId - 目标节点 ID
 * @returns 找到的节点或 undefined
 */
function findNodeInEditor(nodeId: string): DSLNode | undefined {
  // 先检查是否是 Root 容器本身
  if (rootContainer.value.id === nodeId) {
    return rootContainer.value
  }
  // 在 Root 容器的子节点中查找
  return findNodeInTree(rootContainer.value.children, nodeId)
}

/**
 * 在节点树中递归查找父节点
 * @param nodeList - 节点列表
 * @param nodeId - 目标节点 ID
 * @param parent - 当前父节点
 * @returns 父节点或 undefined（如果是根节点）
 */
function findParentInTree(nodeList: DSLNode[], nodeId: string, parent?: ContainerNode): ContainerNode | undefined {
  for (const node of nodeList) {
    if (node.id === nodeId) {
      return parent
    }
    if (isContainerNode(node)) {
      const found = findParentInTree(node.children, nodeId, node)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 在整个编辑器中查找父节点
 * @param nodeId - 目标节点 ID
 * @returns 父节点或 undefined（如果是 Root 容器的直接子节点，返回 Root 容器）
 */
function findParentInEditor(nodeId: string): ContainerNode | undefined {
  // 检查是否是 Root 容器的直接子节点
  for (const child of rootContainer.value.children) {
    if (child.id === nodeId) {
      return rootContainer.value
    }
    if (isContainerNode(child)) {
      const found = findParentInTree(child.children, nodeId, child)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 编辑器核心状态管理
 * @returns 编辑器状态和操作方法
 */
export function useEditor() {
  /**
   * 添加节点到 Root 容器
   * @param node - 要添加的节点
   * @param parentId - 父容器 ID（不传则添加到 Root 容器）
   * @param index - 插入位置（可选，不传则追加到末尾）
   */
  const addNode = (node: DSLNode, parentId?: string, index?: number) => {
    // 如果没有指定 parentId，添加到 Root 容器
    if (!parentId) {
      if (index !== undefined) {
        rootContainer.value.children.splice(index, 0, node)
      } else {
        rootContainer.value.children.push(node)
      }
      return
    }

    // 查找父容器并添加
    const parent = findNodeInEditor(parentId)
    if (parent && isContainerNode(parent)) {
      if (index !== undefined) {
        parent.children.splice(index, 0, node)
      } else {
        parent.children.push(node)
      }
    }
  }

  /**
   * 删除节点（不能删除 Root 容器）
   * @param nodeId - 要删除的节点 ID
   */
  const removeNode = (nodeId: string) => {
    // 不允许删除 Root 容器
    if (nodeId === rootContainer.value.id) return

    const removeFromList = (list: DSLNode[]): boolean => {
      const index = list.findIndex(n => n.id === nodeId)
      if (index !== -1) {
        list.splice(index, 1)
        return true
      }
      for (const node of list) {
        if (isContainerNode(node)) {
          if (removeFromList(node.children)) return true
        }
      }
      return false
    }
    removeFromList(rootContainer.value.children)
  }

  /**
   * 更新节点
   * @param nodeId - 节点 ID
   * @param updates - 要更新的字段
   */
  const updateNode = (nodeId: string, updates: Partial<DSLNode>) => {
    const node = findNodeInEditor(nodeId)
    if (node) {
      Object.assign(node, updates)
    }
  }

  /**
   * 更新节点样式
   * @param nodeId - 节点 ID
   * @param styles - 要更新的样式
   */
  const updateNodeStyles = (nodeId: string, styles: Partial<StyleConfig>) => {
    const node = findNodeInEditor(nodeId)
    if (node) {
      node.styles = { ...node.styles, ...styles }
    }
  }

  /**
   * 更新容器布局配置
   * @param nodeId - 节点 ID
   * @param layoutConfig - 要更新的布局配置
   */
  const updateLayoutConfig = (nodeId: string, layoutConfig: Partial<FlexLayoutConfig>) => {
    const node = findNodeInEditor(nodeId)
    if (node && isContainerNode(node)) {
      node.layoutConfig = { ...node.layoutConfig, ...layoutConfig }
    }
  }

  /**
   * 查找节点
   * @param nodeId - 节点 ID
   * @returns 节点或 undefined
   */
  const findNode = (nodeId: string): DSLNode | undefined => {
    return findNodeInEditor(nodeId)
  }

  /**
   * 查找父节点
   * @param nodeId - 节点 ID
   * @returns 父节点或 undefined
   */
  const findParent = (nodeId: string): ContainerNode | undefined => {
    return findParentInEditor(nodeId)
  }

  /**
   * 清空 Root 容器的所有子节点
   */
  const clearNodes = () => {
    rootContainer.value.children = []
  }

  /**
   * 移动节点到新位置（支持跨层级移动）
   * @param nodeId - 要移动的节点 ID
   * @param targetParentId - 目标父容器 ID（不传则移动到 Root 容器）
   * @param targetIndex - 目标位置索引（不传则追加到末尾）
   */
  const moveNode = (nodeId: string, targetParentId?: string, targetIndex?: number) => {
    // 不允许移动 Root 容器
    if (nodeId === rootContainer.value.id) return

    const node = findNodeInEditor(nodeId)
    if (!node) return

    const oldParent = findParentInEditor(nodeId)
    const oldParentList = oldParent ? oldParent.children : rootContainer.value.children
    const oldIndex = oldParentList.findIndex(n => n.id === nodeId)
    if (oldIndex === -1) return

    oldParentList.splice(oldIndex, 1)

    // 如果没有指定目标父容器，移动到 Root 容器
    const targetParent = targetParentId ? findNodeInEditor(targetParentId) : rootContainer.value
    const targetParentList = targetParent && isContainerNode(targetParent) ? targetParent.children : rootContainer.value.children

    if (targetIndex !== undefined) {
      targetParentList.splice(targetIndex, 0, node)
    } else {
      targetParentList.push(node)
    }
  }

  /**
   * 切换 Root 容器的布局类型
   * @param layout - 新的布局类型
   */
  const changeRootContainerType = (layout: ContainerLayout) => {
    rootContainer.value.layout = layout
    // 重置布局配置为默认
    rootContainer.value.layoutConfig = createDefaultFlexConfig()
  }

  return {
    nodes,
    rootContainer,
    addNode,
    removeNode,
    moveNode,
    updateNode,
    updateNodeStyles,
    updateLayoutConfig,
    findNode,
    findParent,
    clearNodes,
    createContainerNode,
    createElementNode,
    changeRootContainerType
  }
}
