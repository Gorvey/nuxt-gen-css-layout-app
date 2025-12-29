<script setup lang="ts">
/**
 * CSS 布局生成器主页面
 */

/** 代码预览浮层开关状态 */
const codePanelOpen = ref(false)
</script>

<template>
  <UApp>
    <div class="h-screen flex flex-col" :class="{ 'pb-[500px]': codePanelOpen }">
      <!-- 顶部导航 -->
      <LayoutAppHeader v-model:code-panel-open="codePanelOpen" />

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

    <!-- 代码预览底部浮层 -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="codePanelOpen"
        class="fixed bottom-0 left-0 right-0 h-[500px] bg-default border-t border-default shadow-2xl z-50"
      >
        <div class="h-full flex flex-col">
          <!-- 浮层头部 -->
          <div class="shrink-0 h-12 border-b border-default flex items-center justify-between px-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-code" class="size-5 text-primary" />
              <span class="font-medium">代码预览</span>
            </div>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="codePanelOpen = false"
            />
          </div>

          <!-- 浮层内容 -->
          <div class="flex-1 overflow-auto p-4">
            <PanelCodePreview />
          </div>
        </div>
      </div>
    </Transition>
  </UApp>
</template>
