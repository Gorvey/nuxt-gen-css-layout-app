<script setup lang="ts">
/**
 * CSS 布局生成器主页面
 */

const codeModalOpen = ref(false)
</script>

<template>
  <UApp>
    <div class="h-screen flex flex-col">
      <!-- 顶部导航 -->
      <LayoutAppHeader @generate="codeModalOpen = true" />

      <!-- 主体区域 -->
      <div class="flex-1 flex overflow-hidden">
        <!-- 左侧面板 -->
        <LayoutLeftPanel class="w-64 shrink-0" />

        <!-- 中间编辑器 -->
        <LayoutEditorCanvas class="flex-1" />

        <!-- 右侧面板 -->
        <LayoutRightPanel class="w-72 shrink-0" />
      </div>
    </div>

    <!-- 代码预览弹窗 -->
    <UModal v-model:open="codeModalOpen" title="生成代码" :ui="{ content: 'max-w-2xl' }">
      <template #body>
        <PanelCodePreview />
      </template>
    </UModal>
  </UApp>
</template>
