<script setup lang="ts">
/**
 * 编辑器画布组件
 * 支持拖拽平移、滚轮缩放和滚动
 */

import { useElementSize, useEventListener } from '@vueuse/core'

const editorStore = useEditorStore()
const pagesStore = usePagesStore()
const { nodes } = storeToRefs(editorStore)

/** 当前页面的编辑器尺寸 */
const editorWidth = computed(() => pagesStore.activePage?.editorWidth ?? 600)
const editorHeight = computed(() => pagesStore.activePage?.editorHeight ?? 500)

/** 视口变换状态 */
const transform = reactive({ x: 0, y: 0, scale: 1 })

/** 画布容器引用 */
const canvasRef = ref<HTMLElement | null>(null)

/** 视口容器引用 */
const viewportRef = ref<HTMLElement | null>(null)

/** 元素尺寸 */
const canvasSize = useElementSize(canvasRef)

/** 拖拽状态 */
const dragState = ref<{
  isDragging: boolean
  startX: number
  startY: number
  initialX: number
  initialY: number
}>({
  isDragging: false,
  startX: 0,
  startY: 0,
  initialX: 0,
  initialY: 0,
})

/** 调整宽度状态 */
const resizeState = ref<{
  isResizing: boolean
  edge: 'left' | 'right' | null
  startX: number
  startWidth: number
  startViewportX: number
}>({
  isResizing: false,
  edge: null,
  startX: 0,
  startWidth: 0,
  startViewportX: 0,
})

/** 鼠标悬停边缘 */
const hoverEdge = ref<'left' | 'right' | null>(null)

/** 变换样式 */
const transformStyle = computed(() => {
  return `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
})

/** 光标样式 */
const cursorStyle = computed(() => {
  if (resizeState.value.isResizing) {
    return resizeState.value.edge === 'left' ? 'w-resize' : 'e-resize'
  }
  if (hoverEdge.value === 'left') return 'w-resize'
  if (hoverEdge.value === 'right') return 'e-resize'
  return 'default'
})

/**
 * 检测边缘位置
 * @param event - 鼠标事件
 * @returns 边缘位置
 */
function detectEdge(event: MouseEvent): 'left' | 'right' | null {
  if (!viewportRef.value) return null

  const rect = viewportRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const threshold = 8

  if (x <= threshold) return 'left'
  if (x >= rect.width - threshold) return 'right'
  return null
}

/**
 * 自动适应画布
 */
function autoFit() {
  if (!canvasSize.width.value) return

  const padding = 80
  const availableWidth = canvasSize.width.value - padding
  const newScale = Math.min(1, availableWidth / editorWidth.value)
  const scaledWidth = editorWidth.value * newScale

  transform.x = (canvasSize.width.value - scaledWidth) / 2
  transform.y = 40
  transform.scale = newScale
}

/**
 * 重置为 1:1
 */
function resetToOneToOne() {
  transform.scale = 1
  if (canvasSize.width.value) {
    transform.x = (canvasSize.width.value - editorWidth.value) / 2
    transform.y = 40
  }
}

/**
 * 处理鼠标按下
 */
function handleMouseDown(event: MouseEvent) {
  if (event.button !== 0) return

  const edge = detectEdge(event)
  if (edge) {
    // 开始调整宽度
    resizeState.value = {
      isResizing: true,
      edge,
      startX: event.clientX,
      startWidth: editorWidth.value,
      startViewportX: transform.x,
    }
    event.stopPropagation()
    return
  }

  // 开始拖拽画布
  dragState.value = {
    isDragging: true,
    startX: event.clientX,
    startY: event.clientY,
    initialX: transform.x,
    initialY: transform.y,
  }
}

/**
 * 处理鼠标移动
 */
useEventListener(window, 'mousemove', (event: MouseEvent) => {
  // 处理调整宽度
  if (resizeState.value.isResizing) {
    const deltaX = event.clientX - resizeState.value.startX
    const newWidth = Math.max(
      320,
      resizeState.value.edge === 'right'
        ? resizeState.value.startWidth + deltaX
        : resizeState.value.startWidth - deltaX
    )
    const widthDelta = newWidth - resizeState.value.startWidth

    if (resizeState.value.edge === 'left') {
      transform.x = resizeState.value.startViewportX - widthDelta * transform.scale
    }

    pagesStore.setCurrentEditorWidth(newWidth)
    return
  }

  // 处理拖拽画布
  if (dragState.value.isDragging) {
    transform.x = dragState.value.initialX + (event.clientX - dragState.value.startX)
    transform.y = dragState.value.initialY + (event.clientY - dragState.value.startY)
  }
})

/**
 * 处理鼠标抬起
 */
useEventListener(window, 'mouseup', () => {
  dragState.value.isDragging = false
  resizeState.value.isResizing = false
  resizeState.value.edge = null
})

/**
 * 处理滚轮
 */
function handleWheel(event: WheelEvent) {
  if (resizeState.value.isResizing) {
    event.preventDefault()
    return
  }

  event.preventDefault()

  if (event.ctrlKey) {
    // 缩放
    const delta = -event.deltaY * 0.001
    const newScale = Math.max(0.1, Math.min(3, transform.scale + delta))

    if (canvasRef.value) {
      const rect = canvasRef.value.getBoundingClientRect()
      const mx = event.clientX - rect.left
      const my = event.clientY - rect.top
      const scaleChange = newScale / transform.scale

      transform.x = mx - (mx - transform.x) * scaleChange
      transform.y = my - (my - transform.y) * scaleChange
    }

    transform.scale = newScale
  } else {
    // 上下移动
    transform.y -= event.deltaY
  }
}

/**
 * 视口容器鼠标移动
 */
function handleViewportMouseMove(event: MouseEvent) {
  if (resizeState.value.isResizing) return
  hoverEdge.value = detectEdge(event)
}

/**
 * 视口容器鼠标离开
 */
function handleViewportMouseLeave() {
  hoverEdge.value = null
}

/**
 * 点击画布
 */
function handleCanvasClick(_event: MouseEvent) {
  // TODO: 实现取消选中逻辑
}

// 挂载后自动适应
onMounted(() => {
  autoFit()
})
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- 画布工具栏 -->
    <header
      class="bg-elevated h-12 border-b border-default flex items-center justify-between px-4 shrink-0"
    >
      <!-- 左侧：1:1 按钮 -->
      <UButton
        icon="i-lucide-expand"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="resetToOneToOne"
      >
        1:1
      </UButton>

      <!-- 右侧：宽高输入框 -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <span class="text-xs text-muted-foreground">W</span>
          <UInput
            :model-value="editorWidth"
            type="number"
            size="xs"
            class="w-20"
            @update:model-value="(v) => pagesStore.setCurrentEditorWidth(Number(v))"
          />
        </div>
        <span class="text-xs text-muted-foreground">×</span>
        <div class="flex items-center gap-1">
          <span class="text-xs text-muted-foreground">H</span>
          <UInput
            :model-value="editorHeight"
            type="number"
            size="xs"
            class="w-20"
            @update:model-value="(v) => pagesStore.setCurrentEditorHeight(Number(v))"
          />
        </div>
      </div>
    </header>

    <!-- 画布区域 -->
    <main
      ref="canvasRef"
      class="flex-1 bg-muted/99 overflow-hidden relative cursor-grab active:cursor-grabbing select-none dark:bg-muted/10"
      @mousedown="handleMouseDown"
      @wheel.prevent="handleWheel"
    >
      <!-- 视口容器 -->
      <div
        ref="viewportRef"
        class="viewport-container absolute top-0 left-0 bg-white"
        :style="{
          width: `${editorWidth}px`,
          height: `${editorHeight}px`,
          transform: transformStyle,
          transformOrigin: '0 0',
          cursor: cursorStyle,
        }"
        @mousemove="handleViewportMouseMove"
        @mouseleave="handleViewportMouseLeave"
        @mousedown="handleMouseDown"
        @click.stop="handleCanvasClick"
      >
        <!-- 左边缘调整指示器 -->
        <div
          class="absolute left-0 top-0 bottom-0 w-2 -ml-1 hover:bg-primary/20 transition-colors"
          :class="{
            'bg-primary/40':
              hoverEdge === 'left' || (resizeState.isResizing && resizeState.edge === 'left'),
          }"
        />

        <!-- 右边缘调整指示器 -->
        <div
          class="absolute right-0 top-0 bottom-0 w-2 -mr-1 hover:bg-primary/20 transition-colors"
          :class="{
            'bg-primary/40':
              hoverEdge === 'right' || (resizeState.isResizing && resizeState.edge === 'right'),
          }"
        />

        <!-- 节点渲染区域 -->
        <div class="min-h-full">
          <!-- 空状态提示 -->
          <div
            v-if="nodes.length === 0"
            class="flex flex-col items-center justify-center py-24 text-muted"
          >
            <UIcon name="i-lucide-layout" class="size-16 mb-4 opacity-50" />
            <p class="text-lg font-medium mb-1">画布为空</p>
            <p class="text-sm">从左侧拖入容器或元素开始设计</p>
          </div>

          <!-- TODO: 添加节点渲染和拖拽逻辑 -->
        </div>
      </div>
    </main>
  </div>
</template>
