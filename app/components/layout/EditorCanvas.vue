<script setup lang="ts">
/**
 * 编辑器画布组件
 */
const { rootContainer } = useEditor()
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
    <!-- Root 容器渲染区域 -->
    <div class="min-h-full">
      <!-- 内容容器 -->
      <div class="transition-all duration-200" :style="widthStyle">
        <!-- Root 容器 -->
        <EditorNodeRenderer :node="rootContainer" :is-root="true" />
      </div>
    </div>
  </main>
</template>
