<script setup lang="ts">
/**
 * 顶部导航组件
 */
</script>

<template>
  <header
    class="h-14 shrink-0 border-b border-default bg-default flex items-center justify-between px-4"
  >
    <!-- 左侧 Logo -->
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-layout-grid" class="size-6 text-primary" />
      <span class="font-semibold text-lg">CSS 布局生成器</span>
    </div>

    <!-- 右侧操作 -->
    <div class="flex items-center gap-2">
      <UColorModeButton />
      <!-- TODO: 添加代码预览按钮 -->
    </div>
  </header>
</template>
