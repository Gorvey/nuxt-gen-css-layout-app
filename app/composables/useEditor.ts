/**
 * 编辑器核心状态管理 Hook
 * 管理 DSL 节点树的增删改查
 */

import { nanoid } from 'nanoid'
import type {
  DSLNode,
  ContainerNode,
  ElementNode,
  ContainerLayout,
  ElementType,
  FlexLayoutConfig,
  StyleConfig,
} from '~/types/dsl'
import { isContainerNode } from '~/types/dsl'

/** 编辑器状态（单例） - 顶层节点列表 */
const nodes = ref<DSLNode[]>([])

/**
 * 创建默认的 Flex 布局配置
 * @returns Flex 布局配置
 */
function createDefaultFlexConfig(): FlexLayoutConfig {
  return {
    direction: 'row',
    justify: 'start',
    align: 'start',
    gap: 'md',
  }
}

/**
 * 创建默认的样式配置
 * @returns 样式配置
 */
function createDefaultStyles(): StyleConfig {
  return {
    padding: 'none',
    backgroundColor: 'transparent',
    borderRadius: 'none',
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
    children: [],
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
    styles: createDefaultStyles(),
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
 * 在节点树中递归查找父节点
 * @param nodeList - 节点列表
 * @param nodeId - 目标节点 ID
 * @param parent - 当前父节点
 * @returns 父节点或 undefined
 */
function findParentInTree(
  nodeList: DSLNode[],
  nodeId: string,
  parent?: ContainerNode
): ContainerNode | undefined {
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
 * 在顶层节点中查找父节点
 * @param nodeId - 目标节点 ID
 * @returns 父节点或 undefined
 */
function findParentInNodes(nodeId: string): ContainerNode | undefined {
  for (const node of nodes.value) {
    if (node.id === nodeId) {
      // 顶层节点没有父节点
      return undefined
    }
    if (isContainerNode(node)) {
      const found = findParentInTree(node.children, nodeId, node)
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
   * 添加节点
   * @param node - 要添加的节点
   * @param parentId - 父容器 ID（不传则添加到顶层）
   * @param index - 插入位置（可选，不传则追加到末尾）
   */
  const addNode = (node: DSLNode, parentId?: string, index?: number) => {
    // 如果没有指定 parentId，添加到顶层
    if (!parentId) {
      if (index !== undefined) {
        nodes.value.splice(index, 0, node)
      } else {
        nodes.value.push(node)
      }
      return
    }

    // 查找父容器并添加
    const parent = findNodeInTree(nodes.value, parentId)
    if (parent && isContainerNode(parent)) {
      if (index !== undefined) {
        parent.children.splice(index, 0, node)
      } else {
        parent.children.push(node)
      }
    }
  }

  /**
   * 删除节点
   * @param nodeId - 要删除的节点 ID
   */
  const removeNode = (nodeId: string) => {
    const removeFromList = (list: DSLNode[]): boolean => {
      const index = list.findIndex((n) => n.id === nodeId)
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
    removeFromList(nodes.value)
  }

  /**
   * 更新节点
   * @param nodeId - 节点 ID
   * @param updates - 要更新的字段
   */
  const updateNode = (nodeId: string, updates: Partial<DSLNode>) => {
    const node = findNodeInTree(nodes.value, nodeId)
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
    const node = findNodeInTree(nodes.value, nodeId)
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
    const node = findNodeInTree(nodes.value, nodeId)
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
    return findNodeInTree(nodes.value, nodeId)
  }

  /**
   * 查找父节点
   * @param nodeId - 节点 ID
   * @returns 父节点或 undefined
   */
  const findParent = (nodeId: string): ContainerNode | undefined => {
    return findParentInNodes(nodeId)
  }

  /**
   * 清空所有节点
   */
  const clearNodes = () => {
    nodes.value = []
  }

  /**
   * 移动节点到新位置（支持跨层级移动）
   * @param nodeId - 要移动的节点 ID
   * @param targetParentId - 目标父容器 ID（不传则移动到顶层）
   * @param targetIndex - 目标位置索引（不传则追加到末尾）
   */
  const moveNode = (nodeId: string, targetParentId?: string, targetIndex?: number) => {
    const node = findNodeInTree(nodes.value, nodeId)
    if (!node) return

    // 找到旧父节点
    let oldParent: ContainerNode | undefined
    let oldParentList: DSLNode[] = nodes.value
    for (const n of nodes.value) {
      if (n.id === nodeId) {
        // 顶层节点
        oldParent = undefined
        break
      }
      if (isContainerNode(n)) {
        const found = findNodeInTree(n.children, nodeId)
        if (found) {
          oldParent = n
          oldParentList = n.children
          break
        }
      }
    }

    const oldIndex = oldParentList.findIndex((n) => n.id === nodeId)
    if (oldIndex === -1) return

    oldParentList.splice(oldIndex, 1)

    // 如果没有指定目标父容器，移动到顶层
    let targetParentList: DSLNode[]
    if (!targetParentId) {
      targetParentList = nodes.value
    } else {
      const targetParent = findNodeInTree(nodes.value, targetParentId)
      if (targetParent && isContainerNode(targetParent)) {
        targetParentList = targetParent.children
      } else {
        targetParentList = nodes.value
      }
    }

    if (targetIndex !== undefined) {
      targetParentList.splice(targetIndex, 0, node)
    } else {
      targetParentList.push(node)
    }
  }

  return {
    nodes,
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
  }
}
