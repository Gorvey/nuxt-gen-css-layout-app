<script setup lang="ts">
/**
 * CSS 布局生成器主页面
 */
</script>

<template>
  <UApp>
    <div class="h-screen flex flex-col">
      <!-- 顶部导航 -->
      <LayoutAppHeader />

      <!-- 主体区域 -->
      <div class="flex-1 flex overflow-hidden">
        <!-- 左侧面板 -->
        <LayoutLeftPanel class="w-64 shrink-0 h-full" />

        <!-- 中间编辑器 -->
        <LayoutEditorCanvas class="flex-1" />

        <!-- 右侧面板 -->
        <LayoutRightPanel class="w-72 shrink-0" />
      </div>
    </div>
  </UApp>
</template>
