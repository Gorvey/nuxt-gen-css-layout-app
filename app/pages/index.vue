<script setup lang="ts">
/**
 * CSS 布局生成器主页面
 */

const configStore = useConfigStore()
const { showLeftPanel, showRightPanel, showCodePreview } = storeToRefs(configStore)

/** 计算面板区域高度，当 CodePreview 展开时减少高度 */
const panelAreaClass = computed(() => {
  return showCodePreview.value ? 'h-[calc(100%-500px)]' : 'h-full'
})
</script>

<template>
  <UApp>
    <div class="h-screen flex flex-col">
      <!-- 顶部导航 -->
      <LayoutAppHeader />

      <!-- 主体区域 -->
      <div :class="['flex overflow-hidden transition-all duration-200', panelAreaClass]">
        <!-- 左侧面板 -->
        <Transition name="slide-left">
          <LayoutLeftPanel v-if="showLeftPanel" class="w-72 shrink-0 h-full" />
        </Transition>

        <!-- 中间编辑器 -->
        <LayoutEditorCanvas class="flex-1" />

        <!-- 右侧面板 -->
        <Transition name="slide-right">
          <LayoutRightPanel v-if="showRightPanel" class="w-72 shrink-0" />
        </Transition>
      </div>

      <!-- 代码预览弹窗 -->
      <CodePreview />
    </div>
  </UApp>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  margin-left: -16rem;
  opacity: 0;
}

.slide-right-enter-from,
.slide-right-leave-to {
  margin-right: -18rem;
  opacity: 0;
}
</style>
