<script setup lang="ts">
/**
 * 节点渲染器组件
 * 递归渲染 DSL 节点树
 */
import { VueDraggable } from 'vue-draggable-plus'
import type { DragChangeEvent } from 'vue-draggable-plus'
import type { DSLNode, ContainerNode, ElementNode } from '~/types/dsl'
import { isContainerNode } from '~/types/dsl'
import {
  getPaddingClass,
  getBorderRadiusClass,
  getBackgroundColorClass,
  getFlexDirectionClass,
  getFlexJustifyClass,
  getFlexAlignClass,
  getGapClass,
  getFlexGrowClass,
  getFlexShrinkClass,
  getFlexBasisClass,
} from '~/constants/presets'

const props = defineProps<{
  /** 要渲染的节点 */
  node: DSLNode
  /** 是否为 Root 容器 */
  isRoot?: boolean
}>()

const { findNode, removeNode, findParent, moveNode, rootContainer } = useEditor()
const { isSelected, select, deselect } = useSelection()

/** 是否为 Root 容器 */
const isRootContainer = computed(() => props.isRoot || props.node.id === rootContainer.value.id)

/** 父节点是否为 flex 容器 */
const isInFlexContainer = computed(() => {
  // Root 容器不在任何容器内
  if (isRootContainer.value) return false
  const parent = findParent(props.node.id)
  return parent && parent.layout === 'flex'
})

/** 是否选中 */
const selected = computed(() => isSelected(props.node.id))

/** 是否为容器 */
const isContainer = computed(() => isContainerNode(props.node))

/** 获取可写的容器节点引用 */
const containerNode = computed(() => {
  if (!isContainer.value) return null
  return findNode(props.node.id) as ContainerNode | null
})

/**
 * 生成容器外层样式类（不包含 flex 布局）
 * @param node - 容器节点
 */
function getContainerWrapperClasses(node: ContainerNode): string[] {
  const classes: string[] = ['relative border-2 transition-colors cursor-pointer']

  if (node.styles.padding && node.styles.padding !== 'none') {
    classes.push(getPaddingClass(node.styles.padding))
  }
  if (node.styles.backgroundColor && node.styles.backgroundColor !== 'transparent') {
    classes.push(getBackgroundColorClass(node.styles.backgroundColor))
  }
  if (node.styles.borderRadius && node.styles.borderRadius !== 'none') {
    classes.push(getBorderRadiusClass(node.styles.borderRadius))
  }

  // 如果在 flex 容器内,处理 flexItem 配置
  if (isInFlexContainer.value) {
    const flexItem = node.styles.flexItem || { grow: 0, shrink: 1, basis: 'auto', width: 'full' }
    classes.push(getFlexGrowClass(flexItem.grow))
    classes.push(getFlexShrinkClass(flexItem.shrink))
    classes.push(getFlexBasisClass(flexItem.basis))
    // width 快捷设置,默认 full
    if (flexItem.width === 'full') {
      classes.push('w-full')
    }
  }

  return classes
}

/**
 * 生成容器内层拖拽区域样式类（包含 flex 布局）
 * @param node - 容器节点
 */
function getContainerDraggableClasses(node: ContainerNode): string[] {
  const classes: string[] = ['min-h-16']

  if (node.layout === 'flex') {
    classes.push('flex')
    classes.push(getFlexDirectionClass(node.layoutConfig.direction))
    classes.push(getFlexJustifyClass(node.layoutConfig.justify))
    classes.push(getFlexAlignClass(node.layoutConfig.align))
    if (node.layoutConfig.gap !== 'none') {
      classes.push(getGapClass(node.layoutConfig.gap))
    }
  }

  return classes
}

/**
 * 生成元素样式类
 * @param node - 元素节点
 */
function getElementClasses(node: ElementNode): string[] {
  const classes: string[] = []

  if (node.styles.padding && node.styles.padding !== 'none') {
    classes.push(getPaddingClass(node.styles.padding))
  }
  if (node.styles.backgroundColor && node.styles.backgroundColor !== 'transparent') {
    classes.push(getBackgroundColorClass(node.styles.backgroundColor))
  }
  if (node.styles.borderRadius && node.styles.borderRadius !== 'none') {
    classes.push(getBorderRadiusClass(node.styles.borderRadius))
  }

  // 如果在 flex 容器内,处理 flexItem 配置
  if (isInFlexContainer.value) {
    const flexItem = node.styles.flexItem || { grow: 0, shrink: 1, basis: 'auto', width: 'full' }
    classes.push(getFlexGrowClass(flexItem.grow))
    classes.push(getFlexShrinkClass(flexItem.shrink))
    classes.push(getFlexBasisClass(flexItem.basis))
    // width 快捷设置,默认 full
    if (flexItem.width === 'full') {
      classes.push('w-full')
    }
  }

  return classes
}

/**
 * 处理节点点击
 * @param event - 点击事件
 */
function handleClick(event: MouseEvent) {
  event.stopPropagation()
  select(props.node.id)
}

/**
 * 处理删除节点
 * @param event - 点击事件
 */
function handleDelete(event: MouseEvent) {
  event.stopPropagation()
  removeNode(props.node.id)
  deselect()
}

/**
 * 处理容器内拖拽移动事件（阻止跨层级克隆）
 * @param event - 拖拽事件
 */
function handleMove(event: DragChangeEvent) {
  const { to, from, oldIndex, newIndex, originalEvent } = event
  if (to !== from) {
    originalEvent.preventDefault()
    const draggedElement = from.children[oldIndex] as HTMLElement
    const nodeId = draggedElement.dataset.nodeId
    if (nodeId && isContainer.value) {
      moveNode(nodeId, props.node.id, newIndex)
    }
  }
}
</script>

<template>
  <!-- 容器节点 -->
  <div
    v-if="isContainer && containerNode"
    :class="[
      ...getContainerWrapperClasses(node as ContainerNode),
      selected ? 'border-primary' : 'border-dashed border-default hover:border-muted',
      isRootContainer && 'min-h-64',
    ]"
    @click="handleClick"
  >
    <!-- 选中时显示操作按钮（Root 容器不显示删除按钮） -->
    <div v-if="selected && !isRootContainer" class="absolute -bottom-9 left-0 z-10 flex gap-1">
      <UButton
        icon="i-lucide-trash-2"
        size="xs"
        color="error"
        variant="solid"
        @click="handleDelete"
      />
    </div>

    <!-- 子节点拖拽区域（始终渲染，支持拖入） -->
    <VueDraggable
      v-model="containerNode.children"
      group="editor"
      :animation="200"
      :empty-insert-threshold="50"
      @move="handleMove"
      :class="getContainerDraggableClasses(node as ContainerNode)"
    >
      <!-- 子节点 -->
      <EditorNodeRenderer v-for="child in containerNode.children" :key="child.id" :node="child" />
    </VueDraggable>

    <!-- 空容器提示（放在拖拽区域外部） -->
    <div
      v-if="containerNode.children.length === 0"
      class="absolute inset-0 flex items-center justify-center text-muted text-sm pointer-events-none"
    >
      {{ isRootContainer ? '从左侧拖入元素或容器' : '拖入元素或容器' }}
    </div>
  </div>

  <!-- 元素节点 -->
  <div
    v-else-if="!isContainer"
    :class="[
      ...getElementClasses(node as ElementNode),
      'relative border-2 transition-colors cursor-pointer',
      selected ? 'border-primary' : 'border-transparent hover:border-muted',
    ]"
    @click="handleClick"
  >
    <!-- 选中时显示操作按钮 -->
    <div v-if="selected" class="absolute -bottom-9 left-0 z-10 flex gap-1">
      <UButton
        icon="i-lucide-trash-2"
        size="xs"
        color="error"
        variant="solid"
        @click="handleDelete"
      />
    </div>

    <!-- 文本元素 -->
    <div v-if="(node as ElementNode).elementType === 'text'" class="text-base text-default">
      占位文本内容
    </div>

    <!-- 图片元素 -->
    <div
      v-else-if="(node as ElementNode).elementType === 'image'"
      class="w-16 h-16 bg-muted/50 rounded flex items-center justify-center"
    >
      <UIcon name="i-lucide-image" class="size-6 text-muted" />
    </div>

    <!-- 按钮元素 -->
    <div
      v-else-if="(node as ElementNode).elementType === 'button'"
      class="px-4 py-2 bg-primary text-white rounded text-sm inline-flex items-center gap-2"
    >
      <UIcon name="i-lucide-square" class="size-4" />
      <span>按钮</span>
    </div>

    <!-- Tag 元素 -->
    <div
      v-else-if="(node as ElementNode).elementType === 'tag'"
      class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm inline-flex items-center gap-1.5"
    >
      <UIcon name="i-lucide-tag" class="size-3" />
      <span>Tag</span>
    </div>

    <!-- 图标元素 -->
    <div
      v-else-if="(node as ElementNode).elementType === 'icon'"
      class="min-w-8 min-h-8 flex items-center justify-center"
    >
      <UIcon name="i-lucide-star" class="size-6 text-muted" />
    </div>

    <!-- 分割线元素 -->
    <div
      v-else-if="(node as ElementNode).elementType === 'divider'"
      class="w-full h-px bg-border"
    />
  </div>
</template>
