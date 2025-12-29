<!--
 * @Author: Gorvey 2324850628@qq.com
 * @Date: 2025-12-29 16:13:37
 * @LastEditors: Gorvey 2324850628@qq.com
 * @LastEditTime: 2025-12-29 16:14:19
 * @FilePath: \nuxt-gen-css-layout-app\app\components\layout\AppHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
/**
 * 顶部导航组件
 */

const configStore = useConfigStore()
const { showCodePreview, showLeftPanel, showRightPanel } = storeToRefs(configStore)
</script>

<template>
  <header
    class="h-14 shrink-0 border-b border-default bg-default flex items-center justify-between px-4"
  >
    <!-- 左侧操作 -->
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-layout-grid" class="size-6 text-primary" />
      <span class="font-semibold text-lg">CSS 布局生成器</span>
      <!-- 左侧面板切换按钮 -->
      <UButton
        :icon="showLeftPanel ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="configStore.toggleLeftPanel()"
      />
    </div>

    <!-- 右侧操作 -->
    <div class="flex items-center gap-2">
      <!-- 右侧面板切换按钮 -->
      <UButton
        :icon="showRightPanel ? 'i-lucide-panel-right-open' : 'i-lucide-panel-right-close'"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="configStore.toggleRightPanel()"
      />
      <!-- 代码预览按钮 -->
      <UButton
        :icon="showCodePreview ? 'i-lucide-eye-off' : 'i-lucide-code'"
        :variant="showCodePreview ? 'solid' : 'ghost'"
        :color="showCodePreview ? 'primary' : 'neutral'"
        size="sm"
        @click="configStore.toggleCodePreview()"
      >
        {{ showCodePreview ? '隐藏代码' : '预览代码' }}
      </UButton>
      <UColorModeButton />
    </div>
  </header>
</template>
