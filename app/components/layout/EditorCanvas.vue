<script setup lang="ts">
/**
 * 编辑器画布组件
 */
import { VueDraggable } from 'vue-draggable-plus'

const { nodes } = useEditor()
const { deselect } = useSelection()
const { widthStyle } = useCanvasWidth()

/**
 * 点击画布空白区域取消选中
 * @param event - 点击事件
 */
function handleCanvasClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    deselect()
  }
}
</script>

<template>
  <main class="bg-muted/30 overflow-auto p-6 relative" @click="handleCanvasClick">
    <!-- 节点渲染区域 -->
    <div class="min-h-full">
      <!-- 内容容器 -->
      <div class="transition-all duration-200" :style="widthStyle">
        <!-- 拖拽区域 -->
        <VueDraggable
          v-model="nodes"
          group="editor"
          :animation="200"
          :empty-insert-threshold="50"
          class="min-h-32 space-y-4"
        >
          <!-- 顶层节点 -->
          <EditorNodeRenderer v-for="node in nodes" :key="node.id" :node="node" />
        </VueDraggable>

        <!-- 空状态提示 -->
        <div
          v-if="nodes.length === 0"
          class="flex flex-col items-center justify-center py-24 text-muted"
        >
          <UIcon name="i-lucide-layout" class="size-16 mb-4 opacity-50" />
          <p class="text-lg font-medium mb-1">画布为空</p>
          <p class="text-sm">从左侧拖入容器或元素开始设计</p>
        </div>
      </div>
    </div>
  </main>
</template>
