<script setup lang="ts">
/**
 * 组件树面板组件
 * 显示 DSL 节点的层级树结构
 */
import type { TreeItem } from '@nuxt/ui'
import type { DSLNode, ContainerNode } from '~/types/dsl'
import { isContainerNode } from '~/types/dsl'

const { nodes } = useEditor()
const { selectedId, select } = useSelection()

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
      const found = findNodeInTree((node as ContainerNode).children, nodeId)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 将 DSL 节点转换为 TreeItem 格式
 * @param node - DSL 节点
 * @returns TreeItem
 */
function nodeToTreeItem(node: DSLNode): TreeItem {
  const isContainer = isContainerNode(node)

  /** 根据节点类型获取图标 */
  const getIcon = (): string => {
    if (isContainer) {
      switch ((node as ContainerNode).layout) {
        case 'flex':
          return 'i-heroicons-squares-2x2'
        case 'grid':
          return 'i-heroicons-table-cells'
        case 'block':
          return 'i-heroicons-rectangle-stack'
      }
    } else {
      switch (node.elementType) {
        case 'text':
          return 'i-heroicons-font'
        case 'image':
          return 'i-heroicons-photo'
        case 'button':
          return 'i-heroicons-hand-thumb-up'
        case 'tag':
          return 'i-heroicons-tag'
        case 'divider':
          return 'i-heroicons-minus'
        case 'icon':
          return 'i-heroicons-star'
      }
    }
    return 'i-heroicons-square-3-stack-3d'
  }

  /** 递归构建子节点 */
  const buildChildren = (): TreeItem[] => {
    if (isContainer && (node as ContainerNode).children.length > 0) {
      return (node as ContainerNode).children.map((child) => nodeToTreeItem(child))
    }
    return []
  }

  const item: TreeItem = {
    label: node.id,
    icon: getIcon(),
    children: buildChildren(),
    // 默认展开所有容器节点
    defaultExpanded: isContainer,
  }

  return item
}

/**
 * 树形数据
 */
const treeItems = computed<TreeItem[]>(() => {
  if (!nodes.value.length) {
    return []
  }
  return nodes.value.map((node) => nodeToTreeItem(node))
})

/**
 * 获取节点的显示标签
 * @param nodeId - 节点 ID
 * @returns 显示标签
 */
function getNodeLabel(nodeId: string): string {
  const node = findNodeInTree(nodes.value, nodeId)
  if (!node) return nodeId

  const isContainer = isContainerNode(node)
  if (isContainer) {
    return `容器 (${node.layout})`
  }
  return `元素 (${node.elementType})`
}

/**
 * 获取所有节点 ID（用于默认展开）
 */
const allNodeIds = computed<string[]>(() => {
  const ids: string[] = []
  const collectIds = (nodeList: DSLNode[]) => {
    for (const node of nodeList) {
      ids.push(node.id)
      if (isContainerNode(node)) {
        collectIds((node as ContainerNode).children)
      }
    }
  }
  collectIds(nodes.value)
  return ids
})

/**
 * 处理节点选择
 * @param item - 选中的 TreeItem
 * @param event - 选择事件
 */
function handleSelect(event: any, item: TreeItem) {
  const nodeId = item.label as string
  select(nodeId)
}

/**
 * 获取节点的 key（使用节点 ID）
 * @param item - TreeItem
 * @returns 节点 ID
 */
function getGetKey(item: TreeItem): string {
  return item.label as string
}

/**
 * 阻止容器节点的点击选择（仅允许展开/折叠）
 * @param event - 切换事件
 * @param item - TreeItem
 */
function handleToggle(event: any, item: TreeItem) {
  // 容器节点点击箭头时只展开/折叠，不选中
  if (event.detail.originalEvent.type === 'click') {
    event.preventDefault()
  }
}
</script>

<template>
  <div class="component-tree-panel">
    <UTree
      v-model="selectedId"
      :items="treeItems"
      :get-key="getGetKey"
      :default-expanded="allNodeIds"
      color="primary"
      size="sm"
      @select="handleSelect"
      @toggle="handleToggle"
    >
      <template #item-label="{ item }">
        <span class="text-sm">{{ getNodeLabel(item.label as string) }}</span>
      </template>
    </UTree>

    <!-- 空状态 -->
    <div v-if="!nodes.length" class="flex flex-col items-center justify-center py-12 text-muted">
      <UIcon name="i-heroicons-folder-open" class="size-12 mb-2 opacity-50" />
      <p class="text-sm">暂无组件</p>
      <p class="text-xs opacity-75">从拖拽面板添加组件</p>
    </div>
  </div>
</template>

<style scoped>
.component-tree-panel {
  /* 组件树面板样式 */
}
</style>
