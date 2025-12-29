<script setup lang="ts">
/**
 * 编辑器画布组件
 */

const { nodes } = useEditor()

/**
 * 点击画布空白区域取消选中
 * @param event - 点击事件
 */
function handleCanvasClick(event: MouseEvent) {
  // TODO: 实现取消选中逻辑
}
</script>

<template>
  <main class="bg-muted/30 overflow-auto p-6 relative" @click="handleCanvasClick">
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
  </main>
</template>
