/**
 * 编辑器核心状态管理 Store
 * 管理 DSL 节点树的增删改查
 * 支持多页面，每个页面有独立的节点树
 */

import type {
  DSLNode,
  ContainerNode,
  ElementNode,
  ContainerLayout,
  ElementType,
  FlexLayoutConfig,
  StyleConfig,
} from '~/types/dsl'

/**
 * 查找节点的父节点和索引
 * @param nodes - 节点数组
 * @param nodeId - 要查找的节点 ID
 * @returns [父节点, 子节点索引]
 */
function findNodePath(nodes: DSLNode[], nodeId: string): [ContainerNode | null, number] | null {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node?.id === nodeId) return [null, i]
    if (node?.type === 'container') {
      const result = findNodePath(node.children, nodeId)
      if (result) return [node as ContainerNode, result[1]]
    }
  }
  return null
}

/**
 * 编辑器 Store
 */
export const useEditorStore = defineStore(
  'editor',
  () => {
    /** 页面 ID -> 节点树 的映射 */
    const nodesMap = ref<Map<string, DSLNode[]>>(new Map())

    /** 获取当前页面的节点列表 */
    const pagesStore = usePagesStore()
    const currentNodes = computed(() => {
      const pageId = pagesStore.activePageId
      if (!nodesMap.value.has(pageId)) {
        nodesMap.value.set(pageId, [])
      }
      return nodesMap.value.get(pageId)!
    })

    /**
     * 添加节点
     * @param node - 要添加的节点
     * @param parentId - 父容器 ID（不传则添加到顶层）
     * @param index - 插入位置（可选，不传则追加到末尾）
     */
    const addNode = (node: DSLNode, parentId?: string, index?: number) => {
      const targetList = parentId
        ? findNodePath(currentNodes.value, parentId)?.[0]?.children
        : currentNodes.value

      if (!targetList) {
        console.warn(`父节点 ${parentId} 不存在`)
        return
      }

      const insertIndex = index ?? targetList.length
      targetList.splice(insertIndex, 0, node)
    }

    /**
     * 删除节点
     * @param nodeId - 要删除的节点 ID
     */
    const removeNode = (nodeId: string) => {
      const pathInfo = findNodePath(currentNodes.value, nodeId)
      if (!pathInfo) {
        console.warn(`节点 ${nodeId} 不存在`)
        return
      }

      const [parentNode, index] = pathInfo
      const targetList = parentNode ? parentNode.children : currentNodes.value
      targetList.splice(index, 1)
    }

    /**
     * 获取目标节点及其所属列表
     * @param nodeId - 节点 ID
     * @returns [节点, 所属列表] 或 null
     */
    const getNodeWithList = (nodeId: string): [DSLNode, DSLNode[]] | null => {
      const pathInfo = findNodePath(currentNodes.value, nodeId)
      if (!pathInfo) return null

      const [parentNode, index] = pathInfo
      const list = parentNode ? parentNode.children : currentNodes.value
      const node = list[index]
      return node ? [node, list] : null
    }

    /**
     * 更新节点
     * @param nodeId - 节点 ID
     * @param updates - 要更新的字段
     */
    const updateNode = (nodeId: string, updates: Partial<DSLNode>) => {
      const result = getNodeWithList(nodeId)
      if (result) Object.assign(result[0], updates)
    }

    /**
     * 更新节点样式
     * @param nodeId - 节点 ID
     * @param styles - 要更新的样式
     */
    const updateNodeStyles = (nodeId: string, styles: Partial<StyleConfig>) => {
      const result = getNodeWithList(nodeId)
      if (result?.[0]?.styles) Object.assign(result[0].styles, styles)
    }

    /**
     * 更新容器布局配置
     * @param nodeId - 节点 ID
     * @param layoutConfig - 要更新的布局配置
     */
    const updateLayoutConfig = (nodeId: string, layoutConfig: Partial<FlexLayoutConfig>) => {
      const result = getNodeWithList(nodeId)
      const node = result?.[0]
      if (node && node.type === 'container' && node.layoutConfig) {
        Object.assign(node.layoutConfig, layoutConfig)
      }
    }

    /**
     * 获取指定页面的节点列表
     * @param pageId - 页面 ID
     * @returns 节点列表
     */
    const getNodesByPage = (pageId: string): DSLNode[] => {
      if (!nodesMap.value.has(pageId)) {
        nodesMap.value.set(pageId, [])
      }
      return nodesMap.value.get(pageId)!
    }

    /** 清除指定页面的节点 */
    const clearPageNodes = (pageId: string) => {
      nodesMap.value.set(pageId, [])
    }

    return {
      nodesMap,
      currentNodes,
      addNode,
      removeNode,
      updateNode,
      updateNodeStyles,
      updateLayoutConfig,
      getNodesByPage,
      clearPageNodes,
    }
  },
  {
    persist: {
      key: 'editor-store',
      storage: localStorage,
      serializer: {
        /** 反序列化：JSON 字符串 -> 状态对象（Map 恢复） */
        deserialize: (value: string) => {
          const parsed = JSON.parse(value)
          if (parsed.nodesMap) {
            parsed.nodesMap = new Map(Object.entries(parsed.nodesMap))
          }
          return parsed
        },
        /** 序列化：状态对象 -> JSON 字符串（Map 转对象） */
        serialize: (state: any) => {
          const toSerialize = { ...state }
          if (toSerialize.nodesMap instanceof Map) {
            toSerialize.nodesMap = Object.fromEntries(toSerialize.nodesMap)
          }
          return JSON.stringify(toSerialize)
        },
      },
    },
    // 禁用 SSR，避免水合不匹配
    ssr: false,
  }
)

/**
 * 编辑器 Store 类型导出
 */
export type EditorStore = ReturnType<typeof useEditorStore>
